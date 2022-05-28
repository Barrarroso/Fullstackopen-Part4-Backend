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

describe('remove a blog post', () => {
    test('removing a blog post reduces the length of blogs by 1', async () => {
        //delete the first blog post
        const blogs = await helper.blogsInDb()
        const prevLength = blogs.length

        await api.delete(`/api/blogs/${blogs[0].id}`)
        .expect(204)

        const blogsAtDelete = await helper.blogsInDb()

        expect(blogsAtDelete).toHaveLength(prevLength-1)
        
    })
})

describe('update a blog post', () => {
    test('changing likes of a blog', async () => {
        //delete the first blog post
        const blogs = await helper.blogsInDb()

        updatedBlog = {
            title: 'BlogTitle0',
            author: 'Pete',
            url: 'http://sample.com',
            likes: 99
        }

        await api.put(`/api/blogs/${blogs[0].id}`).send(updatedBlog)
        .expect(204)

        const blogsUpdated = await helper.blogsInDb()

        blogsLikes = blogsUpdated.map(blog => blog.likes)

        expect(blogsLikes).toContain(99)
    })
})

afterAll(() => {
  mongoose.connection.close()
})