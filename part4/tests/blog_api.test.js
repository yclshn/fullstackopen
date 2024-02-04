const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const User = require('../models/userSchema')
const Blog = require('../models/blogSchema')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObject = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObject.map((blog) => blog.save())
  // eslint-disable-next-line no-undef
  await Promise.all(promiseArray)
})

//Done
describe('When blogs are saved initially', () => {
  test('all blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 10000)

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map((r) => r.title)

    expect(titles).toContain('React patterns')
  })
})

//Done
describe('viewing a specific blog', () => {
  test('blog has an id property', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    expect(blogToView.id).toBeDefined()
  })

  test('a specific blog can be viewed', async () => {
    const blogAtStart = await helper.blogsInDb()
    const blogToView = await blogAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body.title).toContain(blogToView.title)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()
    await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalId = '124123asd1231q123'
    await api.get(`/api/blogs/${invalId}`).expect(400)
  })
})

//Done
describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const token = await helper.tokenExtractor(api, 'root', 'sekret')
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edgsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((b) => b.title)
    expect(titles).toContain('Canonical string reduction')
  })

  test('title or url is missing from req body and not added', async () => {
    const token = await helper.tokenExtractor(api, 'root', 'sekret')
    const newBlog = {
      author: 'jane doe',
      likes: 21,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('likes property is missing and default 0', async () => {
    const token = await helper.tokenExtractor(api, 'root', 'sekret')
    const blogToAdd = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogToAdd)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  })
})

//Done
describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const token = await helper.tokenExtractor(api, 'root', 'sekret')
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map((r) => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

//Done
describe('updating of a blog', () => {
  test('updating likes by valid IDs', async () => {
    const token = await helper.tokenExtractor(api, 'root', 'sekret')
    const blogAtStart = await helper.blogsInDb()
    const blogToUpdate = blogAtStart[0]
    const validId = blogToUpdate.id
    const updatedBlog = {
      ...blogToUpdate,
      likes: 8,
    }

    await api
      .put(`/api/blogs/${validId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[0].likes).toBe(8)
  })
})

//Done
describe('When there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      passwordHash,
    })

    await user.save()
  })

  test('creation succeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'janedoe',
      name: 'Jane Doe',
      password: 'janedoe123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails due to username is already exists', async () => {
    const blogsAtStart = helper.blogsInDb()
    const newUser = {
      username: 'root',
      name: 'Jane Doe',
      password: '123456',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('username is already exists')

    const blogsAtEnd = helper.blogsInDb()
    expect(blogsAtEnd).toEqual(blogsAtStart)
  })

  test('creation fails due to validation of username and password', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'qw',
      name: 'test',
      password: '123456',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    expect(result.body.error).toContain('username must be longer than 3')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
