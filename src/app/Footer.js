import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Footer extends Component{
    render(){
        const footerStyle={
            backgroundColor:'#244561'
        }

        const h3Style={
            color:'#a7b4c0'
        }

        const socialStyle={
            marginRight:'4%'
        }

        const colStyle={
            marginTop:'1%'
        }

        const row2Style={
            backgroundColor:'#112d44',
            height:'50px'
        }

        const footerend={
            color:'#a7b4c0',
            marginLeft:'7%'
        }

        return(
            <div>
                <footer className="main-footer" style={footerStyle}>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">
                                <h3 style={h3Style}>MyOunGuide</h3>
                                <div className="text-left">
                                    <a href="https://facebook.com" className="btn btn-social-icon btn-facebook" style={socialStyle}><i className="fa fa-facebook"></i></a>
                                    <a href="https://twiter.com" className="btn btn-social-icon btn-twitter" style={socialStyle}><i className="fa fa-twitter"></i></a>
                                    <a href="https://likedin.com" className="btn btn-social-icon btn-linkedin"><i className="fa fa-linkedin"></i></a>
                                </div>
                            </div>
                            <div className="col-md-2" style={colStyle}>
                                <h4 style={h3Style}>Empresa</h4>
                                <h5 style={h3Style}><Link to="/aboutus">Sobre Nosotros</Link></h5>
                                
                            </div>
                            <div className="col-md-3" style={colStyle}>
                                <h4 style={h3Style}>Atención al cliente</h4>
                                <h5 style={h3Style}><Link to="/term">Términos y Condiciones</Link></h5>
                                <h5 style={h3Style}>Información Legal</h5>
                                <h5 style={h3Style}>Precios</h5>
                            </div>
                        </div>
                    </div>
                </footer>
                <div className="row" style={row2Style}>
                    <div className="col-md-12">
                        <p style={footerend}><strong>&copy; 2019 myounguide.</strong> All rights
                        reserved.</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer;