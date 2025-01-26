const express=require('express')
const app=express()
const ProductManager=require('./managers/productManager')
const CartManager=require('./managers/cartManager')

const productManager=new ProductManager('./src/data/products.json')
const cartManager=new CartManager('./src/data/carts.json')

app.use(express.json())

// Rutas para productos
const productsRouter=require('./routes/products.router')(productManager)
app.use('/api/products',productsRouter)

// Rutas para carritos
const cartsRouter=require('./routes/carts.router')(cartManager)
app.use('/api/carts',cartsRouter)

const port=8080
app.listen(port,()=>{
    console.log(`servidor escuchando en http://localhost:${port}`)
})