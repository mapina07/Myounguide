import React, { Component } from 'react';

class AboutUs extends Component{
    render(){
        return(
            <div className="content-wrapper" style={{height:'100%'}}>
                <div className="container">
                    <section className="content">
                        <div className="row">
                            <div className="col-md-10">
                                <div className="box box-solid">
                                    <div className="box-header with-border">
                                        <i className="fa fa-text-width"></i>
                                        <h3 className="box-title">Sobre Nosotros</h3>
                                    </div>
                                    <div className="box-body">
                                        <dl>
                                            <dt>MyOunGuide </dt>
                                            <dd>Te ayudara a conectar con personas que te van a guiar en el proceso de aprendizaje, 
                                            genera recursos economicos ayudando a otras personas, contribuye a la sociedad con tus conocimientos
                                            unete..</dd>
                                            <br></br>
                                            <dd>Podras acceder desde cualquier dispositivo como telefonos moviles, desktop, tablets.</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}

export default AboutUs;