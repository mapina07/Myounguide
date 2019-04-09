const graphql = require('graphql');
const Task=require('../models/operaciones/task');
const User=require('../models/user');
var mongoose= require('mongoose');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean
} = graphql;

const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: ( ) => ({
        id: { type: GraphQLID },
        denominacion: { type: GraphQLString },
        descripcion: { type: GraphQLString },
        category: { type: GraphQLString },
        estado:{ type: GraphQLString },
        calificacion:{ type: GraphQLInt },
        adjuntos:{ type: new graphql.GraphQLList(graphql.GraphQLString)},
        fechaHora: { type: GraphQLString }
    })
});

const tasks={
    type: new GraphQLList(TaskType),
    args: { usuario: { type: GraphQLString } },
    resolve(parent, args){
        let user=User.findOne({email:args.usuario},(err,prevuser)=>{
            if(err){
                console.log(err);
            }
        });
        return user.then(function (doc) {
            let arrTasknormal=doc.tasks;
            let arrTask=arrTasknormal.reverse();
            let arrresponse=[];
            arrTask.map(idtask=>{
                const id=mongoose.Types.ObjectId(idtask);
                arrresponse.push(Task.findById(id))
            });
            return arrresponse;
        });
    }
};

const alltasks={
    type: new GraphQLList(TaskType),
    resolve(parent, args){
        return Task.find({});
    }
};

function estaCategoria(arrCategories,categoria){
    let encontrado=false;
    arrCategories.map(cat=>{
        if(String(cat)===categoria)
            encontrado=true;
    });
    return encontrado;
}

const addTask={
    type: TaskType,
    args: {
        denominacion: { type: GraphQLString },
        descripcion: { type: GraphQLString },
        categoria: { type: GraphQLString },
        adjuntos:{ type: new graphql.GraphQLList(graphql.GraphQLString)},
        usuario:{ type: GraphQLString }
    },
    resolve(parent, args){
        const denominacion=args.denominacion;
        const descripcion=args.descripcion;
        const category=args.categoria;
        const estado="Asignada";
        const adjuntos=args.adjuntos;
        const usuario=args.usuario;
        const fechaHora=new Date();
        const taskadd= new Task({ denominacion,descripcion,category,estado,adjuntos,fechaHora });
        taskadd.save();
        //buscar usuario y asignarle la tarea
        let user=User.findOne({email:usuario},(err)=>{
            if(err){
                console.log(err);
            }
        });
        user.then(function (doc) {
            let arrTask=doc.tasks;
            arrTask.push(taskadd._id);
            doc.update({tasks:arrTask},(err)=>{
                if(err)
                    console.log(err);
            });
        });
        let users=User.find({rol:'Facilitador'},(err)=>{
            if(err)
                console.log(err);
        });
        users.then(function(docs){
            let comparacion=[0,""]
            if(docs.length>0){
                docs.map(usuario=>{
                    let isCategory=estaCategoria(usuario.categories,String(category));
                    if(comparacion[0]==0){
                        if(isCategory){
                            comparacion[0]=usuario.tasks.length;
                            comparacion[1]=usuario;
                        }
                    }
                    else{
                        if(usuario.tasks.length<comparacion[0]){
                            if(isCategory){
                                comparacion[0]=usuario.tasks.length;
                                comparacion[1]=usuario;
                            }
                        }
                    }
                });
                if(comparacion[1]!==""){
                    let arrTask=comparacion[1].tasks;
                    arrTask.push(taskadd._id);
                    User.findOneAndUpdate({_id:comparacion[1]._id},{tasks:arrTask},(err)=>{
                        if(err)
                            console.log(err);
                    });
                }
            }
        });
        return taskadd;
    }
};

const rechazarTask={
    type: GraphQLBoolean,
    args: {
        id: { type: GraphQLString },
        usuario: { type: GraphQLString },
        categoria: { type: GraphQLString }
    },
    resolve(parent, args){
        const idtask=mongoose.Types.ObjectId(args.id);
        const usuario=args.usuario;
        const categoria=args.categoria;
        //buscar usuario y asignarle la tarea
        let user=User.findOne({email:usuario},(err)=>{
            if(err){
                console.log(err);
            }
        });
        user.then(function(doc){
            let arrTask=doc.tasks;
            for(var i=0; i< arrTask.length; i++){ 
                if(arrTask[i] === String(idtask)) {
                    arrTask.splice(i, 1); 
                }
            }
            User.findOneAndUpdate({_id:doc._id},{tasks:arrTask},(err)=>{
                if(err)
                    console.log(err);
            });
        });
        let users=User.find({rol:'Facilitador'},(err)=>{
            if(err)
                console.log(err);
        });
        users.then(function(docs){
            if(docs.length>0){
                let comparacion=[0,""];
                for(var i=0;i<docs.length;i++){
                    let isCategory=estaCategoria(docs[i].categories,String(categoria));
                    if(comparacion[0]==0){
                        if(isCategory&&(docs[i].email!==usuario)){
                            comparacion[0]=docs[i].tasks.length;
                            comparacion[1]=docs[i];
                        }
                    }
                    else{
                        if(docs[i].tasks.length<comparacion[0]){
                            if(isCategory&&(docs[i].email!==usuario)){
                                comparacion[0]=docs[i].tasks.length;
                                comparacion[1]=docs[i];
                            }
                        }
                    }
                }
                if(comparacion[1]!==""){
                    let arrTask=comparacion[1].tasks;
                    arrTask.push(idtask);
                    User.findOneAndUpdate({_id:comparacion[1]._id},{tasks:arrTask},(err)=>{
                        if(err)
                            console.log(err);
                    });
                }
            }
        });
        return true;
    }
};

const modTask={
    type: TaskType,
    args: {
        denominacion: { type: GraphQLString },
        descripcion: { type: GraphQLString },
        id:{ type: GraphQLString },
        estado:{ type: GraphQLString },
        adjuntos:{ type: new graphql.GraphQLList(graphql.GraphQLString)},
    },
    resolve(parent, args){
        const denominacion=args.denominacion;
        const descripcion=args.descripcion;
        const estado=args.estado;
        const adjuntos=args.adjuntos;
        return Task.findOneAndUpdate({_id:args.id},{
            denominacion:denominacion,
            descripcion:descripcion,
            estado:estado,
            adjuntos:adjuntos
        },{new: true})
    }
};

const califTask={
    type: TaskType,
    args: {
        calificacion: { type: GraphQLInt },
        id:{ type: GraphQLString }
    },
    resolve(parent, args){
        const calificacion=args.calificacion;
        return Task.findOneAndUpdate({_id:args.id},{
            calificacion:calificacion
        },{new: true})
    }
};

const changeStateTask={
    type: TaskType,
    args: {
        idtask: { type: GraphQLString },
        estado: { type: GraphQLString }
    },
    resolve(parent, args){
        const estado=args.estado;
        const idtask=mongoose.Types.ObjectId(args.idtask);
        return Task.findOne({_id:idtask},(err,prevtask)=>{
            if(err){
                console.log(err);
            }{
                return prevtask.update({estado:estado},(err,updated)=>{
                    if(err)
                        console.log(err);
                });
            }
        });
    }
};

const task= {
    type: TaskType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args){
        const id=mongoose.Types.ObjectId(args.id);
        return Task.findById(id);
    }
}

const deleteTask={
    type: TaskType,
    args: {
        id: { type: GraphQLString }
    },
    resolve(parent, args){
        const id=mongoose.Types.ObjectId(args.id);
        Task.findOneAndDelete({_id:id},(err,deleted)=>{
            if(err)
                console.log(err);
        });
    }
};

module.exports= {tasks,addTask,changeStateTask,task,alltasks,deleteTask,modTask,rechazarTask,califTask} ;