const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'upload/')
    },
    filename:(req,file,cb)=>{
        const unicoInfix=Date.now()+' - '+Math.round(Math.random())
        cb(null,file.fielname+' - ',unicoInfix+' - '+file.originalname)
    }
})

const upload=multer({storage:storage})