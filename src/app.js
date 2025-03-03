import express from'express'
import{engine}from'express-handlebars'
import ProductManager from'./managers/productManager.js'
import CartManager from'./managers/cartManager.js'
import productsRouter from'./routes/products.router.js'
import cartsRouter from'./routes/carts.router.js'
import viewsRouter from'./routes/views.router.js'
import multer from'multer'
import{Server}from'socket.io'

const app=express()
const upload=multer({dest:'upload/'})

//Configuración de Handlebars
app.engine('handlebars',engine({
    defaultLayout:'main',
    partialsDir:'./src/views/partials'
}))
app.set('view engine','handlebars')
app.set('views','./src/views')
app.post('/upload',upload.single('archivo'),(req,res)=>{
    console.log(req.file)
    res.send('archivo subido')
})

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('./src/public'))

const productManager=new ProductManager('./src/data/products.json')
const cartManager=new CartManager('./src/data/carts.json')

//Rutas para productos y carritos
app.use('/api/products',productsRouter(productManager))
app.use('/api/carts', cartsRouter(cartManager))

//Ruta para vistas
app.use('/',viewsRouter)

const port=8080
const httpServer=app.listen(port,()=>{
    console.log(`Servidor escuchando en http://localhost:${port}`)
})

const io=new Server(httpServer)

let messages=[]

io.on('connection',(socket)=>{
    console.log('usuario conectado...')
    socket.on('message',data=>{
        messages.push(data)
        socket.emit('messageLogs',messages)
    })
})