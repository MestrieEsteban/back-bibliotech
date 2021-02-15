import { type } from 'os';
/**
 * https://typeorm.io/#/ 😉
 * Dont forget : If you add a new entities you need to add it in ./Database.ts
 */

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	CreateDateColumn,
	BeforeInsert,
	BeforeUpdate,
	OneToMany,
	OneToOne,
	JoinTable,
} from 'typeorm'
import bcrypt from 'bcryptjs'
import UserBooks from './UserBooks'

@Entity()
export default class User extends BaseEntity {
	private static SALT_ROUND = 8

	@PrimaryGeneratedColumn('uuid') //'uuid'
	id!: string

	@Column({ nullable: false })
	nickname!: string

	@Column({ nullable: false, unique: true })
	email!: string

	@Column({ nullable: true })
	avatar!: string

	@Column({ nullable: false })
	password!: string

	@Column({ nullable: true })
	resetToken!: string

	@CreateDateColumn()
	createdAt!: string

	/**
	 * Hooks
	 */
	@BeforeInsert()
	@BeforeUpdate()
	public hashPassword(): void | never {
		if (!this.password) {
			throw new Error('Password is not defined')
		}

		this.password = bcrypt.hashSync(this.password, User.SALT_ROUND)
	}

	/**
	 * Methods
	 */
	public checkPassword(uncryptedPassword: string): boolean {
		return bcrypt.compareSync(uncryptedPassword, this.password)
	}

	public toJSON(): User {
		const json: User = Object.assign({}, this)

		//delete json.password

		return json
	}
}
