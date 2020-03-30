const http=require('http')
const path=require('path')
const Filter=require('bad-words')
const socketio=require('socket.io')
const {generateMessage,generateLocationMessage} =require('./utils/messages')
const {addUser,getUser,getUsersInRoom,removeUser }=require('./utils/users')


const express=require('express')
const app=express()

const port=process.env.PORT|| 3000

const server=http.createServer(app)
const io=socketio(server)

const publicDirectoryPath=path.join(__dirname,'../public')
//to serve up what ever in  publicdir..dirctory 
app.use(express.static(publicDirectoryPath))


io.on('connection',(socket)=>{
console.log('New WebSocket Connection')




socket.on('join',({username,room},callback)=>{
    const {error,user}=addUser({id:socket.id,username,room}) //imp
    if(error){
        return callback(error)
    }


    socket.join(user.room)    //socket.join allows us to join a room
      
    socket.emit('message',generateMessage('Admin','Welcome!!'))
    socket.broadcast.to(room).emit('message',generateMessage('Admin',`${user.username} has joined`))
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
    })
    callback()
})


socket.on('sendMessage',(message,callback)=>{
    const user=getUser(socket.id)
const filter=new Filter()
        if(filter.isProfane(message))
        {
            return callback('Profanity is not allowed')
        }

        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()
})


socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
if(user)
{
    io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left`))
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
    })
}
        
    })

    socket.on('sendLocation',(loc,callback)=>{
    const user=getUser(socket.id)
        const latitude=loc.latitude
        const longitude=loc.longitude
        io.to(user.room).emit('sendLocation',generateLocationMessage(user.username,`https://google.com/maps?q=${latitude},${longitude}`))
        callback()
    }) 

})


  server.listen(port,()=>{
    console.log('Server is up and running on port '+port)
})
