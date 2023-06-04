import { Place } from "src/enums/report/place.enum";
import { WorkTypes } from "src/enums/report/work-types.enum";
import { Work } from "src/enums/report/work.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    title: string

    @Column()
    date: Date

    @Column()
    duration: number

    @Column({type: "enum", enum: Place, nullable: true, default: null})
    place: Place | null

    @Column({type: "enum", enum: WorkTypes, nullable: true, default: null})
    workType: WorkTypes | null

    @Column({type: "enum", enum: Work, nullable: true, default: null})
    work: Work | null

    @Column({nullable: true})
    issuedTKPTask: string | null

    @Column({nullable: true})
    description: string | null

    @Column()
    creatorId: string;
}