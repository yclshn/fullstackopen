import "@testing-library/jest-dom";
import Blog from "../components/Blog";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

describe("Blog", () => {
  const blog = {
    title: "Test Blog Title",
    author: "Test Author",
    url: "http://testurl.com",
    likes: 10,
    user: {
      name: "Test User",
      username: "testuser",
    },
  };

  test("displayig the blog's title and author", () => {
    render(<Blog blog={blog} user={blog.user} />);

    const title = screen.getByText(/test blog title/i);
    const author = screen.getByText(/test author/i);

    expect(title).toBeInTheDocument();
    expect(author).toBeInTheDocument();

    const urlElement = screen.queryByText(blog.url);
    const likesElement = screen.queryByText(/likes: \d+/i);

    expect(urlElement).toBeNull();
    expect(likesElement).toBeNull();
  });

  test("displaying the blog's URL and like when cliked", async () => {
    render(<Blog blog={blog} user={blog.user} />);

    const user = userEvent.setup();
    const viewButton = screen.getByRole("button", { name: /view/i });
    await user.click(viewButton);

    const urlElement = screen.getByRole("link");
    const likesElement = screen.getByText(/likes/i);
    expect(urlElement).toBeInTheDocument();
    expect(likesElement).toBeInTheDocument();
  });

  test("calling the event handler twice when button cliked", async () => {
    const mockHandler = vi.fn();
    render(<Blog blog={blog} user={blog.user} updateLike={mockHandler} />);

    const viewButton = screen.getByRole("button", { name: /view/i });
    await userEvent.click(viewButton);

    const likeButton = screen.getByTestId("like-btn");
    await userEvent.click(likeButton);
    await userEvent.click(likeButton);

    expect(mockHandler).toHaveBeenCalledTimes(2);
  });
});
