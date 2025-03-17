import { Entity, PrimaryColumn, Column } from "typeorm"


enum Role {
    Admin = "Admin",
    User = "User"
}

@Entity()
export class User {

    @PrimaryColumn({
        type: "varchar",
        length: 50
    })
    id: string

    @Column()
    email: string

    @Column()
    password: string;

    @Column()
    title: string

    @Column()
    firstname: string

    @Column()
    lastname: string

    @Column()
    role: Role;

}
