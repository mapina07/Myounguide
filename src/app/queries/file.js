const gql = require('graphql-tag');

const uploadFileMutation = gql`
    mutation UploadFile($file: Upload!){
        singleUpload(file: $file){
            id
        }
    }
`;

export { uploadFileMutation };
