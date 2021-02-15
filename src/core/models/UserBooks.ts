import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	CreateDateColumn,
	BeforeInsert,
	BeforeUpdate,
	ManyToOne,
	OneToMany,
	OneToOne,
	JoinTable,
	JoinColumn,
	ManyToMany,
} from 'typeorm'
import bcrypt from 'bcryptjs'
import Books from './Books'
import User from './User'

@Entity()
export default class UserBooks extends BaseEntity {

	@PrimaryGeneratedColumn()
	id!: string

	@Column({ nullable: true })
	isBiblio!: boolean

	@ManyToMany(() => Books, books => books.books)
	@JoinTable()
	books!: Books[]

	@ManyToOne(type => User)
	@JoinColumn()
	user!: User

	@CreateDateColumn()
	createdAt!: string

}