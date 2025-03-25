import express from'express'
import CartModel from'../models/cart.js'

export default(cartManager)=>{
    const router=express.Router()

    router.post('/',async(req,res)=>{
        const newCart=await cartManager.createCart()
        res.status(201).json(newCart)
    })

    router.get('/',async(req,res)=>{
        try{
            const carts=await cartManager.getCarts()
            res.json(carts)
        }catch(error){
            res.status(500).json({error:error.message})
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

    router.get('/:cid',async(req,res)=>{
        const cart=await cartManager.getCartById(req.params.cid)
        if(cart){
            res.json(cart)
        }else{
            res.status(404).json({error:'Carrito no encontrado'})
        }
    })

    router.post('/:cid/products/:pid',async(req,res)=>{
        try{
            const cart=await cartManager.addProductToCart(
                req.params.cid, 
                req.params.pid
            )

            req.app.get('io').emit('cartUpdated',cart)

            res.status(200).json(cart)
            }catch(error){
            res.status(400).json({ 
                error:error.message,
                stack:process.env.NODE_ENV==='development'?error.stack:undefined
            })
        }
    })

    router.delete('/:cid/products/:pid',async(req,res)=>{
        const cart=await cartManager.deleteProductFromCart(req.params.cid,req.params.pid)
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

    return router
}