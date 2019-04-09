import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState={
    token:null,
    error:null,
    loading:false,
    errorRegister:null
}

const authStart=(state,action)=>{
    return updateObject(state,{
        error:null,
        loading:true,
        errorRegister:null
    });
}

const authSuccess=(state,action)=>{
    return updateObject(state,{
        token:action.token,
        error:null,
        loading:false,
        errorRegister:null
    });
}

const authFail=(state,action)=>{
    return updateObject(state,{
        error:action.error,
        loading:false,
        main:false
    });
}

const authFailRegister=(state,action)=>{
    return updateObject(state,{
        errorRegister:action.errorRegister,
        loading:false,
        main:false
    });
}

const authLogout=(state,action)=>{
    return updateObject(state,{
        token:null
    });
}

const reducer=(state=initialState,action)=>{
    switch(action.type){
        case actionTypes.AUTH_START: return authStart(state,action);
        case actionTypes.AUTH_SUCCES: return authSuccess(state,action);
        case actionTypes.AUTH_FAIL: return authFail(state,action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state,action);
        case actionTypes.AUTH_FAIL_REGISTER: return authFailRegister(state,action);
        default:
            return state;
    }
}

export default reducer;