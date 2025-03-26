import express from'express'
import CartModel from'../models/cart.js'

export default(cartManager)=>{
    const router=express.Router()

    router.get('/',async(req,res)=>{
        try{
            const carts=await cartManager.getCarts()
            res.json(carts)
        }catch(error){
            res.status(500).json({error:error.message})
        }
    })

    router.post('/',async(req,res)=>{
        const newCart=await cartManager.createCart()
        res.status(201).json(newCart)
    })

    router.get('/:cid',async(req,res)=>{
        try{
            const cart=await cartModel.findById(req.params.cid).populate('products.product')
            res.json(cart)
        }catch(error){
            res.status(500).json({error:error.message})
        }
    })

    router.post('/active/products/:pid',async(req,res)=>{
        try{
            const carts=await cartManager.getCarts()
            let cart=carts.length>0?carts[0]:await cartManager.createCart()
            
            const updatedCart=await cartManager.addProductToCart(
                cart._id, 
                req.params.pid
            )

            if(req.app.get('io')){
                req.app.get('io').emit('cartUpdated',updatedCart)
            }
            res.status(200).json(updatedCart)
        }catch(error){
            res.status(400).json({ 
                error:error.message,
                stack:process.env.NODE_ENV==='development'?error.stack:undefined
            })
        }
    })

    router.put('/:cid/products/:pid',async(req,res)=>{
        const cart=await cartManager.updateProductQuantity(req.params.cid,req.params.pid,req.body.quantity)
        if(cart){
            res.json(cart)
        }else{
            res.status(404).json({error:'Carrito no encontrado'})
        }
    })

    router.delete('/:cid',async(req,res)=>{
        const cart=await cartManager.deleteCart(req.params.cid)
        if(cart){
            res.json(cart)
        }else{
            res.status(404).json({error:'Carrito no encontrado'})
        }
    })

    router.get('/active',async(req,res)=>{
        try{
            console.log('Intentando obtener carritos...')
            const carts=await cartManager.getCarts()
            console.log('Carritos encontrados:',carts)
            res.json(carts)
        }catch(error){
            console.error('Error en GET /api/carts:',error)
            res.status(500).json({ 
                error:'Error al obtener carritos',
                details:process.env.NODE_ENV==='development'?error.message:undefined
            })
        }
    })

    router.delete('/:cid/products/:pid',async(req,res)=>{
        const cart=await cartManager.deleteProductFromCart(
            req.params.cid,
            req.params.pid
        )
        if(cart){
            res.json(cart)
        }else{
            res.status(404).json({error:'Carrito no encontrado'})
        }
    })

    router.put('/:cid',async(req,res)=>{
        const cart=await cartManager.updateCart(req.params.cid,req.body.products)
        if(cart){
            res.json(cart)
        }else{
            res.status(404).json({error:'Carrito no encontrado'})
        }
    })

    return router
}