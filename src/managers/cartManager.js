import mongoose from'mongoose'
import ProductModel from'../models/product.js'
import CartModel from'../models/cart.js'

class CartManager{
    constructor(){
        this.Cart=Cart
    }

    async getCarts(){
        console.error('Error en GET /api/carts:',error)
    res.status(500).json({ 
        error:'Error al obtener carritos',
        details:process.env.NODE_ENV==='development'?error.message:undefined
    })
    }

    async getCartById(id){
        return await this.Cart.findById(id).populate('products.product')
    }

    async createCart(){
        return await this.Cart.create({products:[]})
    }

    async addProductToCart(cartId,productId){
        const product=await Product.findById(productId)
        if(!product)throw new Error('Producto no encontrado')
        if(product.stock<1)throw new Error('Producto sin stock')

        const updatedCart=await this.Cart.findOneAndUpdate(
            {_id:cartId,'products.product':productId},
            {$inc:{'products.$.quantity':1}},
            {new:true}
        )

        if(!updatedCart){
            await this.Cart.findByIdAndUpdate(
                cartId,
                {$push:{products:{product:productId,quantity:1}}},
                {new:true,upsert:true}
            )
        }

        await Product.findByIdAndUpdate(productId,{$inc:{stock: -1}})

        return this.getCartById(cartId)
    }
}

export default CartManager