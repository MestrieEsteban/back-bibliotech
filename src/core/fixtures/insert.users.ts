/**
 * @Insert
 * This is a example if you want to automatically insert rows in your database
 */

import { mlog } from '../libs/utils'
import User from '../models/User'
const users = [
  {
    nickname: 'Esteban',
    email: 'esteban94.em@gmail.com',
    password: 'test',
  },
  {
    nickname: 'Estebavcn',
    email: 'esteban9d4.em@gmail.com',
    password: 'test',
  },
]

export async function addUser(): Promise<never | void> {

  for (const u of users) {
    const user = new User()

    user.nickname = u.nickname
    user.email = u.email
    user.password = u.password

    await user.save().then(() => {
      mlog(`${u.nickname} inserted on database`, 'success')
    })
  }
  return
}
