const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const maxNumber = Math.max(...blogs.map((blog) => blog.likes))
  const choosenBlog = blogs.find((blog) => {
    return blog.likes === maxNumber
  })
  if (!choosenBlog) return null
  return {
    title: choosenBlog.title,
    author: choosenBlog.author,
    likes: choosenBlog.likes,
  }
}

const mostBlogs = (blogs) => {
  const author = [...blogs]
    .sort((a, b) => {
      blogs.filter((blog) => blog.author === a.author).length -
        blogs.filter((blog) => blog.author === b.author).length
    })
    .pop()

  const blogNumber = blogs.filter(
    (blog) => blog.author === author.author
  ).length

  return { author: author.author, blogs: blogNumber }
}

const mostLikes = (blogs) => {
  const author = [...blogs]
    .sort((a, b) => {
      return (
        blogs
          .filter((blog) => blog.author === a.author)
          .reduce((acc, blog) => acc + blog.likes, 0) -
        blogs
          .filter((blog) => blog.author === b.author)
          .reduce((acc, blog) => acc + blog.likes, 0)
      )
    })
    .pop()

  const mostBlogLikes = blogs
    .filter((blog) => blog.author === author.author)
    .reduce((acc, blog) => acc + blog.likes, 0)

  return {
    author: author.author,
    likes: mostBlogLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
