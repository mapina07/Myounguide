import { gql } from 'apollo-boost';

const addRespuestaMutation = gql`
    mutation AddRespuesta($texto: String!,$usuario:String!,$tarea:String!,$adjuntos:[String]){
        addRespuesta(texto: $texto,usuario:$usuario,tarea:$tarea,adjuntos:$adjuntos){
            id
            texto
            usuario
            tarea
            adjuntos
        }
    }
`;

const getRespuestasQuery = gql`
    query GetRespuestas($idtarea: String!){
        respuestas(idtarea: $idtarea) {
            id
            texto
            usuario
            fechaHora
            tarea
            adjuntos
        }
    }
`;

export { addRespuestaMutation,getRespuestasQuery };
