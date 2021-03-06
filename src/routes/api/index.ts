/**
 * If your routes are in the secured folder, a token will to be sent to access
 */
import { Router, Request, Response } from 'express'
import secured from './secured/index'
import passport from 'passport'
import AuthController from '@/controllers/AuthController'
import BooksController from '@/controllers/BooksController'
import UsersBooksController from '@/controllers/UsersBooksController'

export const argv: string[] = process.argv.slice(2)

const api = Router()

api.get('/', (req: Request, res: Response) => {
  res.json({
    hello: ' Gizmo Api',
    meta: {
      status: 'running',
      version: '1.0.0',
    },
  })
})

//Auth
api.post('/auth/signup', AuthController.signup)
api.post('/auth/signin', AuthController.signin)
api.post('/auth/resetpassword', AuthController.resetPassword)
api.post('/auth/passwordToken', AuthController.passwordToken)


api.use('/', passport.authenticate('jwt', { session: false }), secured)

export default api
