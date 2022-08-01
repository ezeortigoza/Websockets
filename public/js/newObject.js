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
    const formData = new FormData(objectForm);
    if(evt.click==='submit'){
        socket.emit('products',objectForm.value)
        objectForm.value='';
        }
     fetch('/api/object',{
        method:"POST",
        body:formData
    }).then(result=>result.json()).then(json=>console.log(json)); 

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




