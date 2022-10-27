import { Server, Socket } from 'socket.io';
import { ulid } from 'ulid';
import logger from './utils/logger';

const EVENTS = {
    connection: 'connection',
    CLIENT: {
        CREATE_ROOM: 'CREATE_ROOM',
        SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE',
        JOIN_ROOM: 'JOIN_ROOM'
    },
    SERVER: {
        ROOMS: 'ROOMS',
        JOINED_ROOM: 'JOINED_ROOM',
        ROOM_MESSAGE: 'ROOM_MESSAGE'
    }
};


const rooms: Record<string, { name: string }> = {};

function socket({io}:{io: Server}){
    logger.info(`socket enabled`)
    io.on(EVENTS.connection,(socket:Socket)=>{
        logger.info(`User connected ${socket.id}`)


        /*
            room Created
        */
        socket.on(EVENTS.CLIENT.CREATE_ROOM, ({roomName})=>{
            console.log({roomName});
//  // Create a roomId
            const roomId = ulid()
            // console.log(nanoid());


//             //add a new room to the rooms object
            rooms[roomId]={
                name: roomName
            }
           
            socket.join(roomId)
           
//             // broadcast an event saying there is a new room

            socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms)

//             //emit back to the room creator with all the rooms

            socket.emit(EVENTS.SERVER.ROOMS, rooms)
//             //emit event back the room creator saying they have joined a room
            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId)

            
        });

        /*
        * Whwn a user send a message
        */

        socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE,({roomId, message, usename})=>{

            const date = new Date()

            socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE,{
                message,
                usename,
                time: `${date.getHours()}: ${date.getMinutes()}`
            })

        })


        // WHEN A USER JOIN A ROOM 

        socket.on(EVENTS.CLIENT.JOIN_ROOM,(roomId)=>{
            socket.join(roomId);
            socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId)
        })
    })
}


export default socket