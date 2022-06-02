require('dotenv').config()

const PORT = process.env.PORT || 3003
const NODE_ENV = process.env.NODE_ENV
const MONGODB_URI = NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

const SECRET = process.env.SECRET || "secretito"

module.exports = {
    MONGODB_URI,
    SECRET,
    NODE_ENV,
    PORT
}