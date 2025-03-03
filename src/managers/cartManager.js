import fs from 'fs/promises'

class CartManager{
    constructor(filePath){
        this.filePath=filePath
        this.inicializarArchivo()
    }

    async inicializarArchivo(){
        try{
            await fs.access(this.filePath)
        }catch(error){
            if(error.code==='ENOENT'){
                await fs.writeFile(this.filePath,'[]')
                console.log(`Archivo ${this.filePath} creado.`)
            }else{
                console.error('Error al inicializar el archivo:',error)
            }
        }
    }

    async createCart(){
        try{
            const carts=await this.getCarts()
            const newCart={
                id:this.generateId(carts),
                products: []
            }
            carts.push(newCart)
            await fs.writeFile(this.filePath, JSON.stringify(carts,null,2))
            console.log('Carrito creado:',newCart)
            return newCart
        }catch(error){
            console.error('Error al crear el carrito:',error)
        }
    }

    async getCarts(){
        try{
            const data=await fs.readFile(this.filePath,'utf-8')
            return JSON.parse(data)
        }catch(error){
            if (error.code==='ENOENT'){
                console.log('El archivo no existe, se creará uno nuevo.')
                return []
            }else{
                console.error('Error al leer los carritos:',error)
                return []
            }
        }
    }

    async getCartById(id){
        try{
            const carts=await this.getCarts()
            const cart=carts.find(c=>c.id===id)
            if(cart){
                return cart
            }else{
                console.error('Carrito no encontrado.')
                return null
            }
        }catch(error){
            console.error('Error al obtener el carrito:',error)
            return null
        }
    }

    async addProductToCart(cartId, productId){
        try{
            const carts=await this.getCarts()
            const cartIndex=carts.findIndex(c=>c.id===cartId)
            if(cartIndex!==-1){
                const cart=carts[cartIndex]
                const productIndex=cart.products.findIndex(p=>p.product===productId)
                if (productIndex!==-1){
                    cart.products[productIndex].quantity+=1
                }else{
                    cart.products.push({ product:productId,quantity:1})
                }
                await fs.writeFile(this.filePath,JSON.stringify(carts,null,2))
                console.log('Producto agregado al carrito:',cart)
                return cart
            }else{
                console.error('Carrito no encontrado.')
                return null
            }
        }catch(error){
            console.error('Error al agregar el producto al carrito:',error)
            return null
        }
    }

    generateId(carts){
        return carts.length>0?Math.max(...carts.map(c=>c.id))+1:1
    }
}

export default CartManager