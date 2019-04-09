import React, { Component } from 'react';
import { getRespuestasQuery } from '../queries/respuesta';
import { graphql, compose } from 'react-apollo';

class VerRespuestas extends Component{
    constructor(props,context){
        super(props,context);

        this.state={
            server:null
        };

        this.displayRespuestas=this.displayRespuestas.bind(this);
        this.displayRespuestas=this.displayRespuestas.bind(this);
    }

    componentDidMount(){      
        if(this.state.server===null){
            fetch('/api/getServer',{
                headers:{
                    'authorization':localStorage.getItem('token')
                }
            })
            .then(res=>res.json())
            .then(data=>{
                this.setState({
                    server:data.server
                })
            });
        }
    }

    displayRespuestas(){
        var { respuestas } = this.props.data;
        if(respuestas){
            if(respuestas.length==0){
                return(
                    <div className="callout callout-info">
                        <p>No tiene respuestas de esta tarea.</p>
                    </div>
                )
            }
            return respuestas.map(respuesta => {
                let fechaInt=parseInt(respuesta.fechaHora);
                let fecha=new Date(fechaInt).toUTCString();
                return(
                     <div className="box box-info" key={respuesta.id}>
                        <div className="box-header">
                             <i className="fa fa-user"></i>
                             <h3 className="box-title">{respuesta.usuario}</h3>
                         </div>
                         <div className="box-body">
                             <div className="item">
                                 <p className="message">
                                 {respuesta.texto}
                                 </p>
                             </div>
                             <div className="attachment">
                                 <p>{fecha}</p>
                             </div>
                             <div className="attachment">
                                    <h4>Adjuntos:</h4>
                                    {
                                        respuesta.adjuntos?
                                        respuesta.adjuntos.map(adjunto=>{
                                            let dir=this.state.server+"/donwload/"+adjunto;
                                            return(
                                                <p className="filename">
                                                        <a href={dir}>{adjunto}</a> 
                                                </p>
                                            )
                                        })
                                        :
                                        <></>
                                    }
                                </div>
                         </div>
                     </div>
                )
             })
        }
        else{
            return(
                <div className="callout callout-info">
                    <p>Cargando...</p>
                </div>
            )
        }
    }

    responseTask(e){
        e.preventDefault();
        this.props.history.push('/respondertask/'+this.props.idtask);
    }

    render(){
        let estado=false;
        if((this.props.estado==="Cumplimentada")||(this.props.estado==="Sin asignar")||(this.props.estado==="Asignada"))
            estado=true;
        else{
            if(localStorage.getItem('rol')==="Usuario"){
                console.log(this.props.estado);
                if(this.props.estado==="Asignada en Elaboración")
                    estado=true;
            }
        }
        return(
            <div style={{width:'120%'}}>
                <div className="row">
                    <div className="col-md-10">
                        <div className="box box-default" style={{height:'145px',overflowY: 'scroll'}}>
                            {this.displayRespuestas()}
                        </div>
                        {
                            estado?
                            <button className="btn btn-success" disabled>Responder</button>
                            :
                            <button className="btn btn-success" onClick={(e)=>{this.responseTask(e)}}>Responder</button>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default compose(
    graphql(getRespuestasQuery, {
        options: (props) => {
            return {
                variables: {
                    idtarea: props.idtask
                }
            }
        }
    })
)(VerRespuestas);