import { useState } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ createBlog }) => {
  const [blog, setBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const addBlog = async (e) => {
    e.preventDefault();
    try {
      await createBlog(blog);
      setBlog({ title: "", author: "", url: "" });
    } catch {
      console.log("error: Something went wrong");
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  return (
    <form onSubmit={addBlog}>
      <h2>create new</h2>
      <div>
        <input
          type="text"
          name="title"
          value={blog.title}
          onChange={handleInput}
          placeholder="title"
        />
      </div>
      <div>
        <input
          type="text"
          name="author"
          value={blog.author}
          onChange={handleInput}
          placeholder="author"
        />
      </div>
      <div>
        <input
          type="text"
          name="url"
          value={blog.url}
          onChange={handleInput}
          placeholder="url"
        />
      </div>
      <div>
        <input type="submit" value="create" />
      </div>
    </form>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
