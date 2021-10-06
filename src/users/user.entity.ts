import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ nullable: true })
  public currentHashedRefreshToken?: string;

  @Column({ unique: true })
  @Expose()
  public email: string;

  @Column()
  @Expose()
  public username: string;

  @Column()
  public password: string;
}
