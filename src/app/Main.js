import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter,Link } from 'react-router-dom';

class Main extends Component{
    constructor(props,context){
        super(props,context);

        this.state = {
            show: false
        };

        this.register=this.register.bind(this);
    }

    register(e){
        e.preventDefault();
        this.props.history.push('/typeregister');
    }

    render(){
        const imageStyle={
            backgroundImage:"url('img/office-1.jpeg')"
        }

        const token=localStorage.getItem('token');
        let showRegister;
        if(token==null)
            showRegister=false;
        else
            showRegister=true;

        return(
            <div className="section section-get-started" style={{height:'100%'}}>
                <div className="parallax filter">
                    <div className="image" style={imageStyle}></div>
                    <div className="container">
                        <div className="title-area">
                            <h2 className="text-white">Encuentra un experto para realizar tu proyecto.</h2>
                            <p className="description">Describe lo que necesitas y recibirás respuesta de expertos al momento.</p>
                        </div>
                        <div className="button-get-started">
                            {
                                showRegister ?
                                <div></div>
                                :
                                <a href="#" className="btn btn-success btn-fill btn-lg" onClick={this.register}>Registro</a>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(connect()(Main));