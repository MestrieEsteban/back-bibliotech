import { CREATED, OK, BAD_REQUEST } from '@/core/constants/api'
import { success, successNoJson } from '@/core/helpers/response'
import Books from '@/core/models/Books'
import { Request, Response } from 'express'
import { Like } from 'typeorm'

class BooksController {
	static async getBooks(req: Request, res: Response) {
		const books = await Books.find()
		if (books) {
			return res.status(OK.status).json(successNoJson("books", books))
		}
	}
	static async getBooksBy(req: Request, res: Response) {
		const { search } = req.body
		const books = await Books.find({ where: [{ title: Like(`%${search}%`) }, { author: Like(`%${search}%`) }, { genre: Like(`%${search}%`) }, { isbn: Like(`%${search}%`) }] })
		if (books) {
			return res.status(OK.status).json(successNoJson("books", books))
		}
	}
}
export default BooksController
