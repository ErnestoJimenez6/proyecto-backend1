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

    async getProducts(){
        try{
            const products=await ProductModel.find({})
            return{status:'success',payload:products}
        }catch(error){
            console.error('Error al obtener productos:',error)
            return{status:'error',error:error.message}
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