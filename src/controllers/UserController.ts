import { Request, Response } from 'express'
import { CREATED } from '../core/constants/api'
import User from '../core/models/User'

class UserController {
  static async getUser(req: Request, res: Response) {
    try {
      const { uuid } = req.params
      const user = await User.findOne({ id: uuid })
      return res.status(CREATED.status).json(user)
    } catch (err) {
      return res.send(err)
    }
  }
  static async updateUser(req: Request, res: Response) {
    const { uuid } = req.params
    const { nickname, email, password } = req.body
    console.log(password)

    const user = await User.findOne({ id: uuid })
    if (user) {
      user.nickname = nickname
      user.email = email
      user.password = password
      try {
        await user.save()
        res.status(CREATED.status).json('User modified')
      } catch (err) {
        return res.send(err)
      }
    } else {
      return res.send('User not existing')
    }
  }
  static async deleteUser(req: Request, res: Response) {
    const { uuid } = req.params
    const user = await User.findOne({ id: uuid })
    if (user) {
      try {
        await user.remove()
        return res.status(CREATED.status).json('User is remove')
      } catch (err) {
        return res.send(err)
      }
    } else {
      return res.send('User not existing')
    }
  }
}

export default UserController
