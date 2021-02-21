import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsBoolean, IsEmail, IsString, MaxLength} from "class-validator";
import {SqlEntity} from "../sqlEntity";

@Entity({name: "users"})
export class User extends SqlEntity {

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
    passwordHash: string;

    @Column()
    @IsString()
    passwordSalt: string;

    @Column()
    @IsBoolean()
    isAdmin: boolean;

    @Column()
    @IsBoolean()
    isActivated: boolean;

}
