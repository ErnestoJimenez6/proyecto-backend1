import mongoose from'mongoose'

const productSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
})

export default mongoose.model('product',productSchema)