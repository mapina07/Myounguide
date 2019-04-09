import * as actionTypes from './actionTypes';
import axios from 'axios';

/* const server="https://myounguide.cloudno.de"; */
const server="http://localhost:3000";


export const authStart=()=>{
    return{
        type:actionTypes.AUTH_START
    }
}

export const authSuccess=token=>{
    return{
        type:actionTypes.AUTH_SUCCES,
        token:token
    }
}

export const authFail=error=>{
    return{
        type:actionTypes.AUTH_FAIL,
        error:error
    }
}

export const authFailRegister=error=>{
    return{
        type:actionTypes.AUTH_FAIL_REGISTER,
        errorRegister:error
    }
}

export const logout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');
    return{
        type:actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout=expirationTime=>{
    return dispatch=>{
        setTimeout(()=>{
            dispatch(logout());
        },expirationTime*1000)
    }
}

//Method to authenticate a user.
export const authLogin=(username,password)=>{
    return dispatch=> {
        dispatch(authStart());
        axios.post(server+'/api/login',{
            username:username,
            password:password
        })
        .then(res=>{
            if(res.data.message){
                dispatch(authFail(res.data.message));
            }
            else{
                const token=res.data.token;
                const nombre=res.data.nombre;
                const rol=res.data.rol;
                const usuario=res.data.usuario;
                const expirationDate=new Date(new Date().getTime()+3600*1000);
                localStorage.setItem('token',token);
                localStorage.setItem('expirationDate',expirationDate);
                localStorage.setItem('nombre',nombre);
                localStorage.setItem('rol',rol);
                localStorage.setItem('usuario',usuario);
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout(3600));
            }
        })
        .catch(err=>{
            dispatch(authFail(err));
        });
    }
}

//Method to authenticate a user with facebook.
export const authLoginFacebook=(response)=>{
    return dispatch=>{
        dispatch(authStart());
        axios.post(server+'/api/loginFacebook',{
            response:response
        })
        .then(res=>{
            if(res.data.message){
                dispatch(authFail(res.data.message));
            }
            else{
                const token=res.data.token;
                const nombre=res.data.nombre;
                const rol=res.data.rol;
                const usuario=res.data.usuario;
                const expirationDate=new Date(new Date().getTime()+3600*1000);
                localStorage.setItem('token',token);
                localStorage.setItem('expirationDate',expirationDate);
                localStorage.setItem('nombre',nombre);
                localStorage.setItem('rol',rol);
                localStorage.setItem('usuario',usuario);
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout(3600));
            }
        })
        .catch(err=>{
            dispatch(authFail(err));
        });
    }
}

//Method to register a user.
export const authRegister=(email,password,name)=>{
    return dispatch=> {
        dispatch(authStart());
        axios.post(server+'/api/registeruser',{
            email:email,
            password:password,
            name:name
        })
        .then(res=>{
            if(res.data.message){
                dispatch(authFailRegister(res.data.message));
            }
            else{
                const token=res.data.token;
                const expirationDate=new Date(new Date().getTime()+3600*1000);
                const nombre=res.data.nombre;
                const rol=res.data.rol;
                const usuario=res.data.usuario;
                localStorage.setItem('token',token);
                localStorage.setItem('expirationDate',expirationDate);
                localStorage.setItem('nombre',nombre);
                localStorage.setItem('rol',rol);
                localStorage.setItem('usuario',usuario);
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout(3600));
            }
        })
        .catch(err=>{
            dispatch(authFailRegister(err));
        });
    }
}

//Method to register a user facilitador.
export const authRegisterFac=(email,password,name,listcategory)=>{
    return dispatch=> {
        dispatch(authStart());
        axios.post(server+'/api/registeruserfac',{
            email:email,
            password:password,
            name:name,
            listcategory:listcategory
        })
        .then(res=>{
            if(res.data.message){
                dispatch(authFailRegister(res.data.message));
            }
            else{
                const token=res.data.token;
                const expirationDate=new Date(new Date().getTime()+3600*1000);
                const nombre=res.data.nombre;
                const rol=res.data.rol;
                const usuario=res.data.usuario;
                localStorage.setItem('token',token);
                localStorage.setItem('expirationDate',expirationDate);
                localStorage.setItem('nombre',nombre);
                localStorage.setItem('rol',rol);
                localStorage.setItem('usuario',usuario);
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout(3600));
            }
        })
        .catch(err=>{
            dispatch(authFailRegister(err));
        });
    }
}

export const authCheckState=()=>{
    return dispatch=>{
        const token=localStorage.getItem('token');
        if(token === undefined){
            dispatch(logout());
        }
        else{
            const expirationDate=localStorage.getItem('expirationDate')
            if(expirationDate <= new Date()){
                dispatch(logout());
            }
            else{
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout((new Date(expirationDate).getTime()-new Date().getTime())/1000 ))
            }
        }
    }
}