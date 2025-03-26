import ProductModel from'../models/product.js'

class ProductManager{
    async addProduct(product){
        try{
            const newProduct=new ProductModel(product)
            await newProduct.save()
            console.log('Producto agregado:',newProduct)
            return newProduct
        }catch(error){
            console.error('Error al agregar el producto:',error)
            throw error
        }
    }

    async getProducts(filters={},options={}){
        try{
            const{
                limit=10,
                page=1,
                sort,
                query
            }=options

            const mongoFilters={...filters}
            
            let parsedQuery={}
            if(options.query){
                parsedQuery=typeof options.query==='string' 
                    ?JSON.parse(options.query) 
                    :options.query
            }

            if(parsedQuery.genre){
                mongoFilters.genre=parsedQuery.genre
            }
            if(parsedQuery.stock==='available'){
                mongoFilters.stock={$gt:0}
            } else if(parsedQuery.stock==='unavailable'){
                mongoFilters.stock=0
            }

            const queryOptions={
                limit:parseInt(limit),
                skip:(parseInt(page) - 1)*parseInt(limit),
                sort:sort==='asc'?{price:1}:sort==='desc'?{price: -1}:null
            }

            const[products,totalDocs]=await Promise.all([
                ProductModel.find(mongoFilters)
                    .sort(queryOptions.sort)
                    .limit(queryOptions.limit)
                    .skip(queryOptions.skip)
                    .lean(),
                ProductModel.countDocuments(mongoFilters)
            ])

            const totalPages=Math.ceil(totalDocs / queryOptions.limit)
            const hasPrevPage=page>1
            const hasNextPage=page<totalPages

            const buildLink=(options,newPage)=>{
                const params=new URLSearchParams()
                if(options.limit)params.append('limit',options.limit)
                if(options.sort)params.append('sort',options.sort)
                if(options.query)params.append('query',options.query)
                params.append('page',newPage)
                return `/api/products?${params.toString()}`
            }

            return{
                status:'success',
                payload:products,
                totalPages,
                prevPage:hasPrevPage?parseInt(page) - 1:null,
                nextPage:hasNextPage?parseInt(page)+1:null,
                page:parseInt(page),
                hasPrevPage,
                hasNextPage,
                prevLink:hasPrevPage?buildLink(page - 1):null,
                nextLink:hasNextPage?buildLink(page+1):null
            }
        }catch(error){
            console.error('Error al obtener productos:',error)
            return{
                status:'error',
                error:error.message
            }
        }
    }

    async getProductById(id){
        try{
            const product=await ProductModel.findById(id)
            if(!product){
                throw new Error('Producto no encontrado')
            }
            return product
        }catch(error){
            console.error(`Error al obtener producto con ID ${id}:`,error)
            throw error
        }
    }
}

export default ProductManager