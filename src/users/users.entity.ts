import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('New user inserted', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('User updated', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('User removed', this.id);
  }
}
