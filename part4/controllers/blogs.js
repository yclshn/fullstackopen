const blogsRouter = require('express').Router()
const Blog = require('../models/blogSchema')
const User = require('../models/userSchema')

// Get All
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  res.send(blogs)
})

//Get by Id
blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user', {
    username: 1,
    name: 1,
  })
  if (blog) {
    res.send(blog)
  } else {
    res.sendStatus(404)
  }
})

//Create a blog
blogsRouter.post('/', async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(req.userId)

  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
    user: user.id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).send(savedBlog)
})

//Delete a blog
blogsRouter.delete('/:id', async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'no token' })
  }

  const blog = await Blog.findById(req.params.id)
  const userId = blog.user.toString()

  if (req.userId === userId) {
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  }
  if (req.userId !== userId) {
    return res
      .status(401)
      .json({ error: 'only creater of blog can delete blog' })
  }
})

//Replace by Id
blogsRouter.put('/:id', async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'creators can update their blog' })
  }

  const blog = await Blog.findById(req.params.id)
  const userId = blog.user.toString()

  if (req.userId === userId) {
    const blogToUpdate = new Blog({
      id: req.body.id,
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes,
    })

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      blogToUpdate,
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    )
    res.send(updatedBlog)
  }

  if (req.userId !== userId) {
    return res
      .status(401)
      .json({ error: 'only creators can update their blog' })
  }
})

module.exports = blogsRouter
