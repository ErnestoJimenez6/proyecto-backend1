import mongoose from'mongoose'

const productSchema=new mongoose.Schema({
    title:{
        type:String, 
        required:true,
        index:true
    },
    description:{ 
        type: String, 
        required: true
    },
    price:{ 
        type:Number, 
        required:true,
        min:0
    },
    genre:{ 
        type:String, 
        required:true,
        enum:['Ciencia Ficción','Fantasía','Terror']
    },
    stock:{ 
        type:Number, 
        required:true,
        min:0
    }
})

const ProductModel=mongoose.model('Product',productSchema)
export default ProductModel