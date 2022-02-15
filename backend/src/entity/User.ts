import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    idUser: string;

    @Column({default:null})
    name: string;

    @Column({default:null})
    password: string;

    @Column({default:null})
    email: string;
    
    @Column({default:false})
    isModerator: boolean;
    
    @Column({default:null})
    lastConnection: string;

}
