import{Router}from'express'

const router=Router()

// Array de productos
const arrayProductos=[
    {nombre:'Libro1',descripcion:'Ciencia Ficción',precio:100},
    {nombre:'Libro2',descripcion:'Terror',precio:200},
    {nombre:'Libro3',descripcion:'Fantasía',precio:300},
    {nombre:'Libro4',descripcion:'Ciencia Ficción',precio:400},
    {nombre:'Libro5',descripcion:'Terror',precio:500},
    {nombre:'Libro6',descripcion:'Fantasía',precio:600}
]

// Rutas
router.get('/',(req,res)=>{
    const usuario={
        nombre:'Ernesto',
        apellido:'Jimenez',
        mayorEdad:true
    }
    res.render('index',{usuario,arrayProductos})
})

router.get('/contactos',(req,res)=>{
    res.render('contactos')
})

router.get('/tienda',(req,res)=>{
    res.render('tienda')
})

export default router