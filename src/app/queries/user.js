import { gql } from 'apollo-boost';

const getUsersQuery = gql`
    {
        users {
            id
            nombre
            email
            rol
        }
    }
`;

const getUserQuery = gql`
    query GetUser($id: ID){
        user(id: $id) {
            id
            nombre
            email
            rol
        }
    }
`;

const getFacsQuery = gql`
    {
        facilitadores {
            id
            nombre
            email
            rol
            categories
        }
    }
`;

const addUserMutation = gql`
    mutation AddUser($nombre: String!,$email:String!){
        addUser(nombre: $nombre,email:$email){
            id
            nombre
            email
        }
    }
`;

const modUserMutation = gql`
    mutation ModUser($id:ID!,$nombre: String!,$email:String!,$rol:String!){
        updateUser(id:$id,nombre: $nombre,email:$email,rol:$rol){
            id
            nombre
            email
            rol
        }
    }
`;

const changePassMutation = gql`
    mutation ChangePass($usuario:String!,$password: String!){
        changePass(usuario:$usuario,password: $password){
            id
            nombre
            email
            rol
        }
    }
`;

const deleteUserMutation = gql`
    mutation DeleteUser($id:ID!){
        deleteUser(id:$id){
            id
            nombre
            email
            rol
        }
    }
`;

export { getUsersQuery,addUserMutation,getUserQuery,modUserMutation,deleteUserMutation,getFacsQuery,changePassMutation };
