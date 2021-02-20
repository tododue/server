import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsBoolean, IsEmail, IsString, MaxLength} from "class-validator";
import {SQLEntity} from "../sqlentity";

@Entity({name: "users"})
export class User extends SQLEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    @MaxLength(16)
    username: string;

    @Column({unique: true})
    @IsEmail()
    email: string;

    @Column()
    @IsString()
    password_hash: string;

    @Column()
    @IsString()
    password_salt: string;

    @Column()
    @IsBoolean()
    is_admin: boolean;

    @Column()
    @IsBoolean()
    is_activated: string;

}
