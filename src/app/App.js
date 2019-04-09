import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import CustomLayout from './Layout';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

class App extends Component{
    componentDidMount(){
        const inicio=localStorage.getItem('inicio');
        if(inicio===null){
            localStorage.setItem('inicio',true);
        }
        this.props.onTryAutoSingup();
    }

    render(){
        return(
            <Router>
                <CustomLayout {...this.props}>
                </CustomLayout>
            </Router>
        )
    }
}

const mapDispatchToProps=dispatch=>{
    return{
        onTryAutoSingup:()=>dispatch(actions.authCheckState())
    }
}

export default connect(null,mapDispatchToProps)(App);