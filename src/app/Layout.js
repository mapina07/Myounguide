import React, { Component } from 'react';
import { withRouter,Redirect } from 'react-router-dom';
import * as actions from '../store/actions/auth';
import ApolloClient from 'apollo-client';
const { InMemoryCache } = require('apollo-cache-inmemory')
import { ApolloProvider } from 'react-apollo';
import HeaderBar from './adminlte/HeaderBar';
import { connect } from 'react-redux';
import { createUploadLink } from 'apollo-upload-client';
import Footer from './Footer';
import BaseRouter from './routes';
import Main from './Main';

class CustomLayout extends Component{
    render(){
        /* const server="https://myounguide.cloudno.de"; */
        const server="http://localhost:3000";
        
        // apollo client setup
        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link: createUploadLink({uri:server+"/graphql"})
        })

        const path=window.location.pathname;
        let isMain=false;
        let usuario=false;
        let facilitador=false;
        let administrador=false;
        if(path==="/"){
            if(localStorage.getItem('rol')){
                if(localStorage.getItem('rol')==='Usuario'){
                    usuario=true;
                }
                else if(localStorage.getItem('rol')==='Facilitador'){
                    facilitador=true;
                }
                else
                    administrador=true;
            }
            else
                isMain=true;
        }
    
        return(
            <ApolloProvider client={client}>
                <HeaderBar {...this.props}/>
                <BaseRouter server={server} history={this.props.history}/>
                {
                    this.props.errorRegister ?
                    <Redirect to="/register"/>
                    :
                    <></>
                }
                {
                    this.props.error ?
                    <Redirect to="/login"/>
                    :
                    <></>
                }
                {
                    usuario ?
                    <Redirect to="/usermain"/>
                    :
                    <></>
                }
                {
                    facilitador ?
                    <Redirect to="/facmain"/>
                    :
                    <></>
                }
                {
                    administrador ?
                    <Redirect to="/adminmain"/>
                    :
                    <></>
                }
                {
                    isMain ?
                    <Main {...this.props}/>
                    :
                    <></>
                }
                <Footer/>
            </ApolloProvider>
        );
    }
}

const mapDispatchToProps=dispatch=>{
    return{
        changeMain:(value)=>dispatch(actions.changeMain(value))
    }
}

const mapStateToProps=state=>{
    return{
        state:state,
        loading: state.loading,
        error:state.error,
        errorRegister:state.errorRegister,
        isAuthenticated: state.token != null
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(CustomLayout));