
 let username;
 let socket = io({
    autoConnect:false
});
 
Swal.fire({
    title:"Identifícate",
    input:"text",
    text:"Ingresa tu email para identificarte en el chat",
    inputValidator: (value) =>{
        return !value && "Necesitas identificarte para poder continuar >:("
    },
    allowOutsideClick:false,
    allowEscapeKey:false
}).then(result=>{
    username = result.value;
    socket.connect();
}) 


 
const objectForm = document.getElementById('objectForm');

objectForm.addEventListener('submit', evt =>{
    evt.preventDefault();
    const newProduct = {
        name: objectForm[0][0].value,
        precio: objectForm[0][1].value,
        //thumbnail: objectForm[0][2].value,
      }
    /* const formData = new FormData(objectForm);
 
         fetch('/api/object',{
             method:"POST",
             body:formData,
             header:{
                 'Content-Type' : 'application/json'
             }
         })
         .then(result=>result.json())
        .then(json=>console.log(json))  */

    /* 
         .then(
             socket.emit('addNewProduct',formData)
         )   */

    /*  let formDataSocket = {}
    new FormData(objectForm).forEach( (value, key) =>formData[key] = value)
     console.log('formData : ',formDataSocket) ; */
    
    
    /* socket.emit('addNewProduct',formData)


        socket.emit('addNewProduct',formData)
         socket.emit('products', formData=>{
            let form = document.getElementById('form');
            formData.forEach(info=>{
             form = `${info.name}  ${info.precio}`
           })
           form.innerHTML = info;
         })  */
        const ourFile = document.getElementById('image').files[0];
        const reader = new FileReader();
        reader.onloadend = function() {
            socket.emit("addNewProduct", {data:reader.result, filename: ourFile.name,
                name: newProduct.title,
                precio: newProduct.price});
        }
        reader.readAsDataURL(ourFile);
       objectForm.trigger('reset');

        socket.on('updateProductList', productListHandler)

        async function productListHandler(allProducts) {
          const productLayout = await fetch('views/newObject.handlebars')
          const layoutText = await productLayout.text()
          const compiledHbsTemplate = Handlebars.compile(layoutText)
          const html = compiledHbsTemplate({ allProducts })
          productViewContainer.empty().append(html)
        }
  

})

const chatBox = document.getElementById('chatBox');
chatBox.addEventListener('keyup',evt=>{
    if(evt.key==='Enter'){
        if(chatBox.value.trim().length>0){
            socket.emit('message',{user:username,message:chatBox.value})
            chatBox.value="";
        }
        } 

    }
)

socket.on('log',data=>{
    let fechaActual = new Date();
    let horas = fechaActual.getHours();
    let minutos = fechaActual.getMinutes();
    let segundos = fechaActual.getSeconds();
    let jornada = horas >=12 ? 'PM' : 'AM';
    minutos = ('0' + minutos).slice(-2);
    segundos = ('0'+ minutos).slice(-2);
    let log = document.getElementById('log');
    let messages = "";
    data.forEach(message=>{
        messages = messages+`${message.user} ${horas % 12} ${jornada} : ${minutos} : ${segundos} dice: ${message.message}</br>`
    })
    log.innerHTML = messages;
})

socket.on('newUser', data =>{
    if(username){
        Swal.fire({
            text:"Nuevo usuario en el chat",
            toast:true,
            postion:"top-right",
            timer: 2000
        })
    }
}) 




