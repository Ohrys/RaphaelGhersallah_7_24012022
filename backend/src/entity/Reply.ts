import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Publication } from "./Publication";
import { User } from "./User";

@Entity()
export class Reply{
    @PrimaryGeneratedColumn("uuid")
    idReply: string;

    @Column()
    content: string;

    @ManyToOne(() => User, user => user.idUser)
    @JoinColumn({ name: 'author' })
    author:User;

    @Column()
    like: number;

    @Column()
    creationDate: string;

    @Column()
    lastUpdate: string;
    
    @OneToMany(() => Reply, reply => reply.replyToR,{cascade:true})
    replies:Reply[];

    @ManyToOne(() => Reply, reply => reply.replies, { onDelete: 'CASCADE'})
    @JoinColumn({ name:'ReplyToIdReply'})
    replyToR:Reply;

    @ManyToOne(() => Publication, publication => publication.replies, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'ReplyToIdPublication' })
    replyToP: Publication;

}