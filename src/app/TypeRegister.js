import React, { Component } from 'react';
import { withRouter,Link } from 'react-router-dom';

class TypeRegister extends Component{
    //Para cambiar el contenido principal
    componentWillMount(){
        localStorage.setItem('main',false);
    }

    render(){
        const rowStyle={
            marginLeft:'3%'
        }

        const imageStyle={
            backgroundImage:"url('img/office-1.jpeg')"
        }

        return(
            <section>
                <div className="section section-small section-get-started">
                    <div className="parallax filter">
                        <div className="image" style={imageStyle}></div>
                        <div className="container">
                            <div className="title-area">
                                <h2 className="text-white">Escoja su tipo de usuario</h2>
                            </div>
                            <div className="button-get-started">
                                <Link to="/register" className="btn btn-success btn-fill btn-lg"><label className="control-label"><i className="fa fa-user"></i> Usuario</label></Link>
                                <Link to="/registerfac" className="btn btn-success btn-fill btn-lg" style={rowStyle}><label className="control-label"><i className="fa fa-info-circle"></i> Facilitador</label></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default withRouter(TypeRegister);