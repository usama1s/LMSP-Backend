import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
// ORM FOR USERS
export class Users {
    @PrimaryGeneratedColumn()
    user_id

    @Column()
    contact_no

    @Column()
    email

    @Column()
    first_name

    @Column()
    last_name

    @Column()
    password

    @Column()
    role
}
