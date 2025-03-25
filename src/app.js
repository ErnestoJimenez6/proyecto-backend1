import express from'express'
import{engine}from'express-handlebars'
import{Server}from'socket.io'
import mongoose from'mongoose'
import ProductManager from'./managers/productManager.js'
import ProductModel from'./models/product.js'
import CartModel from'./models/cart.js'
import CartManager from'./managers/cartManager.js'
import productsRouter from'./routes/products.router.js'
import cartsRouter from'./routes/carts.router.js'
import viewsRouter from'./routes/views.router.js'

const app=express()
const MONGO_URL='mongodb://localhost:27017/marNegro'

const main=async()=>{
    try{
        await mongoose.connect('mongodb+srv://zynhop6:N1rv4n4z0$@cluster0.yvuam.mongodb.net/marNegro?retryWrites=true&w=majority&appName=Cluster0')
        // const response=await CartModel.find()
        // console.log(response)
        const product=await ProductModel.findById('67e0bb57a3e62fed02b71236')
        console.log(product)
    }catch(error){
        console.error('Error conectando a MongoDB:',error)
        process.exit(1)
    }
}

main()

// Configuración de Handlebars
app.engine('handlebars',engine({
    defaultLayout:'main',
    partialsDir:'./src/views/partials',
    runtimeOptions:{
        allowProtoPropertiesByDefault:true,
        allowProtoMethodsByDefault:true
    },
    helpers:{
        multiply:(a,b)=>a*b,
        calculateTotal:(products)=>{
            return products.reduce((total,item)=>total+(item.quantity*item.product.price),0)
        }
    }
}))
app.set('view engine','handlebars')
app.set('views','./src/views')

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('./src/public'))

// Inicializa los managers
const productManager=new ProductManager()
const cartManager=new CartManager()

// Rutas
app.use('/api/products',productsRouter(productManager))
app.use('/api/carts',cartsRouter(cartManager))
app.use('/',viewsRouter(productManager,cartManager))

// Iniciar servidor
const port=8080
const httpServer=app.listen(port,()=>{
    console.log(`Servidor escuchando en http://localhost:${port}`)
})

// Configuración de Socket.io
const io=new Server(httpServer)
io.on('connection',async(socket)=>{
    console.log('Usuario conectado...')
    const products=await productManager.getProducts()
    socket.emit('updateProducts',products.payload)

    socket.on('addProduct',async(product)=>{
        await productManager.addProduct(product)
        const updatedProducts=await productManager.getProducts()
        io.emit('updateProducts',updatedProducts.payload)
    })

    socket.on('deleteProduct',async(id)=>{
        await productManager.deleteProduct(id)
        const updatedProducts=await productManager.getProducts()
        io.emit('updateProducts',updatedProducts.payload)
    })
})