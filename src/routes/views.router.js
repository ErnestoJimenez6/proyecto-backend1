import{Router}from'express'
import ProductManager from'../managers/productManager.js'

export default(productManager,cartManager)=>{
    const router=Router()

    // Ruta principal (home)
    router.get('/',async(req,res)=>{
        const products=await productManager.getProducts()
        res.render('index',{products})
    })

    // Ruta de contacto
    router.get('/contactos',(req,res)=>{
        res.render('contactos')
    })

    // Ruta de la tienda
    router.get('/tienda',async(req,res)=>{
        const products=await productManager.getProducts()
        res.render('tienda',{products})
    })

    // Ruta de productos en tiempo real
    router.get('/realtimeproducts',async(req,res)=>{
        const products=await productManager.getProducts()
        res.render('realTimeProducts',{products})
    })

    // Ruta para detalles del producto
    router.get('/product/:id',async(req,res)=>{
        const productId=parseInt(req.params.id)
        const product=await productManager.getProductById(productId)
        if(product){
            res.render('productDetail',{product})
        }else{
            res.status(404).send('Libro no encontrado')
        }
    })

    // Ruta para el carrito
    router.get('/cart',async(req,res)=>{
        try{
            const carts=await cartManager.getCarts()
            let cart
    
            if(carts.length===0){
                cart=await cartManager.createCart()
            }else{
                const cartId=carts[0].id
                cart=await cartManager.getCartById(cartId)
            }
    
            if(cart){
                res.render('cart',{cart})
            }else{
                res.status(404).send('Carrito no encontrado')
            }
        }catch(error){
            console.error('Error al obtener el carrito:',error)
            res.status(500).send('Error interno del servidor')
        }
    })

    return router
}