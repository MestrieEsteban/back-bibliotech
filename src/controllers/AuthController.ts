import { Request, Response } from 'express'
import { isEmpty } from 'lodash'
import { success } from '../core/helpers/response'
import { CREATED, OK } from '../core/constants/api'
import jwt from 'jsonwebtoken'
import User from '@/core/models/User'
import passport from 'passport'
import * as Sentry from '@sentry/node'
const mail = require("@/core/fixtures/templateMail")
class AuthController {
  static async signup(req: Request, res: Response): Promise<Response> {
    const fields: string[] = ['nickname', 'email', 'password', 'passwordConfirmation']
    try {
      const missings = fields.filter((field: string) => !req.body[field])

      if (!isEmpty(missings)) {
        const isPlural = missings.length > 1
        throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
      }

      const { nickname, email, password, passwordConfirmation } = req.body

      if (password !== passwordConfirmation) {
        throw new Error("Password doesn't match")
      }

      const user = new User()

      user.nickname = nickname
      user.email = email
      user.password = password

      await user.save()

      const payload = { id: user.id, nickname }
      const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)
      mail.signupMail(email, nickname)
      return res.status(CREATED.status).json(success(user, { token }))
    } catch (errorMessage) {
      Sentry.captureException(errorMessage)

      return res.send(errorMessage)
    }
  }
  static async signin(req: Request, res: Response): Promise<Response> {
    const authenticate = passport.authenticate('local', { session: false }, (errorMessage, user) => {
      if (errorMessage) {
        return res.send(errorMessage)
      }

      const payload = { id: user.id, firstname: user.firstname }
      const token = jwt.sign(payload, process.env.JWT_ENCRYPTION as string)

      return res.status(OK.status).json(success(user, { token }))
    })
    authenticate(req, res)
  }

  static async resetPassword(req: Request, res: Response) {
      const field = ["email"];
      try {
        const missings = field.filter((field:string) => !req.body[field])
        if (!isEmpty(missings)) {
          const isPlural = missings.length > 1
          throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
        }
      } catch (error) {
        Sentry.captureException(error)
        console.log('error:', error)
      }
      const { email } = req.body
	    const user = await User.findOne({ email: email })

      if (user) {
        const token = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20)
        user.resetToken = token
        await User.save(user)
        mail.resetMail(user.email,user.nickname,token)
      }
      return res.send("mail envoyer")
  }

  static async passwordToken (req: Request, res: Response){
    const fields = ['resettoken', 'password']
    try {
      const missings = fields.filter((field: string) => !req.body[field])

      if (!isEmpty(missings)) {
        const isPlural = missings.length > 1
        throw new Error(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
      }
    } catch (error) {
      console.log(error)
      Sentry.captureException(error)
    }

    const { password, resettoken } = req.body	
	const user = await User.findOne({ resetToken: resettoken })

	if (user) {
		user.password = password
		await User.save(user)
		res.status(CREATED.status).json('password updated')
	}
  res.send("lien envoyer")
}}

export default AuthController
