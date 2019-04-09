import React, { Component } from 'react';
import { getFacsQuery } from './queries/user';
import { graphql, compose } from 'react-apollo';
import { fallbackHttpConfig } from 'apollo-link-http-common';

class Busqueda extends Component{
    constructor(props,context){
        super(props,context);

        this.state={
            loading:false,
            catBuscada:null
        };

        this.displayFac=this.displayFac.bind(this);
    }

    componentDidMount(){
        fetch('/api/getCategoryBusq/'+this.props.match.params.value)
        .then(res=>res.json())
        .then(data=>{
            if(this.state.catBuscada===null){
                this.setState({
                    catBuscada:data.category
                })
            }
        });
    }

    displayFac(){
        var { facilitadores } = this.props.data;
        if(facilitadores){
            if(facilitadores.length==0){
                return(
                    <p className="text-muted" style={{marginLeft:'2%',fontSize:'16px'}}>No hay facilitadores con ese tipo de categorías.</p>
                )
            }
            let vacio=true;
            return facilitadores.map(fac => {
                return fac.categories.map(idcategory=>{
                    if(idcategory===this.state.catBuscada){
                        vacio=false;
                        return(
                            <div className="box-body" key={fac.id}>
                                <div className="item">
                                    <p className="message">
                                    {fac.nombre}
                                    </p>
                                </div>
                                <div className="attachment">
                                    <h4>Usuario:</h4>
                                    <p className="filename">
                                        {fac.email}
                                    </p>
                                </div>
                            </div>
                        )
                    }
                })
            });
        }
        else{
            return(
                <p className="text-muted" style={{marginLeft:'2%',fontSize:'16px'}}>Cargando...</p>
            )
        }
    }

    render(){
        const containerStyle={
            height: '585px'
        }

        return(
            <div className="container" style={containerStyle}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="box box-default" style={{maxHeight:'475px',overflowY: 'scroll'}}>
                            {this.displayFac()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default compose(
    graphql(getFacsQuery)
)(Busqueda);