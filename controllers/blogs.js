const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1})
    console.log(blogs)
    response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findById(request.userid)

    const blog = new Blog({...body, user: user.id})

    const result = await blog.save()

    await User.findByIdAndUpdate(result.user, { $addToSet: { blogs: result.id }}, {runValidators: true, context: 'query' })
    
    response.status(201).json(result)

})

blogsRouter.put('/:id', async (request, response) => {
    const { likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes } ,{ new: true, runValidators: true, context: 'query' })
    
    response.status(204).json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const body = request.body

    const blog = await Blog.findById(request.params.id)
    //Check that token is from the author of the blog post being deleted
    if(blog.user.toString() === request.userid.toString()) {
        const result = await Blog.findByIdAndRemove(request.params.id)
        await User.findByIdAndUpdate(result.user, {$pull: { blogs: { id: result.id } } }, { new: true, context: 'query' })
        response.status(204).json(result)
    }
})


module.exports = blogsRouter