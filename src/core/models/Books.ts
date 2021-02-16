import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  ManyToMany,
} from 'typeorm'
import bcrypt from 'bcryptjs'
import UserBooks from './UserBooks'

@Entity()
export default class Books extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string

  @Column({ nullable: false })
  title!: string

  @Column({ nullable: false })
  description!: string

  @Column({ nullable: false })
  author!: string

  @Column({ nullable: false })
  cover!: string

  @Column({ nullable: false })
  genre!: string

  @Column({ nullable: false })
  isbn!: string

  @ManyToMany(() => UserBooks, (userBooks) => userBooks.books)
  books!: UserBooks
}
