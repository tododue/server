import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {SqlEntity} from "../sqlEntity";
import {User} from "./user";
import {IsEmail, IsEnum, IsInstance, IsOptional, IsString} from "class-validator";
import {Platform} from "../../common/platform";

@Entity({name: "classes"})
export class Class extends SqlEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(() => User, {eager: true})
    @IsInstance(User)
    owner: User;

    @Column()
    @IsString()
    identifier: string;

    @Column()
    @IsEnum(Platform)
    platform: Platform;

    @Column()
    @IsOptional()
    name: string;

    @Column()
    @IsOptional()
    @IsString()
    professorName: string;

    @Column()
    @IsOptional()
    @IsEmail()
    professorEmail: string;

    @Column()
    @IsOptional()
    overrideName: string;

    @Column()
    @IsOptional()
    @IsString()
    overrideProfessorName: string;

    @Column()
    @IsOptional()
    @IsEmail()
    overrideProfessorEmail: string;
}
