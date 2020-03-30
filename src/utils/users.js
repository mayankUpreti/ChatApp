const users=[]
//adduser removeUser,getUser,getUsersInRoom


//adduser-----------------
const addUser=({id,username,room})=>{
//clean the data
username=username.trim().toLowerCase()
room=room.trim().toLowerCase()

//validate the data
if(!room || !username)
{
    return{
        error:'Username and room are provided'
    }
}
//check for existing user
const existinguser=users.find((user)=>{
return user.room===room && user.username===username
})

//validate username
if(existinguser)
{
    return {
        error:'Username is in use!'
    }
}

//store user
const user={id,username,room}
users.push(user)
return{user}

}
//remove user-----------
const removeUser=(id)=>{
    const index=users.findIndex((user)=>{          //-1 if we didn't find match or 0 and greater if we find
        return user.id===id
    })
if(index!=-1)
{
    return users.splice(index,1)[0]   //splice to remove the item, 1 is for no. of items we want to remove, return the removed items array
                                 //return array,splice is fast as it stops as it find unlike filter which runs even after 
}

}

//getuser-----------------
const getUser=(id)=>{
   return users.find((user)=>{
     return user.id===id
    })
    
}

//getusersinrooom------------------------
const getUsersInRoom=(room)=>{
    room=room.trim().toLowerCase()
return users.filter((user)=>{
  return user.room===room
})
}

module.exports={
    addUser,removeUser,getUser,getUsersInRoom
}