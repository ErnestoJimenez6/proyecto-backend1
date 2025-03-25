import{Router}from'express'
import ProductManager from'../managers/productManager.js'

export default(productManager,cartManager)=>{
    const router=Router()

    router.get('/',async(req,res)=>{
        const products=await productManager.getProducts()
        console.log('Datos enviados a la vista:', products)
        res.render('index',{products:products.payload})
    })

    router.get('/tienda',async(req,res)=>{
        const{limit=10,page=1,sort,query}=req.query
        const filter=query?JSON.parse(query):{}
        const options={limit:parseInt(limit),page:parseInt(page),sort,query:filter}
        const result=await productManager.getProducts({},options)
        res.render('tienda',{products:result.payload, ...result})
    })

    router.get('/product/:id',async(req,res)=>{
        const productId=req.params.id
        const product=await productManager.getProductById(productId)
        if(product){
            res.render('productDetail',{product})
        }else{
            res.status(404).send('Libro no encontrado')
        }
    })

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