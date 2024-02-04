const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/userSchema')

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const userExist = await User.findOne({ username })

  if (userExist) {
    return res.status(400).json({ error: 'username is already exists' })
  }

  if (!userExist) {
    if (username.length < 3) {
      return res.status(400).json({ error: 'username must be longer than 3' })
    }
    if (password.length < 3) {
      return res.status(400).json({ error: 'password must be longer than 3' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  }
})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  })
  res.json(users)
})

module.exports = usersRouter
