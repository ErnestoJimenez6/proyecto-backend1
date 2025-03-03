console.log('funciona todo?')

const socket=io()

let user

const chatBox=document.getElementById('chatBox')

swal.fire({
    title:'Identificate',
    input:'text',
    text:'Ingresá con tu usuario para entrar al chat',
    inputValidator:(value)=>{
        return!value&&'Escribí algo para continuar'
    },
    allowOutsideClick:false
}).then(result=>{
    user=result.value
})

chatBox.addEventListener('keyup',(event)=>{
    if(event.key==='Enter'){
        event.preventDefault()
        if(chatBox.value.trim().length>0){
            socket.emit('message',{user:user,message:chatBox.value})
            chatBox.value=''
        }
    }
})

socket.on('messageLogs',data=>{
    const log=document.getElementById('messageLogs')
    let messages=''
    data.forEach(message=>{
        messages=messages+`${message.user} dice: ${message.message} <br>`
    })
    log.innerHTML=messages
})