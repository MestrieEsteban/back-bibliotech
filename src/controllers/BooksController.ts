import { CREATED, OK, BAD_REQUEST } from '@/core/constants/api'
import { success, successNoJson } from '@/core/helpers/response'
import Books from '@/core/models/Books'
import { Request, response, Response } from 'express'
import { isEmpty } from 'lodash'
import { Like } from 'typeorm'
import * as Sentry from '@sentry/node'
import axios from 'axios'

export async function http(request: RequestInfo): Promise<any> {
	const response = await fetch(request)
	const body = await response.json()
	return body
}
class BooksController {
	static async getBooks(req: Request, res: Response) {
		const books = await Books.find()
		if (books) {
			return res.status(OK.status).json(successNoJson('books', books))
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
			const books = await Books.find({
				where: [
					{ title: Like(`%${search}%`) },
					{ author: Like(`%${search}%`) },
					{ genre: Like(`%${search}%`) },
					{ isbn: Like(`%${search}%`) },
				],
			})
			if (books) {
				return res.status(OK.status).json(successNoJson('books', books))
			}
		} catch (errorMessage) {
			Sentry.captureException(errorMessage)
			return res.send(errorMessage)
		}
	}
	static async getBookByIsbn(req: Request, res: Response) {
		const fields: string[] = ['isbn']
		try {
			const missings = fields.filter((field: string) => !req.body[field])

			if (!isEmpty(missings)) {
				const isPlural = missings.length > 1
				return res.send(`Field${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
			}
			const { isbn } = req.body
			const books = await Books.find({ where: { isbn: isbn } })

			if (books.length > 0) {
				return res.status(OK.status).json(successNoJson('books', books))
			} else {
				const apiResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${isbn}`)
				if (apiResponse.data.items) {
					const bookApi = apiResponse.data.items[0]
					const bookTitle = bookApi.volumeInfo.title
					const bookDescription = bookApi.volumeInfo.description
					const bookAuthor = bookApi.volumeInfo.authors[0]
					const bookGenre = bookApi.volumeInfo.categories[0]
					const bookCover = bookApi.volumeInfo.previewLink
					const bookSale = bookApi.saleInfo.buyLink
					const newBook = new Books()
					try {
						newBook.title = bookTitle
						newBook.description = bookDescription
						newBook.author = bookAuthor
						newBook.genre = bookGenre
						newBook.cover = bookCover
						newBook.sale = bookSale
						newBook.isbn = isbn
						await newBook.save()
					} catch (error) {
						console.log(error);
					}
					
					const books = await Books.find({ where: { isbn: isbn } })
					return res.status(OK.status).json(successNoJson('books', books))
				}


				res.send(response)
			}
		} catch (errorMessage) {
			Sentry.captureException(errorMessage)
			return res.send(errorMessage)
		}
	}
}
export default BooksController
