import mongoose from'mongoose'
import CartModel from'../models/cart.js'
import ProductModel from'../models/product.js'

class CartManager{
    constructor(){
        this.CartModel=CartModel
        this.ProductModel=ProductModel
    }

    async createCart(){
        try{
            const newCart=new this.CartModel({products:[]})
            await newCart.save()
            return newCart
        }catch(error){
            throw new Error(`Error creating cart: ${error.message}`)
        }
    }

    async getCarts(){
        try{
            return await this.CartModel.find().populate('products.product')
        }catch(error){
            console.error('Error getting carts:',error)
            throw new Error('Error al obtener carritos')
        }
    }

    async getCartById(id){
        try{
            const cart=await this.CartModel.findById(id).populate('products.product')
            if(!cart) throw new Error('Carrito no encontrado')
            return cart
        }catch(error){
            console.error(`Error getting cart ${id}:`,error)
            throw error
        }
    }

    async addProductToCart(cartId,productId){
        try{
            const product=await this.ProductModel.findById(productId)
            if(!product)throw new Error('Producto no encontrado')
            if(product.stock<1)throw new Error('Producto sin stock')

            let updatedCart=await this.CartModel.findOneAndUpdate(
                {_id:cartId,'products.product':productId},
                {$inc:{'products.$.quantity':1}},
                {new:true}
            )

            if(!updatedCart){
                updatedCart=await this.CartModel.findByIdAndUpdate(
                    cartId,
                    {$push:{products:{product:productId,quantity:1}}},
                    {new:true,upsert:true}
                )
            }

            await this.ProductModel.findByIdAndUpdate(productId,{$inc:{stock: -1}})

            return this.getCartById(cartId)
        }catch(error){
            console.error(`Error adding product ${productId} to cart ${cartId}:`,error)
            throw error
        }
    }
}

export default CartManager