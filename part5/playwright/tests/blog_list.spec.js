const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog, ensureLoggedIn } = require("./helper");

describe("Note app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Jane Doe",
        username: "janedoe",
        password: "password",
      },
    });

    await page.goto("/");
  });

  test("Show login form", async ({ page }) => {
    await page.goto("/");

    const locator = page.getByTestId("login-form");
    await expect(locator).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Login to the Blogger" })
    ).toBeVisible();
  });

  describe("Try to Login", () => {
    test("logining with correct credentials", async ({ page }) => {
      await loginWith(page, "janedoe", "password");
      await expect(page.getByText("Jane Doe is logged in")).toBeVisible();
    });

    test("failing with wrong credentials", async ({ page }) => {
      await page.fill('[data-testid="username"]', "janedoe");
      await page.fill('[data-testid="password"]', "wrong");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("something went wrong")).toBeVisible();
    });
  });

  describe("Succesfully Logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "janedoe", "password");
    });

    test("A new blog can be created by the user", async ({ page }) => {
      const blog = {
        title: "created by playwright",
        author: "jane doe",
        url: "test-url",
      };
      await createBlog(page, blog);

      await expect(
        page.getByText("created by playwright - jane")
      ).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      const blog = {
        title: "new blog",
        author: "jane doe",
        url: "test-url",
      };
      await createBlog(page, blog);

      await page.getByRole("button", { name: "view" }).click();
      await page.getByTestId("like-btn").click();
      await expect(page.getByText("Likes : 1")).toBeVisible();
    });

    test("user can delete own blogs", async ({ page }) => {
      const blog = {
        title: "new blog",
        author: "jane doe",
        url: "test-url",
      };

      await createBlog(page, blog);
      await page.getByRole("button", { name: "view" }).click();

      await page.on("dialog", async (dialog) => {
        expect(dialog.message()).toContain("Blog deleted by jane doe");
        await dialog.accept();
      });
      await page.getByRole("button", { name: "remove" }).click();

      await expect(page.getByText("new blog - jane")).not.toBeVisible();
    });

    test("only user can see delete button to delete own blogs", async ({
      page,
      request,
    }) => {
      await request.post("/api/users", {
        data: {
          name: "Jane Doe",
          username: "janedoe",
          password: "password",
        },
      });

      const blog = {
        title: "new blog",
        author: "John Doe",
        url: "johndoe123.com",
      };

      await createBlog(page, blog);
      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByRole("button", { name: "remove" })).toBeVisible();

      await page.click("button:has-text('logout')");

      await loginWith(page, "janedoe", "password");
      await page.getByRole("button", { name: "view" }).click();

      await expect(
        page.getByRole("button", { name: "remove" })
      ).not.toBeVisible();
    });

    test.only("blogs sorted by likes", async ({ page, request }) => {
      const blogs = [
        { title: "Blog 1", author: "Author 1", url: "url1", likes: 5 },
        { title: "Blog 2", author: "Author 2", url: "url2", likes: 15 },
        { title: "Blog 3", author: "Author 3", url: "url3", likes: 10 },
      ];
      const token = await page
        .evaluate(() => localStorage.getItem("loggedUser"))
        .then((userString) => userString && JSON.parse(userString).token);
      for (const blog of blogs) {
        await request.post("/api/blogs", {
          headers: { Authorization: `Bearer ${token}` },
          data: blog,
        });
      }

      await page.reload();
      await page.waitForTimeout(3000);
      const blogTitles = await page.evaluate(() =>
        Array.from(document.querySelectorAll("#blog-title")).map((el) => {
          const titleText = el.textContent.trim();
          return titleText.split(" - ")[0] || titleText;
        })
      );

      expect(blogTitles.length).toBe(blogs.length);
      const sortedBlogTitles = blogs
        .sort((a, b) => b.likes - a.likes)
        .map((b) => b.title);
      expect(blogTitles).toEqual(sortedBlogTitles);
    });
  });
});
