import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, updateLike, deleteBlog, user }) => {
  const [isVisible, setIsVisible] = useState(false);
  const handleLike = () => updateLike(blog);
  const handleDelete = () => deleteBlog(blog);

  return (
    <div>
      <h3>
        <p id="blog-title">
          {blog.title} - {blog.author}
        </p>
        <button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? "hide" : "view"}
        </button>
      </h3>
      {isVisible && (
        <div className="hidden-content">
          <a href={blog.url}>{blog.url}</a>
          <p>
            Likes : {blog.likes}
            <button onClick={handleLike} data-testid="like-btn">
              👍
            </button>
          </p>
          <p> added by: {blog?.user?.name} </p>
          {user.username === blog?.user?.username && (
            <button onClick={handleDelete}>Delete</button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateLike: PropTypes.func,
  deleteBlog: PropTypes.func,
  user: PropTypes.object,
};

export default Blog;
