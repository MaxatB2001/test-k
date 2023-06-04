
import { Resource } from 'src/DTO/resource';

export const RESOURCES: Resource[] = [
    {        
        uid: '7a693cb5-adef-41f2-8ff6-26908e290da9',
        name: 'taskSchema',
        attributes: 'id,deadline,position,creatorId,created_at,importance,do_after'},
    {
        uid: 'feef7e6f-1458-4476-b9fe-17037d8d4fae',
        name: 'taskSectionSchema',
        attributes: 'id,creatorId,start,end'
    },
    {
        uid: '89cd2718-4e6d-4179-9e4b-557da3d5f566',
        name: 'UserColumn',
        attributes: 'id,assignId,performerId,assignKeycloackUser,performerKeycloackUser,tasks'
    }
]