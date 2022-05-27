const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce( (acc, current) => acc + current.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return {}

    const favoriteBlog = blogs.reduce( (acc, current) => {
        return (acc.likes > current.likes) ? acc : current
    })

    const {title, author, likes} = favoriteBlog

    return {title, author, likes}
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return {}

    /*this key-value pairs authorName: numBlogs {
        Pete: 4,
        David: 3
    }
    */
    let authors = {}

    blogs.forEach(blog => {
        const author = blog.author
        authors[author] = !authors[author] ? 1 : authors[author] + 1
    });

    const mostBlogAuthor = Object.keys(authors).reduce( (prev, current) => {
        return (authors[prev] > authors[current]) ? prev : current
    }, "")
    return {
        author: mostBlogAuthor,
        blogs: authors[mostBlogAuthor]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return {}

    /*this key-value pairs authorName: blogLikes {
        Pete: 20,
        David: 3
    }
    */
    let authors = {}

    blogs.forEach(blog => {
        const author = blog.author
        const likes = blog.likes
        authors[author] = !authors[author] ? likes : authors[author] + likes
    });

    const mostLikesAuthor = Object.keys(authors).reduce( (prev, current) => {
        return (authors[prev] > authors[current]) ? prev : current
    }, "")
    return {
        author: mostLikesAuthor,
        likes: authors[mostLikesAuthor]
    }
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}