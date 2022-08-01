import {Router} from "express";
import objectContenedor from "../contenendor/object.js";

const router = Router();
const objectService = new objectContenedor();
router.get('/',(req,res)=>{
    res.render('welcome')
})

router.get('/newObject', async (req,res)=>{
    let object = await objectService.getAll();
    res.render('newObject',{
        object,
    });
})

/* router.get('/object',async(req,res)=>{
    let object = await objectService.getAll();
    res.render('object',{
        object,
        name: "Carlos"
    });
}) */

export default router;
