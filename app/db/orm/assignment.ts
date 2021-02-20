import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {SqlEntity} from "../sqlEntity";
import {User} from "./user";
import {IsBoolean, IsDate, IsEnum, IsInstance, IsOptional, IsString} from "class-validator";
import {Platform} from "../../common/platform";
import {Class} from "./class";

@Entity({name: "assignments"})
export class Assignment extends SqlEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(() => User, {eager: true})
    @IsInstance(User)
    owner: User;

    @Column()
    @IsEnum(Platform)
    platform: Platform;

    @JoinColumn()
    @ManyToOne(() => Class, {eager: true})
    @IsInstance(Class)
    class: Class;

    @Column()
    @IsString()
    identifier: string;

    @Column()
    @IsString()
    name: string;

    @Column()
    @IsDate()
    due: Date;

    @Column()
    @IsDate()
    close: Date;

    @Column()
    @IsBoolean()
    complete: boolean;

    @Column()
    @IsOptional()
    @IsString()
    overrideName: string;

    @Column()
    @IsOptional()
    @IsDate()
    overrideDue: Date;

    @Column()
    @IsOptional()
    @IsDate()
    overrideClose: Date;

    @Column()
    @IsOptional()
    @IsBoolean()
    overrideComplete: boolean;

    @Column()
    @IsOptional()
    @IsString()
    note: string;

    @Column()
    @IsBoolean()
    hidden: boolean = false;

    @Column()
    @IsDate()
    lastUpdated: Date = new Date();

}
