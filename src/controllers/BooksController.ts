import { CREATED, OK, BAD_REQUEST } from '@/core/constants/api'
import { success, successNoJson } from '@/core/helpers/response'
import Books from '@/core/models/Books'
import { Request, Response } from 'express'
import { isEmpty } from 'lodash'
import { Like } from 'typeorm'
import * as Sentry from '@sentry/node'


class BooksController {
	static async getBooks(req: Request, res: Response) {
		const books = await Books.find()
		if (books) {
			return res.status(OK.status).json(successNoJson("books", books))
		}
	}
	static async getBooksBy(req: Request, res: Response) {
		const fields: string[] = ['search']

		try {
			const missings = fields.filter((field: string) => !req.body[field])

			if (!isEmpty(missings)) {
				const isPlural = missings.length > 1
				return res.send(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
			}
			const { search } = req.body
			const books = await Books.find({ where: [{ title: Like(`%${search}%`) }, { author: Like(`%${search}%`) }, { genre: Like(`%${search}%`) }, { isbn: Like(`%${search}%`) }] })
			if (books) {
				return res.status(OK.status).json(successNoJson("books", books))
			}
		} catch (errorMessage) {	
			Sentry.captureException(errorMessage);
			return res.send(errorMessage)
		}
	}
}
export default BooksController
