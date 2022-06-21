import { RoleEntity } from "../../../roles/domain/models/role.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";

@Entity({ name: "user" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @Column({ type: "varchar", length: 100 })
  email: string;

  @Column({ type: "integer" })
  age: string;

  @Column({ type: "varchar", length: 50 })
  lastname: string;

  @Column({ type: "varchar", length: 150 })
  password: string;

  @Column({ type: "varchar", length: 100 })
  refreshToken: string;

  @Column({ type: "varchar", length: 100 })
  photo: string;

  @Column({ type: "datetime" })
  createdAt: Date;

  @Column({ type: "datetime" })
  updatedAt: Date;

  @Column({ type: "datetime" })
  deletedAt: Date;

  @Column({ type: "boolean", default: true })
  active: boolean;

  @ManyToMany((type) => RoleEntity, (role) => role.users)
  @JoinTable()
  roles: RoleEntity[];
}
