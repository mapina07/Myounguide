const express= require('express');
const jwt= require('jsonwebtoken');
const path=require('path');
const bodyParser = require('body-parser');
var express_graphql = require('express-graphql');
const graphqlSquema=require('./src/graphql/schema');
const { graphqlUploadExpress }=require('graphql-upload'); 
const { mongoose } = require('./src/database');
const nodemailer = require("nodemailer");
const User = require('./src/models/user');
const Category = require('./src/models/nomencladores/category');
const cors = require('cors');

const puerto=3000;
const server="http://localhost:"+puerto;

const app=express();
app.use(express.static(path.join(__dirname,'src/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// allow cross-origin requests
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  
app.use('/graphql',graphqlUploadExpress({ uploadDir: "./src/uploads",maxFileSize: 10000000, maxFiles: 10 }), express_graphql({
    schema: graphqlSquema,
    graphiql: true
}));

async function sendMail(itemusuario,usuario,descripcion,transporter){
    let mailOptions = {
        from: 'myounguide@gmail.com', // sender address
        to: "myounguide@gmail.com,"+itemusuario.email, // list of receivers
        subject: "Tarea eliminada", // Subject line
        text: 'Tarea eliminada por el administrador '+usuario+" por los siguientes motivos: "+descripcion, // plain text body
        html: "<b>Tarea eliminada por el administrador "+usuario+" por los siguientes motivos: "+descripcion+"</b>" // html body
    };

    let info =await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function enviarCorreo(usuario,idtarea,descripcion){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'myounguide@gmail.com',
            pass: 'M123456789*'
        }
    });

    User.find({rol:"Usuario"},(err,encontrados)=>{
        if(err)
            console.log(err);
        else{
            encontrados.map(itemusuario=>{
                itemusuario.tasks.map(itemtask=>{
                    if(itemtask===idtarea){
                        sendMail(itemusuario,usuario,descripcion,transporter).catch(console.error);
                    }
                });
            });
        }
    });
}

//Método para enviar un correo al eliminar una tarea por el administrador.
app.post('/api/enviarCorreo',verifyToken,async (req,res)=>{
    jwt.verify(req.token,'secretkey',(err)=>{
        if(err){
            res.sendStatus(403);
        }else{
            const { usuario,idtarea,descripcion } = req.body;
            enviarCorreo(usuario,idtarea,descripcion).catch(console.error);
            res.json({
                respuesta:'ok'
            });
        }
    });
});

//Method to authenticate a user.
app.post('/api/login',async (req,res)=>{
    const { username,password } = req.body;
    const usuarios=await User.find({email:username},(err,prevuser)=>{
        if(err){
            res.json({
                message:"Error del servidor."
            });
        }
        else{
            if(prevuser.length>0){
                if(password===prevuser[0].password){
                    jwt.sign({username},'secretkey',(err,token)=>{
                        res.json({
                            token:token,
                            nombre:prevuser[0].nombre,
                            rol:prevuser[0].rol,
                            usuario:prevuser[0].email
                        });
                    });
                }
                else{
                    res.json({
                        message:"Usuario o contraseña incorrectos."
                    });
                }
            }
            else{
                res.json({
                    message:"Usuario o contraseña incorrectos."
                });
            }
        }
    });
});

//Method to authenticate a user with Facebook.
app.post('/api/loginFacebook',async (req,res)=>{
    const { response } = req.body;
    if(response.email){
        const email=response.email;
        await User.find({email:email},(err,prevuser)=>{
            if(err){
                res.json({
                    message:"Error del servidor."
                });
            }
            else{
                if(prevuser.length>0){
                    jwt.sign({email},'secretkey',(err,token)=>{
                        res.json({
                            token:token,
                            nombre:prevuser[0].nombre,
                            rol:prevuser[0].rol,
                            usuario:prevuser[0].email
                        });
                    });
                }
                else{
                    const nombre=response.name;
                    const password='';
                    const rol='Usuario';
                    const useradd= new User({ nombre,password,email,rol});
                    useradd.save((err)=>{
                        if(err){
                            res.json({
                                message:"Error del servidor."
                            });
                        }
                        else{
                            jwt.sign({email},'secretkey',(err,token)=>{
                                res.json({
                                    token:token,
                                    nombre:nombre,
                                    rol:rol,
                                    usuario:email
                                });
                            });
                        }
                    });
                }
            }
        });
    }
    else if(response.name){
        const email=response.name;
        await User.find({email:email},(err,prevuser)=>{
            if(err){
                res.json({
                    message:"Error del servidor."
                });
            }
            else{
                if(prevuser.length>0){
                    jwt.sign({email},'secretkey',(err,token)=>{
                        res.json({
                            token:token,
                            nombre:prevuser[0].nombre,
                            rol:prevuser[0].rol,
                            usuario:prevuser[0].email
                        });
                    });
                }
                else{
                    const nombre=response.name;
                    const password=response.id;
                    const rol='Usuario';
                    const useradd= new User({ nombre,password,email,rol});
                    useradd.save((err)=>{
                        if(err){
                            res.json({
                                message:"Error del servidor."
                            });
                        }
                        else{
                            jwt.sign({email},'secretkey',(err,token)=>{
                                res.json({
                                    token:token,
                                    nombre:nombre,
                                    rol:rol,
                                    usuario:email
                                });
                            });
                        }
                    });
                }
            }
        });
    }
    else{
        res.json({
            message:"Usuario o contraseña incorrectos."
        });
    }
});

//Method to register a user.
app.post('/api/registeruser',async (req,res)=>{
    const { name,password,email } = req.body;
    const rol="Usuario";
    const nombre=name;
    const user=User.find({email:email},(err,prevuser)=>{
        if(prevuser.length>0){
            res.json({
                message:"La cuenta ya existe."
            });
        }
        else{
            const useradd= new User({ nombre,password,email,rol});
            useradd.save((err)=>{
                if(err){
                    res.json({
                        message:"Error del servidor."
                    });
                }
                else{
                    jwt.sign({email},'secretkey',(err,token)=>{
                        res.json({
                            token:token,
                            nombre:nombre,
                            rol:rol,
                            usuario:email
                        });
                    });
                }
            });
        }
    });
});

//Method to register a user facilitador.
app.post('/api/registeruserfac',async (req,res)=>{
    const { name,password,email,listcategory } = req.body;
    const rol="Facilitador";
    const nombre=name;
    const categories=listcategory;
    const user=User.find({email:email},(err,prevuser)=>{
        if(prevuser.length>0){
            res.json({
                message:"La cuenta ya existe."
            });
        }
        else{
            const useradd= new User({ nombre,password,email,rol,categories});
            useradd.save((err)=>{
                console.log(err);
                if(err){
                    res.json({
                        message:"Error del servidor."
                    });
                }
                else{
                    jwt.sign({email},'secretkey',(err,token)=>{
                        res.json({
                            token:token,
                            nombre:nombre,
                            rol:rol,
                            usuario:email
                        });
                    });
                }
            });
        }
    });
});

//Método para descargar los ficheros adjuntos de las tareas.
app.get('/donwload/:name',function(req,res){
    res.download(__dirname+'/src/uploads/'+req.params.name,req.params.name,function(err){
        if(err)
            console.log(err);
    })
});

//Método para obtener el id de una categoría dada su denominacion.
app.get('/api/getCategoryBusq/:value',function(req,res){
    const denominacion=req.params.value;
    Category.findOne({denominacion:denominacion},(err,enc)=>{
        if(err)
            console.log(err);
        else{
            if(enc){
                res.json({
                    category:enc._id
                });
            }
        }
    });
});

//Método para obtener la denominacion de una categoría dado su id.
app.get('/api/getCategoryDenom/:value',function(req,res){
    const id=req.params.value;
    Category.findOne({_id:id},(err,enc)=>{
        if(err)
            console.log(err);
        else{
            if(enc){
                res.json({
                    category:enc.denominacion
                });
            }
        }
    });
});

//Método para obtener la direccion del servidor.
app.get('/api/getServer',verifyToken,async (req,res)=>{
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                server:server
            });
        }
    });
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/public/index.html'));
})

//Método para verificar el token de seguridad.
function verifyToken(req,res,next){
    const bearerHeader=req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        req.token=bearerHeader;
        next();
    }else{
        res.sendStatus(403);
    }
}

app.listen(puerto,()=>{
    console.log('server on port '+puerto);
}); 