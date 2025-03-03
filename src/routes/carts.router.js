import express from'express'

export default(cartManager)=>{
    const router=express.Router()

    router.post('/',async(req,res)=>{
        const newCart=await cartManager.createCart()
        res.status(201).json(newCart)
    })

    router.get('/:cid',async(req,res)=>{
        const cart=await cartManager.getCartById(parseInt(req.params.cid))
        if(cart){
            res.json(cart)
        }else{
            res.status(404).json({
                error:'Carrito no encontrado'
            })
        }
    })

    router.post('/:cid/product/:pid',async(req,res)=>{
        const cart=await cartManager.addProductToCart(parseInt(req.params.cid),parseInt(req.params.pid))
        if(cart){
            res.json(cart)
        }else{
            res.status(404).json({
                error:'Carrito no encontrado'
            })
        }
    })

    return router
}