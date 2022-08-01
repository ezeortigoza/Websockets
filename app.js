 import express from "express";
import __dirname from "./utils.js";
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import objectRouter from './routes/object.router.js';
import { Server } from 'socket.io';
import router from "./routes/object.router.js";





const app = express();
const server = app.listen(8080,() => console.log("Listening on 8080"));
const io = new Server(server);

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use(express.json());
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
    socket.on('products',data=>{
        router.push(data);
        io.emit('router',router);
    })
})
 

