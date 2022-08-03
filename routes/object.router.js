 import { Router } from "express";
import objectContenedor from "../contenendor/object.js";
import { uploader } from "../utils.js";

const router = Router();
const objectService = new objectContenedor();




router.post('/',uploader.single('image'),async(req,res)=>{
    const {name,precio,color} = req.body;
    console.log(req.body);
     if(!req.file) res.status(500).send({status: 'error', error:'No se pudo cargar el archivo'});
    if(!name||!precio||!color) return res.status(400).send({status: "error", error:"Incomplete values"});
    let object = {
        name,
        precio,
        color,
        image: req.file.filename
    } 
     await objectService.createPet(object);
    res.send({status:'success',message:"Object created"});
})

export default router; 