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
			const missings = fields.filter((field: string) => !req.params[field])
			if (!isEmpty(missings)) {
				const isPlural = missings.length > 1
				return res.send(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
			}
			const { uuid } = req.params

			const user = await User.findOne({ where: { id: uuid } })

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
			const isBiblio = type == 'true' ? true : false
			const user = await User.findOne({ where: { id: uuid } })
			if (user) {
				const userBooks = await UserBooks.findOne({
					where: { isBiblio: isBiblio, user: user },
					relations: ['books'],
				})
				const book = await Books.findOne({ isbn: isbn })
				if (book && userBooks) {
					userBooks.books.push(book)
					userBooks.save()
					return res.status(OK.status).json(successNoJson('userBooks', book))
				} else {
					return res.send(`Book or UserBook not found`)
				}
			} else {
				return res.send(`User not found`)
			}
		} catch (errorMessage) {
			Sentry.captureException(errorMessage)
			return res.send(errorMessage)
		}
	}
	static async getUserBooksCount(req: Request, res: Response) {
		const fields: string[] = ['uuid']
		try {
			const missings = fields.filter((field: string) => !req.params[field])
			if (!isEmpty(missings)) {
				const isPlural = missings.length > 1
				return res.send(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
			}
			const { uuid } = req.params

			const user = await User.findOne({ where: { id: uuid } })
			if (!user) {
				return res.send('User not found')
			}

			const books = await UserBooks.find({
				where: { user: user, isBiblio: true },
				relations: ['books'],
			})
			console.log(books[0].books.length);
			
			return res.status(OK.status).json(successNoJson('userBooksCount', books[0].books.length))
		} catch (errorMessage) {
			Sentry.captureException(errorMessage)
			return res.send(errorMessage)
		}
	}
	static async getUserBooksLast(req: Request, res: Response) {
		const fields: string[] = ['uuid']
		try {
			const missings = fields.filter((field: string) => !req.params[field])
			if (!isEmpty(missings)) {
				const isPlural = missings.length > 1
				return res.send(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
			}
			const { uuid } = req.params

			const user = await User.findOne({ where: { id: uuid } })
			if (!user) {
				return res.send('User not found')
			}

			const books = await UserBooks.find({
				where: { user: user, isBiblio: true },
				relations: ['books'],
			})
			const sliceBook = books[0].books.slice(0,9)			
			return res.status(OK.status).json(successNoJson('userBooksLast', sliceBook))
		} catch (errorMessage) {
			Sentry.captureException(errorMessage)
			return res.send(errorMessage)
		}
	}
}

export default UsersBooksController