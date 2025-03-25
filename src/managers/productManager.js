import ProductModel from'../models/product.js'
class ProductManager{
    async addProduct(product){
        try{
            const newProduct=new Product(product)
            await newProduct.save()
            console.log('Producto agregado:',newProduct)
            return newProduct
        }catch(error){
            console.error('Error al agregar el producto:',error)
        }
    }

    async getProducts(){
        try{
            const products=await ProductModel.find({})
            return{status:'success',payload:products}
        }catch(error){
            return{status:'error',error:error.message}
            }
    }
}

export default ProductManager