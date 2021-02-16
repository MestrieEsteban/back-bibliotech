/**
 * ln:43 to add new entities ex : [User, Post...]
 * ln:37 add your database type
 */
import dotenv from 'dotenv'
import { createConnection, Connection } from 'typeorm'
import { addBooks } from '../fixtures/insert.books'
import { addUserBooks } from '../fixtures/insert.userBooks'
import { addUser } from '../fixtures/insert.users'
import Books from './Books'
import User from './User'
import UserBooks from './UserBooks'
export default class Database {
  private static _instance: Database | null = null
  private _connection: Connection | null = null

  private constructor() {}

  public static getInstance(): Database {
    if (!Database._instance) {
      Database._instance = new Database()
    }

    return Database._instance
  }

  public async authenticate(): Promise<Connection | never> {
    dotenv.config()

    const founded = (process.env.DATABASE_URL as string).match(/^(postgres):\/\/(.*):(.*)@(.*):(\d+)\/(.*)$/)

    if (!founded) {
      throw new Error('[ERROR] Please check your DATABASE_URL value')
    }

    const [, , username, password, host, port, database] = founded

    this._connection = await createConnection({
      type: 'postgres',
      host,
      port: parseInt(port),
      username,
      password,
      database,
      entities: [User, Books, UserBooks],
      dropSchema: true,
      synchronize: true,
      logging: false,
    })

    setTimeout(async function () {
      await addUser()
    }, 1000)

    setTimeout(async function () {
      await addBooks()
    }, 2000)

    setTimeout(async function () {
      await addUserBooks()
    }, 3000)

    return this._connection
  }
}
