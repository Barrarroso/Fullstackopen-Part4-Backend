const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogs = helper.initialBlogs.map( blog => new Blog(blog))
    
    //save all test blogs to database
    const promises = blogs.map( blog => {
        return blog.save()
    })

    await Promise.all(promises)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    
    expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 10000)

test('property id exists', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const blogs = await helper.blogsInDb()
    blogs.forEach(blog => {
        expect(blog.id).toBeDefined()
    });
})

describe('adding a blog post', () => {
    test('gives 201 status and saves blog', async () => {
        const newBlog = {
            title: 'BlogTitle2', 
            author: 'author2', 
            url: 'http://sample.com', 
            likes:3
        }
    
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        const titles = blogsAtEnd.map(blog => blog.title)
        expect(titles).toContain(newBlog.title)
    })
    /*
    
Write a test that verifies that if the likes property is missing from the request, it will default to the value 0. Do not test the other properties of the created blogs yet.

Make the required changes to the code so that it passes the test.*/

    test('gives 0 likes if the likes property is missing', async () => {
        const newBlog = {
            title: 'BlogTitle3',
            author: 'author3',
            url: 'http://sample.com'
        }

        const response = await api.post('/api/blogs').send(newBlog)
        const storedBlog = response.body
        expect(storedBlog.likes).toBe(0)
    })

    test('400 status code when posting a blog without title and url', async () => {
        const newBlog = {
            author: 'author4'
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
})


afterAll(() => {
  mongoose.connection.close()
})