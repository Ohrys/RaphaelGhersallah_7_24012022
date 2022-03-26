import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import { Reply } from "./Reply";
import { User } from "./User";

@Entity()
export class Publication{
    @PrimaryGeneratedColumn("uuid")
    idPublication:string;

    @Column()
    title:string;

    @Column()
    content:string;

    @Column({default:null})
    illustration:string;

    @ManyToOne(() => User, user => user.idUser)
    @JoinColumn({ name: 'author' })
    author: User;

    @Column()
    like:number;

    @Column()
    creationDate:string;

    @Column()
    lastUpdate:string;

    @OneToMany(() => Reply, reply => reply.replyToP, {cascade:true})
    replies: Reply[];

}