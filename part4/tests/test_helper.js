const Blog = require('../models/blogSchema')
const User = require('../models/userSchema')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: '65c00e17421e735a2a7f75d7',
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: '65c00e17421e735a2a7f75d7',
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    author: 'jane doe',
    title: 'willremovethissoon',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

const tokenExtractor = async (api, username, password) => {
  const res = await api.post('/api/login').send({ username, password })
  const { token } = res.body

  return token
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  tokenExtractor,
}
