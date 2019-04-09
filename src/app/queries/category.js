import { gql } from 'apollo-boost';

const addCategoryMutation = gql`
    mutation AddCategory($denominacion: String!){
        addCategory(denominacion: $denominacion){
            id
            denominacion
        }
    }
`;

const getCategoriesQuery = gql`
    {
        categories {
            id
            denominacion
        }
    }
`;

const getCategoryQuery = gql`
    query GetCategory($id: ID){
        category(id: $id) {
            id
            denominacion
        }
    }
`;

const updateCategoryMutation = gql`
    mutation UpdateCategory($denominacion: String!,$id:ID!){
        updateCategory(denominacion: $denominacion,id:$id){
            id
            denominacion
        }
    }
`;

const deleteCategoryMutation = gql`
    mutation DeleteCategory($id:ID!){
        deleteCategory(id:$id){
            id
            denominacion
        }
    }
`;

export { addCategoryMutation,getCategoriesQuery,getCategoryQuery,updateCategoryMutation,deleteCategoryMutation };
