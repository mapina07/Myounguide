import { gql } from 'apollo-boost';

const addTaskMutation = gql`
    mutation AddTask($denominacion: String!,$descripcion:String!,$categoria:String!,$adjuntos:[String],$usuario:String!){
        addTask(denominacion: $denominacion,descripcion:$descripcion,categoria:$categoria,adjuntos:$adjuntos,usuario:$usuario){
            id
            denominacion
            descripcion
            category
            adjuntos
        }
    }
`;

const rechazarTaskMutation = gql`
    mutation RechazarTask($id: String!,$usuario:String!,$categoria:String!){
        rechazarTask(id: $id,usuario:$usuario,categoria:$categoria)
    }
`;

const modTaskMutation = gql`
    mutation ModTask($denominacion: String!,$descripcion:String!,$id:String!,$estado:String!,$adjuntos:[String]){
        modTask(denominacion: $denominacion,descripcion:$descripcion,id:$id,estado:$estado,adjuntos:$adjuntos){
            id
            denominacion
            descripcion
            category
            adjuntos
        }
    }
`;

const califTaskMutation = gql`
    mutation CalifTask($calificacion: Int!,$id:String!){
        califTask(calificacion: $calificacion,id:$id){
            id
            denominacion
            descripcion
            category
            adjuntos
        }
    }
`;

const getTasksQuery = gql`
    query GetTasks($usuario: String!){
        tasks(usuario: $usuario) {
            id
            denominacion
            descripcion
            category
            estado
            calificacion
            adjuntos
            fechaHora
        }
    }
`;

const changeStateTaskMutation = gql`
    mutation ChangeStateTask($idtask: String!,$estado:String!){
        changeStateTask(idtask: $idtask,estado:$estado){
            id
            denominacion
            descripcion
            category
            adjuntos
        }
    }
`;

const getTaskQuery = gql`
    query GetTask($id: ID!){
        task(id: $id) {
            id
            denominacion
            descripcion
            category
            estado
            calificacion
            adjuntos
        }
    }
`;

const getAllTasksQuery = gql`
    {
        alltasks {
            id
            denominacion
            descripcion
            category
            estado
            calificacion
            adjuntos
            fechaHora
        }
    }
`;

const deleteTaskMutation = gql`
    mutation DeleteTask($id: String!){
        deleteTask(id: $id){
            id
            denominacion
            descripcion
            category
            adjuntos
        }
    }
`;

const deleteAdjuntoMutation = gql`
    mutation DeleteAdjunto($id: String!,$adjunto:String!){
        deleteAdjunto(id: $id,adjunto:$adjunto){
            id
        }
    }
`;

const deleteInitAdjuntoMutation = gql`
    mutation DeleteInitAdjunto($adjunto:String!){
        deleteAdjunto(adjunto:$adjunto){
            id
        }
    }
`;

export { addTaskMutation,getTasksQuery,changeStateTaskMutation,getTaskQuery,getAllTasksQuery,deleteTaskMutation,modTaskMutation,deleteAdjuntoMutation,deleteInitAdjuntoMutation,rechazarTaskMutation,califTaskMutation };
