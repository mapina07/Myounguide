const graphql = require('graphql');
const Task=require('../models/operaciones/task');
const User=require('../models/user');
var mongoose= require('mongoose');
const Respuesta=require('../models/operaciones/respuesta');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean
} = graphql;

const RespuestaType = new GraphQLObjectType({
    name: 'Respuesta',
    fields: ( ) => ({
        id: { type: GraphQLID },
        texto: { type: GraphQLString },
        usuario: { type: GraphQLString },
        fechaHora: { type: GraphQLString },
        tarea:{ type: GraphQLString },
        adjuntos:{ type: new graphql.GraphQLList(graphql.GraphQLString)}
    })
});

const addRespuesta={
    type: RespuestaType,
    args: {
        texto: { type: GraphQLString },
        usuario: { type: GraphQLString },
        tarea: { type: GraphQLString },
        adjuntos:{ type: new graphql.GraphQLList(graphql.GraphQLString)},
    },
    resolve(parent, args){
        const texto=args.texto;
        const usuario=args.usuario;
        const tarea=args.tarea;
        const adjuntos=args.adjuntos;
        const fechaHora=new Date();
        const respuestaadd= new Respuesta({ texto,usuario,tarea,fechaHora,adjuntos });
        return respuestaadd.save((err)=>{
            if(err)
                console.log(err);
        });
    }
};

const respuestas={
    type: new GraphQLList(RespuestaType),
    args: { idtarea: { type: GraphQLString } },
    resolve(parent, args){
        return Respuesta.find({tarea:args.idtarea},(err,respuestas)=>{
            if(err){
                console.log(err);
            }
            else{
                return respuestas;
            }
        });
    }
};

module.exports= {addRespuesta,respuestas} ;