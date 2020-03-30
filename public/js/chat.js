const socket=io()

 ////elements
const $messageForm=document.querySelector('.message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocation=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')

//templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML
//options
const {username,room} = Qs.parse(location.search, {ignoreQueryPrefix:true}) // return object


const autoscroll=()=>{
    // new message element
    const $newMessage=$messages.lastElementChild

    //height of new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin


    //visible height

    const visibleHeight=$messages.offsetHeight

    //height of messages container
    const containerHeight=$messages.scrollHeight

//how far have i scrolled
const scrollOffset=$messages.scrollTop + visibleHeight  //top se kitna necche he scroller


if(containerHeight-newMessageHeight <=scrollOffset)
{
$messages.scrollTop=$messages.scrollHeight  //push us to the bottom
}

}

socket.on('message',(msg)=>{ //msg has that callback fn that passed in server
    console.log(msg)  
    const html=Mustache.render(messageTemplate,{
        username:msg.username,
        message:msg.text,
        createdAt:moment(msg.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)

    autoscroll()
})
socket.on('sendLocation',(url)=>{
    console.log(url)
    const html=Mustache.render(locationTemplate,{
        username:url.username,
        location:url.url,
        createdAt:moment(url.createdAt).format('hh:mm a')

    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})



socket.on('roomData',({room,users})=>{
const html=Mustache.render(sidebarTemplate,{
    room,
    users
})
document.querySelector("#sidebar").innerHTML=html

})





//message-----------------------

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    //disable

    $messageFormButton.setAttribute('disabled','disabled') //first diaabled is name
    const message=e.target.elements.message.value  //target is form here as it is inside message-form,message-as name is message
    socket.emit('sendMessage',message,(error)=>{
       //enable
       $messageFormButton.removeAttribute('disabled') 
        $messageFormInput.value=''
        $messageFormInput.focus()


        if(error)
       {
           return console.log(error)
       }
       console.log('Message Delivered')
    })
})
 

$sendLocation.addEventListener('click',()=>{
    
    if(!navigator.geolocation)
    {
        return alert('Geolocation is not supported by ur browser')
    }
//disable
$sendLocation.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{  //we can't use promise or async/await as it doen't support


const latitude=position.coords.latitude
const longitude=position.coords.longitude
socket.emit('sendLocation',{latitude,longitude},()=>{
   
   //enable
    $sendLocation.removeAttribute('disabled')
    console.log('Location shared')

})

    })     
})


socket.emit('join',{username,room},(error)=>{
    if(error)
    {
        alert(error)
        location.href='/'   //to send them to root of file
    }
})