const graphql = require('graphql');
const Category = require('../models/nomencladores/category');
const User=require('../models/user');
const Task=require('../models/operaciones/task');
var mongoose= require('mongoose');
const { GraphQLUpload }=require('graphql-upload');
var fs = require('file-system');
const { tasks,addTask,changeStateTask,task,alltasks,deleteTask,modTask,rechazarTask,califTask }=require('./task');
const { addRespuesta,respuestas } =require('./respuesta');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean
} = graphql;

const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: ( ) => ({
        id: { type: GraphQLID },
        denominacion: { type: GraphQLString }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: ( ) => ({
        id: { type: GraphQLID },
        nombre: { type: GraphQLString },
        email: { type: GraphQLString },
        rol: { type: GraphQLString },
        password:{ type: GraphQLString },
        categories:{ type: new graphql.GraphQLList(graphql.GraphQLString)}
    })
});

const FileType = new GraphQLObjectType({
    name: 'File',
    fields: ( ) => ({
        id: { type: GraphQLID },
        path: { type: GraphQLString },
        filename: { type: GraphQLString }
    })
});

const UPLOAD_DIR = './src/uploads';

// Ensure upload directory exists.
fs.mkdirSync(UPLOAD_DIR);

const storeFS = ({ stream, filename }) => {
    const path = `${UPLOAD_DIR}/${filename}`;
    return new Promise((resolve, reject) =>
        stream
        .on('error', error => {
            if (stream.truncated)
            // Delete the truncated file.
            fs.unlinkSync(path)
            reject(error)
        })
        .pipe(fs.createWriteStream(path))
        .on('error', error => reject(error))
    )
}

const processUpload = async upload => {
    const { createReadStream, filename, mimetype } = await upload
    const stream = createReadStream()
    const { id, path } = await storeFS({ stream, filename })
}

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        category: {
            type: CategoryType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                const id=mongoose.Types.ObjectId(args.id);
                return Category.findById(id);
            }
        },
        categories: {
            type: new GraphQLList(CategoryType),
            resolve(parent, args){
                return Category.find({});
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return User.find({});
            }
        },
        facilitadores: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return User.find({rol:'Facilitador'},(err,encontrados)=>{
                    if(err)
                        console.log(err);
                });
            }
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                const id=mongoose.Types.ObjectId(args.id);
                return User.findById(id);
            }
        },
        tasks:tasks,
        task:task,
        respuestas:respuestas,
        alltasks:alltasks
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCategory: {
            type: CategoryType,
            args: {
                denominacion: { type: GraphQLString }
            },
            resolve(parent, args){
                const denominacion=args.denominacion;
                const categoryadd= new Category({ denominacion });
                return categoryadd.save();
            }
        },
        updateCategory: {
            type: CategoryType,
            args: {
                denominacion: { type: GraphQLString },
                id: { type: GraphQLID }
            },
            resolve(parent, args){
                const denominacion=args.denominacion;
                const id=mongoose.Types.ObjectId(args.id);
                return Category.findOneAndUpdate({_id:id},{
                    denominacion:denominacion
                },{new: true});
            }
        },
        deleteCategory: {
            type: CategoryType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args){
                const id=mongoose.Types.ObjectId(args.id);
                return Category.findByIdAndRemove(id);
            }
        },
        addUser: {
            type: UserType,
            args: {
                nombre: { type: GraphQLString },
                email: { type: GraphQLString }
            },
            resolve(parent, args){
                const nombre=args.nombre;
                const email=args.email;
                const rol='Administrador';
                const password=email;
                const useradd= new User({ nombre,email,rol,password });
                return useradd.save();
            }
        },
        updateUser: {
            type: UserType,
            args: {
                nombre: { type: GraphQLString },
                id: { type: GraphQLID },
                email:{ type: GraphQLString },
                rol:{ type: GraphQLString }
            },
            resolve(parent, args){
                const nombre=args.nombre;
                const id=mongoose.Types.ObjectId(args.id);
                const email=args.email;
                const rol=args.rol;
                return User.findOneAndUpdate({_id:id},{
                    nombre:nombre,
                    email:email,
                    rol:rol
                },{new: true});
            }
        },
        changePass: {
            type: UserType,
            args: {
                password: { type: GraphQLString },
                usuario: { type: GraphQLString }
            },
            resolve(parent, args){
                const password=args.password;
                const usuario=args.usuario;
                return User.findOneAndUpdate({email:usuario},{
                    password:password
                },{new: true});
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args){
                const id=mongoose.Types.ObjectId(args.id);
                return User.findOneAndDelete({_id:id});
            }
        },
        addTask: addTask,
        singleUpload: {
            type: FileType,
            args: {
                file:{type:GraphQLUpload}
            },
            resolve(parent, args){
                processUpload(args.file);
                return true;
            }
        },
        deleteAdjunto:{
            type: FileType,
            args: {
                adjunto: { type: GraphQLString },
                id: { type: GraphQLString }
            },
            resolve(parent, args){
                const adjunto=args.adjunto;
                const path = `${UPLOAD_DIR}/${adjunto}`;
                const id=mongoose.Types.ObjectId(args.id);
                fs.unlink(path, (err) => {
                    if (err)
                        console.log(err);
                    else{
                        return Task.findOne({_id:id},(err,encontrado)=>{
                            if(err)
                                console.log(err)
                            else{
                                if(encontrado){
                                    let arrAdjuntos=encontrado.adjuntos;
                                    for(var i=0; i< arrAdjuntos.length; i++){ 
                                        if (arrAdjuntos[i] === adjunto) {
                                            arrAdjuntos.splice(i, 1); 
                                        }
                                    }
                                    Task.findOneAndUpdate({_id:encontrado._id},
                                        {adjuntos:arrAdjuntos},
                                    {new: true},(err)=>{
                                        if(err)
                                            console.log(err);
                                        else
                                            return true;
                                    });
                                }
                            }
                        });
                    }
                });
            }
        },
        deleteInitAdjunto:{
            type: FileType,
            args: {
                adjunto: { type: GraphQLString }
            },
            resolve(parent, args){
                const adjunto=args.adjunto;
                const path = `${UPLOAD_DIR}/${adjunto}`;
                fs.unlink(path, (err) => {
                    if (err)
                        console.log(err);
                });
            }
        },
        changeStateTask:changeStateTask,
        addRespuesta:addRespuesta,
        deleteTask:deleteTask,
        modTask:modTask,
        rechazarTask:rechazarTask,
        califTask:califTask
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});