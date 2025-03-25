import mongoose from'mongoose'

const CartSchema=new mongoose.Schema({
    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true,
                default:1,
                min:1
            },
        },
    ],
},{timestamps:true})

const CartModel=mongoose.model('carts',CartSchema)
export default CartModel