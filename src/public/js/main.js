document.querySelector('.navbar-toggle')?.addEventListener('click',()=>{
    document.querySelector('.navbar-menu').classList.toggle('active')
})

async function updateCartCounter(){
    try{
        const response=await fetch('/api/carts')

        if(!response.ok){
            throw new Error('Error en la respuesta del servidor')
        }

        const carts=await response.json()
        const totalItems=carts.length>0
            ?carts[0].products.reduce((acc,item)=>acc+(item.quantity||0),0)
            :0

        document.querySelector('.cart-counter').textContent=totalItems
    }catch(error){
        console.error('Error actualizando carrito:',error)
        document.querySelector('.cart-counter').textContent='0'
    }
}

async function addToCart(productId){
    try{
        const response=await fetch(`/api/carts/67e2b9f655a6b5c400d6a9ae/products/${productId}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({quantity:1})
        })

        const result=await response.json()

        if(!response.ok){
            throw new Error(result.error||'Error al agregar producto al carrito')
        }

        await Swal.fire({
            position:'top-end',
            icon:'success',
            title:'¡Producto agregado!',
            showConfirmButton:false,
            timer:1500
        })

        updateCartCounter()
    }catch(error){
        console.error('Error:',error)
        await Swal.fire({
            icon:'error',
            title:'Error',
            text:error.message
        })
    }
}

document.addEventListener('DOMContentLoaded',()=>{
    if(document.getElementById('chatBox')){
        Swal.fire({
            title:'Identifícate',
            input:'text',
            text:'Ingresa tu usuario para entrar al chat',
            inputValidator:(value)=>!value&&'Escribe algo para continuar',
            allowOutsideClick:false
        }).then(result=>{
            window.user=result.value
        })
    }

    updateCartCounter()
    
    const currentPath=window.location.pathname
    document.querySelectorAll('.nav-link').forEach(link=>{
        if(link.getAttribute('href')===currentPath){
            link.classList.add('active')
        }
    })
})

const socket=io()
socket.on('cartUpdated',updateCartCounter)
socket.on('messageLogs',data=>{
    const log=document.getElementById('messageLogs')
    if(log){
        log.innerHTML=data.map(message=>
            `${message.user} dice: ${message.message} <br>`
        ).join('')
    }
})