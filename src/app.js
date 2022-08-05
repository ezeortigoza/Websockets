 import express from "express";
import __dirname from "./utils.js";
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import objectRouter from './routes/object.router.js';
import { Server } from 'socket.io';
// import objectContenedor from "./contenendor/object.js";
import fs from 'fs';
import objectContenedor from "./contenendor/object.js";



const app = express();
const server = app.listen(8080,() => console.log("Listening on 8080"));
const io = new Server(server);


app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname+'/public'));
app.use('/',viewsRouter);
app.use('/api/object',objectRouter);

let log = [];
io.on('connection',socket=>{
    console.log('socket connection');


    socket.on('message', data =>{
        socket.broadcast.emit('newUser');
        log.push(data);
        io.emit('log',log);
    })
    socket.on('productListRequest',async (data)=>{
        const objectService = await objectContenedor.getAll()
        socket.emit('updateProductList', objectService)
    })


    socket.on('addNewProduct', async (newProduct) => {
        console.log('>>> addNewProduct')
        console.log('addNewProduct : ', newProduct)



        const FileName = newProduct.filename;
        console.log(`FileName : `, FileName )
        // const splitted = newProduct.data.split(';base64,');
        // const format = splitted[0].split('/')[1];
        // console.log(`format : ${format}`)

        const file = __dirname + `/public/img/${Date.now()}-${FileName}`;
        console.log(`file : ${file}`)
        if (newProduct.title.length > 25  ){
            socket.emit('error', 'Title must be less than 25 characters')
          }
          else if (newProduct.price > 0 && newProduct.price <= 100000){
            socket.emit('error', 'Price must be between 0 and 100000')
          }else{
    
            let newProductWithOutImage = {
              title: newProduct.title, 
              price: newProduct.price, 
              thumbnail: `${host}/img/${FileName}`
            }
            fs.writeFileSync(file, new Buffer(newProduct.data.split(';base64,')[1], 'base64'))
       await object.addNewProduct(newProductWithOutImage)
        const allProducts = await objectContenedor.getAll()
        io.sockets.emit('updateProductList', allProducts)
        }
            

    })


})
