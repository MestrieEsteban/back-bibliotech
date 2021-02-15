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
		title: 'userBooks',
		description: 'esteban94.em@gmail.com',
		author: 'test',
		cover: 'test',
		genre: 'test',
		isbn: true,
	},
	{
		title: 'userBooks',
		description: 'esteban9d4.em@gmail.com',
		author: 'test',
		cover: 'test',
		genre: 'test',
		isbn: true,
	},
	{
		title: 'userBooks',
		description: 'esteban9d4.em@gmail.com',
		author: 'test',
		cover: 'test',
		genre: 'test',
		isbn: false,
	},
]

export async function addUserBooks(): Promise<never | void> {
	for (const u of users) {
		const user = new UserBooks()

		const aa = await User.findOne({ email: u.description })
		const bb = await Books.findOne({ id: "1" })
		const cc = await Books.findOne({ id: "2" })
		if (aa && bb && cc) {
			user.books = [bb, cc]
			user.user = aa
			user.isBiblio = u.isbn
		}
		

		await user.save().then(async () => {
			mlog(`${u.title} inserted on database`, 'success')
		})
	}
	return
}
