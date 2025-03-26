import express from'express'

export default(productManager)=>{
    const router=express.Router()

    router.get('/',async(req,res)=>{
        try {
            const limit=Math.min(parseInt(req.query.limit)||10,100)
            const page=Math.max(parseInt(req.query.page)||1,1)
            const sort=req.query.sort==='desc'?'desc':'asc'
            
            let queryString='{}'
            try{
                if(req.query.query){
                    const rawQuery=typeof req.query.query==='string' 
                        ?JSON.parse(req.query.query) 
                        :req.query.query
                    
                    if(typeof rawQuery!=='object'||rawQuery===null){
                        throw new Error('El query debe ser un objeto JSON válido')
                    }
                    
                    const allowedFilters=['genre','stock']
                    const filteredQuery={}
                    
                    Object.keys(rawQuery).forEach(key=>{
                        if(allowedFilters.includes(key)){
                            filteredQuery[key]=rawQuery[key]
                        }
                    })

                    queryString=JSON.stringify(filteredQuery)
                }
            }catch(error){
                return res.status(400).json({
                    status:'error',
                    error:`Query inválido: ${error.message}`
                })
            }

            const result=await productManager.getProducts(
                {},
                {limit,page,sort,query:queryString}
            )

            if(result.payload){
                const baseUrl=`${req.protocol}://${req.get('host')}${req.baseUrl}`
                const queryParams=new URLSearchParams({
                    limit,
                    sort,
                    query:queryString
                }).toString()

                result.prevLink=result.hasPrevPage 
                    ?`${baseUrl}?page=${result.prevPage}&${queryParams}`
                    :null

                result.nextLink=result.hasNextPage
                    ?`${baseUrl}?page=${result.nextPage}&${queryParams}`
                    :null
            }

            res.json(result)
        }catch(error){
            res.status(500).json({
                status:'error',
                error:error.message,
                ...(process.env.NODE_ENV==='development'&&{stack:error.stack})
            })
        }
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