const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) => {
  logger.info('Method', req.method)
  logger.info('Path  ', req.path)
  logger.info('Body  ', req.body)
  logger.info('---')
  next()
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('Authorization')
  if (authorization && authorization.startsWith('Bearer')) {
    req.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (req, res, next) => {
  const authorization = req.get('Authorization')
  if (authorization && authorization.startsWith('Bearer')) {
    const token = authorization.replace('Bearer ', '')
    const decodedToken = jwt.verify(token, process.env.SECRET)
    req.user = decodedToken.username
    req.userId = decodedToken.id
  }
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(400).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  logger.error(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).send(err.message)
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: err.message })
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    })
  }
  next(err)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
