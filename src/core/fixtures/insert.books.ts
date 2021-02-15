/**
 * @Insert
 * This is a example if you want to automatically insert rows in your database
 */

import { mlog } from "../libs/utils"
import Books from "../models/Books"
import User from "../models/User"
import UserBooks from "../models/UserBooks"

const users = [
	{
		title: 'Title 1',
		description: '111111111',
		author: 'Salut',
		cover: 'test',
		genre: 'test',
		isbn: 's8df8sd',
	},
	{
		title: 'Title 2',
		description: '2222222222',
		author: 'Esteban',
		cover: 'test',
		genre: 'test',
		isbn: '12456',
	},
	{
		title: 'Title 3',
		description: '33333',
		author: 'Esteban',
		cover: 'test',
		genre: 'test',
		isbn: '12456',
	},
]

export async function addBooks(): Promise<never | void> {
	for (const u of users) {
		const user = new Books()

		user.title = u.title
		user.description = u.description
		user.author = u.author
		user.cover = u.cover
		user.genre = u.genre
		user.isbn = u.isbn

		await user.save().then(() => {
			mlog(`${u.title} inserted on database`, 'success')
		})
	}
	return
}
