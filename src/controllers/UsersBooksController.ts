import { OK } from '@/core/constants/api'
import { successNoJson } from '@/core/helpers/response'
import Books from '@/core/models/Books'
import User from '@/core/models/User'
import UserBooks from '@/core/models/UserBooks'
import { Request, Response } from 'express'
import { isEmpty } from 'lodash'
import * as Sentry from '@sentry/node'

class UsersBooksController {
  static async getUserBooks(req: Request, res: Response) {
    const fields: string[] = ['uuid']
    try {
      const missings = fields.filter((field: string) => !req.body[field])
      if (!isEmpty(missings)) {
        const isPlural = missings.length > 1
        return res.send(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
      }
      const { uuid } = req.body

      const user = await User.findOne({ where: { id: uuid } })

      // const userBooks = await UserBooks.findOne({
      // 	where: { isBiblio: true, user: user },
      // 	relations: ["books"]
      // })
      // const bb = await Books.findOne({ id: "3" })

      // if (userBooks && bb) {
      // 	userBooks.books.push(bb)
      // 	userBooks.save()
      // }
      // console.log(userBooks);

      const books = await UserBooks.find({
        where: { user: user },
        relations: ['books'],
      })

      return res.status(OK.status).json(successNoJson('userBooks', books))
    } catch (errorMessage) {
      Sentry.captureException(errorMessage)
      return res.send(errorMessage)
    }
  }
  static async addUserBooks(req: Request, res: Response) {
    const fields: string[] = ['uuid', 'isbn', 'type']
    try {
      const missings = fields.filter((field: string) => !req.body[field])
      if (!isEmpty(missings)) {
        const isPlural = missings.length > 1
        return res.send(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
      }
      const { uuid, isbn, type } = req.body
      const user = await User.findOne({ where: { id: uuid } })
      const userBooks = await UserBooks.findOne({
        where: { isBiblio: true, user: user },
        relations: ['books'],
      })
      const bb = await Books.findOne({ isbn: isbn })

      if (userBooks && bb) {
        userBooks.books.push(bb)
        userBooks.save()
      }
      console.log(userBooks)

      const books = await UserBooks.find({
        where: { user: user },
        relations: ['books'],
      })

      return res.status(OK.status).json(successNoJson('userBooks', books))
    } catch (errorMessage) {
      Sentry.captureException(errorMessage)
      return res.send(errorMessage)
    }
  }
}

export default UsersBooksController
