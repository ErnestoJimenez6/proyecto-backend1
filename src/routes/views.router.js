import{Router}from'express'
import ProductManager from'../managers/productManager.js'

export default(productManager,cartManager)=>{
    const router=Router()

    router.get('/',async(req,res)=>{
        try {
            const{limit=10,page=1,sort,query}=req.query

            const result=await productManager.getProducts({},{limit,page,sort,query})
            
            res.render('index',{
                products:result.payload,
                ...result
            })
        }catch(error){
            res.status(500).render('error',{error:error.message})
        }
    })

    router.get('/tienda',async(req,res)=>{
        try{
            const{limit=10,page=1,sort,query}=req.query
            
            const queryString=typeof query==='object' 
                ?JSON.stringify(query) 
                :query||'{}'
    
            const result=await productManager.getProducts({},{
                limit,
                page,
                sort,
                query:queryString
            })

            res.render('tienda',{
                products:result.payload,
                ...result,
                query:query?JSON.parse(queryString):{},
                limit,
                sort
            })
        }catch(error){
            console.error('Error en /tienda:',error)
            res.status(500).render('error',{ 
                error:'Error al cargar los productos',
                details:error.message
            })
        }
    })

    router.get('/product/:id',async(req,res)=>{
        try{
            const product=await productManager.getProductById(req.params.id)
            res.render('productDetail',{
                product,
                id:product._id.toString() 
            })
        }catch(error){
            res.status(404).render('error',{error:error.message})
        }
    })

    router.get('/realtimeproducts',async(req,res)=>{
        try{
            const products=await productManager.getProducts()
            res.render('realTimeProducts',{ 
                products:products.payload||products 
            })
        }catch(error){
            res.status(500).render('error',{error:error.message})
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

    router.get('/carts/:cid',async(req,res)=>{
        try{
            const cartId=req.params.cid

            if(!mongoose.Types.ObjectId.isValid(cartId)){
                return res.status(400).render('error',{
                    error:'ID de carrito inválido'
                })
            }
    
            const cart=await cartManager.getCartById(cartId)

            if(!cart){
                return res.status(404).render('error',{
                    error:'Carrito no encontrado'
                })
            }

            const total=cart.products.reduce((sum,item)=>{
                return sum+(item.product.price*item.quantity)
            },0)

            res.render('cart',{
                cart,
                total:total.toFixed(2),
                cartId:cart._id.toString()
            })

        }catch(error){
            console.error(`Error al obtener carrito ${req.params.cid}:`,error)
            res.status(500).render('error',{
                error:'Error al cargar el carrito',
                details:process.env.NODE_ENV==='development'?error.message:undefined
            })
        }
    })

    return router
}