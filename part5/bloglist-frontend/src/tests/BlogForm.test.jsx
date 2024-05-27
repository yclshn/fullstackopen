import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "../components/BlogForm";

describe("Blog Form", () => {
  test("calling event handler with the right details when a new blog is created", async () => {
    const testCreateBlog = vi.fn();
    render(<BlogForm createBlog={testCreateBlog} />);

    const userInputs = {
      author: screen.getByPlaceholderText(/author/i),
      title: screen.getByPlaceholderText(/title/i),
      url: screen.getByPlaceholderText(/url/i),
    };

    const newBlog = {
      title: "A title",
      author: "Jane Doe",
      url: "http://test.com/new_blog",
    };

    await userEvent.type(userInputs.author, newBlog.author);
    await userEvent.type(userInputs.title, newBlog.title);
    await userEvent.type(userInputs.url, newBlog.url);

    const submitButton = screen.getByDisplayValue(/create/);
    await userEvent.click(submitButton);

    expect(testCreateBlog).toHaveBeenCalledWith(newBlog);
  });
});
