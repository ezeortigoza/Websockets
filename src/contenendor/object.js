import fs from 'fs';
import __dirname from '../utils.js'


const path = 'object.json'

class objectContenedor{//class contenedora
//No todas las clases necesitan un constructor
constructor(){
    this.path = __dirname+'/files/object.json'
}
    getAll = async() =>{
      try{
        if(fs.existsSync(this.path)){
            let fileData = await fs.promises.readFile(this.path,'utf-8');
            let articulo = JSON.parse(fileData);
           return articulo;
        }else{
            return [];//No tiene mascotas
        }
      } catch(error){
        console.log('Error de lectura'+ error)
      }
}
    save = async (articulo) =>{
        try{
            let productos = await this.getAll();
            if(productos.length === 0){
                articulo.id = 1;
                productos.push(articulo);
                await fs.promises.writeFile(path,JSON.stringify(productos,null,'\t'));
            }else{//Cuando hay mas mascotas
                articulo.id = productos[productos.length-1].id+1;
                productos.push(articulo);
                await fs.promises.writeFile(path,JSON.stringify(productos,null,'\t'));
            }

        }catch(error){
            console.log('No se pudo leer el archivo' + error);
        }
    }

    getById = async (id) =>{
        try{
             let data = await this.getAll();
             const getId = data.filter(element => element.id == id);
             return getId
            //console.log('Objeto encontrado:'+ JSON.stringify(data[2]));

        }catch(error){
            console.log('Hay un error' + error)
        }
    
    }  

    deleteById = async (id)=>{
        try {
            let data = await this.getAll();
            const borrar = data.filter(object => object.id != id)
            await fs.promises.writeFile(path,JSON.stringify(borrar,null,'\t'));
            return borrar
            }
        catch (error) {
            console.log('Hay un error'+ error);
        }
    }
    
    deleteAll = async (deleteAll) =>{
        try{
            const data = await this.getAll();
            let borrar = data.filter((element) =>{
                element.id !== deleteAll;
            })
            await fs.promises.writeFile(path,JSON.stringify(borrar,null,'\t'));
            console.log("Todos los objetos fueron eliminados :" + JSON.stringify((data)));

        }catch(error){
            console.log('Hay un error' + error);
        }
    }

    actualizar = async(obj) =>{
        let arr = await this.getAll()
        let id = obj.id;
        let titulo = obj.title;
        let price = obj.price;
        let thumbnail = obj.thumbnail;
        arr.map(function(dato){
            if(dato.id == id){
                dato.title = titulo;
                dato.price = price;
                dato.thumbnail = thumbnail;
            }
        })
        await fs.promises.writeFile(path,JSON.stringify(arr,null,'\t'));
        console.log(arr)
        return arr;
    }

    createPet = async(pet) =>{
        let pets = await this.getAll();
        if(pets.length === 0){
            pet.id=1;
            pet.isAdopted = false;
            pets.push(pet);
            await fs.promises.writeFile(this.path,JSON.stringify(pets,null,'\t'));
        }
        else{
            pet.id = pets[pets.length-1].id+1;
            pet.isAdopted = false;
            pets.push(pet);
            await fs.promises.writeFile(this.path,JSON.stringify(pets,null,'\t'));
        }
    }
  
   
}
export default objectContenedor


