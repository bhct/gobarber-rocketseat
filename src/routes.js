const express = require('express')
const multerConfig = require('./config/multer')
const upload = require('multer')(multerConfig)

const routes = express.Router()

// Middlewares
const authMiddleware = require('./app/middlewares/auth')
const guestMiddleware = require('./app/middlewares/guest')
const providerMiddleware = require('./app/middlewares/provider')

// Controllers
const SessionController = require('./app/controllers/SessionController')
const UserController = require('./app/controllers/UserController')
const DashboardController = require('./app/controllers/DashboardController')
const FileController = require('./app/controllers/FileController')
const AppointmentController = require('./app/controllers/AppointmentController')
const AvailableController = require('./app/controllers/AvailableController')

routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success')
  res.locals.flashError = req.flash('error')

  return next()
})

routes.get('/files/:file', FileController.show)

routes.get('/', guestMiddleware, SessionController.create)
routes.post('/signin', SessionController.store)

routes.get('/signup', guestMiddleware, UserController.create)
routes.post('/signup', upload.single('avatar'), UserController.store)

routes.use('/app', authMiddleware)

routes.get('/app/logout', SessionController.destroy)

routes.get('/app/dashboard', DashboardController.index)

routes.get(
  '/app/appointments/new/:provider',
  providerMiddleware,
  AppointmentController.create
)
routes.post(
  '/app/appointments/new/:provider',
  providerMiddleware,
  AppointmentController.store
)

routes.get('/app/available/:provider', AvailableController.index)

module.exports = routes
