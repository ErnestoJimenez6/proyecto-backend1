import express from'express'

export default(productManager)=>{
    const router=express.Router()

    router.get('/',async(req,res)=>{
        const{limit=10,page=1,sort,query}=req.query
        const filter=query?JSON.parse(query):{}
        const options={limit:parseInt(limit),page:parseInt(page),sort,query:filter}
        const result=await productManager.getProducts({},options)
        res.json(result)
    })

    router.get('/:pid',async(req,res)=>{
        const product=await productManager.getProductById(req.params.pid)
        if(product){
            res.json(product)
        }else{
            res.status(404).json({error:'Producto no encontrado'})
        }
    })

    router.post('/',async(req,res)=>{
        const newProduct=await productManager.addProduct(req.body)
        res.status(201).json(newProduct)
    })

    router.put('/:pid',async(req,res)=>{
        const updatedProduct=await productManager.updateProduct(req.params.pid,req.body)
        if(updatedProduct){
            res.json(updatedProduct)
        }else{
            res.status(404).json({error:'Producto no encontrado'})
        }
    })

    router.delete('/:pid',async(req,res)=>{
        const deletedProduct=await productManager.deleteProduct(req.params.pid)
        if(deletedProduct){
            res.json(deletedProduct)
        }else{
            res.status(404).json({error:'Producto no encontrado'})
        }
    })

    return router
}