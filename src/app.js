import express from'express'
import{engine}from'express-handlebars'
import ProductManager from'./managers/productManager.js'
import CartManager from'./managers/cartManager.js'
import productsRouter from'./routes/products.router.js'
import cartsRouter from'./routes/carts.router.js'
import viewsRouter from'./routes/views.router.js'
import{Server}from'socket.io'

const{MongoClient}=require('mongodb')

async function insertProducts(){
    const client=new MongoClient('mongobd://localhost:27017')
    await client.connect()

    const db=client.db('tienda')
    const result=await db.collection('libros').insertOne({
        nombre:'Duna',
        precio:2000,
        stock:20
    })

    console.log('libro insertado con id',result.insertedId)
    await client.close()
}

const app=express()

insertProducts()

// Configuración de Handlebars
app.engine('handlebars',engine({
    defaultLayout:'main',
    partialsDir:'./src/views/partials'
}))
app.set('view engine','handlebars')
app.set('views','./src/views')

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('./src/public'))

// Inicializa los managers
const productManager=new ProductManager('./src/data/products.json')
const cartManager=new CartManager('./src/data/carts.json')

// Crear un carrito por defecto al iniciar la aplicación
;(async()=>{
    try{
        const carts=await cartManager.getCarts()
        if(carts.length===0){
            await cartManager.createCart()
            console.log('Carrito por defecto creado.')
        }
    }catch(error){
        console.error('Error al crear el carrito por defecto:',error)
    }
})()

// Rutas para productos y carritos
app.use('/api/products',productsRouter(productManager))
app.use('/api/carts',cartsRouter(cartManager))

// Ruta para vistas (pasa productManager y cartManager)
app.use('/',viewsRouter(productManager,cartManager))

const port=8080
const httpServer=app.listen(port,()=>{
    console.log(`Servidor escuchando en http://localhost:${port}`)
})

// Configuración de Socket.io
const io = new Server(httpServer)

io.on('connection',async(socket)=>{
    console.log('Usuario conectado...')
    try{
        // Enviar lista de productos al cliente cuando se conecta
        const products=await productManager.getProducts()
        socket.emit('updateProducts',products)

        // Escuchar evento para agregar producto
        socket.on('addProduct',async(product)=>{
            try{
                await productManager.addProduct(product)
                const updatedProducts=await productManager.getProducts()
                io.emit('updateProducts',updatedProducts)
            }catch(error){
                console.error('Error al agregar producto:',error)
            }
        })

        // Escuchar evento para eliminar producto
        socket.on('deleteProduct',async(id)=>{
            try{
                await productManager.deleteProduct(id)
                const updatedProducts=await productManager.getProducts()
                io.emit('updateProducts',updatedProducts)
            }catch(error){
                console.error('Error al eliminar producto:',error)
            }
        })
    }catch(error){
        console.error('Error al obtener productos:',error)
    }
})