import fs from 'fs/promises'

class ProductManager{
    constructor(filePath){
        this.filePath=filePath
        this.inicializarArchivo()
    }

    async inicializarArchivo(){
        try{
            await fs.access(this.filePath)
        }catch(error){
            if (error.code==='ENOENT'){
                await fs.writeFile(this.filePath, '[]')
                console.log(`Archivo ${this.filePath} creado.`)
            }else{
                console.error('Error al inicializar el archivo:',error)
            }
        }
    }

    async addProduct(product){
        try{
            const products=await this.getProducts()
            const newProduct={
                id:this.generateId(products),
                ...product
            }
            products.push(newProduct)
            await fs.writeFile(this.filePath,JSON.stringify(products,null,2))
            console.log('Producto agregado:',newProduct)
            return newProduct
        }catch(error){
            console.error('Error al agregar el producto:',error)
        }
    }

    async getProducts(){
        try{
            const data=await fs.readFile(this.filePath,'utf-8')
            return JSON.parse(data)
        }catch(error){
            if (error.code==='ENOENT'){
                console.log('El archivo no existe, se creará uno nuevo.')
                return[]
            }else{
                console.error('Error al leer los productos:',error)
                return []
            }
        }
    }

    async getProductById(id){
        try{
            const products=await this.getProducts()
            const product=products.find(p=>p.id===id)
            if(product){
                return product
            }else{
                console.error('Producto no encontrado.')
                return null
            }
        }catch(error){
            console.error('Error al obtener el producto:',error)
            return null
        }
    }

    async updateProduct(id,updatedFields){
        try{
            const products=await this.getProducts()
            const productIndex=products.findIndex(p=>p.id===id)
            if(productIndex!==-1){
                products[productIndex]={...products[productIndex], ...updatedFields}
                await fs.writeFile(this.filePath,JSON.stringify(products,null,2))
                console.log('Producto actualizado:',products[productIndex])
                return products[productIndex]
            }else{
                console.error('Producto no encontrado.')
                return null
            }
        }catch(error){
            console.error('Error al actualizar el producto:',error)
            return null
        }
    }

    async deleteProduct(id){
        try{
            const products=await this.getProducts()
            const updatedProducts=products.filter(p=>p.id!==id)
            await fs.writeFile(this.filePath,JSON.stringify(updatedProducts,null,2))
            console.log('Producto eliminado.')
            return updatedProducts
        }catch(error){
            console.error('Error al eliminar el producto:',error)
            return null
        }
    }

    generateId(products){
        return products.length>0?Math.max(...products.map(p=>p.id))+1:1
    }
}

export default ProductManager