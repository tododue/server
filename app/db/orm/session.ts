import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {SqlEntity} from "../sqlEntity";
import {User} from "./user";
import {IsDate, IsInstance, IsOptional, IsString} from "class-validator";

@Entity({name: "sessions"})
export class Session extends SqlEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(() => User, {eager: true})
    @IsInstance(User)
    user: User;

    @Column({unique: true})
    @IsString()
    token: string;

    @Column()
    @IsOptional()
    @IsString()
    message: string;

    @Column()
    @IsDate()
    expiry: Date;

}
