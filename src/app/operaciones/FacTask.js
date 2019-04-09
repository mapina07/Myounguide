import React, { Component } from 'react';

class FacTask extends Component{
    constructor(props,context){
        super(props,context);

        this.state={
            categoria:null
        };

        this.getCategory=this.getCategory.bind(this);
        this.displayCalificacion = this.displayCalificacion.bind(this);
    }

    componentDidMount(){
        this.getCategory(this.props.task.category);
    }

    displayCalificacion(calificacion){
        switch(calificacion){
            case 1:
                return(
                    <div className="row" style={{marginTop:'1%'}}>
                        <div className="col-md-6">
                            <i className="fa fa-2x fa-star"></i>
                            <i className="fa fa-2x fa-star-o"></i>
                            <i className="fa fa-2x fa-star-o"></i>
                            <i className="fa fa-2x fa-star-o"></i>
                            <i className="fa fa-2x fa-star-o"></i>
                        </div>
                    </div>
                )
            case 2:
                return(
                    <div className="row" style={{marginTop:'1%'}}>
                        <div className="col-md-6">
                            <i className="fa fa-2x fa-star"></i>
                            <i className="fa fa-2x fa-star"></i>
                            <i className="fa fa-2x fa-star-o"></i>
                            <i className="fa fa-2x fa-star-o"></i>
                            <i className="fa fa-2x fa-star-o"></i>
                        </div>
                    </div>
                )
            case 3:
                return(
                    <div className="row" style={{marginTop:'1%'}}>
                        <div className="col-md-6">
                            <i className="fa fa-2x fa-star"></i>
                            <i className="fa fa-2x fa-star"></i>
                            <i className="fa fa-2x fa-star"></i>
                            <i className="fa fa-2x fa-star-o"></i>
                            <i className="fa fa-2x fa-star-o"></i>
                        </div>
                    </div>
                )
            case 4:
                return(
                    <div className="row" style={{marginTop:'1%'}}>
                        <div className="col-md-6">
                            <i className="fa fa-2x fa-star"></i>
                            <i className="fa fa-2x fa-star"></i>
                            <i className="fa fa-2x fa-star"></i>
                            <i className="fa fa-2x fa-star"></i>
                            <i className="fa fa-2x fa-star-o"></i>
                        </div>
                    </div>
                )
            case 5:
                return(
                    <div className="row" style={{marginTop:'1%'}}>
                        <div className="col-md-6">
                            <i className="fa fa-2x fa-star"></i>
                            <i className="fa fa-2x fa-star"></i>
                            <i className="fa fa-2x fa-star"></i>
                            <i className="fa fa-2x fa-star"></i>
                            <i className="fa fa-2x fa-star"></i>
                        </div>
                    </div>
                )
            default:
                return(
                    <div className="row" style={{marginTop:'1%'}}>
                        <div className="col-md-6">
                            <i className="fa fa-2x fa-star-o"></i>
                            <i className="fa fa-2x fa-star-o"></i>
                            <i className="fa fa-2x fa-star-o"></i>
                            <i className="fa fa-2x fa-star-o"></i>
                            <i className="fa fa-2x fa-star-o"></i>
                        </div>
                    </div>
                )
        }
    }

    getCategory(idcategory){
        let selfcomponent=this;
        fetch('/api/getCategoryDenom/'+idcategory)
        .then(res=>res.json())
        .then(data=>{
            selfcomponent.setState({
                categoria:data.category
            });
        }); 
    }

    render(){
        if(!this.props.filtro){
            let sasignar=false;
            let asignada=false;
            let responder=false;
            let asigvadaE=false;
            let asigvadaC=false;
            let asigvadaR=false;
            let cumplimentada=false;
            let task=this.props.task;
            if(task.estado==="Sin asignar"){
                sasignar=true;
            }
            else if(task.estado==="Asignada"){
                asignada=true;
            }
            else if(task.estado==="Asignada en Elaboración"){
                asigvadaE=true;
                responder=true;
            }
            else if(task.estado==="Asignada Cumplimentada"){
                asigvadaC=true;
            }
            else if(task.estado==="Asignada en Revisión"){
                asigvadaR=true;
                responder=true;
            }
            else
                cumplimentada=true;
            return(
                <div className="box box-success" key={task.id}>
                    {
                        this.props.loading?
                        <div className="overlay">
                            <i className="fa fa-refresh fa-spin"></i>
                        </div>
                        :
                        <></>
                    }
                    <div className="box-header">
                        <i className="fa fa-thumb-tack"></i>
                        <h3 className="box-title">{task.denominacion}-{this.state.categoria}</h3>
                        {
                            cumplimentada?
                            this.displayCalificacion(task.calificacion)
                            :
                            <></>
                        }
                        <div className="box-tools pull-right">
                            <div className="btn-group" data-toggle="btn-toggle">
                                {
                                    sasignar?
                                    <button type="button" className="btn btn-default btn-sm active" data-toggle="tooltip" title="Sin asignar"><i className="fa fa-square text-green"></i></button>
                                    :
                                    <></>
                                }
                                {
                                    asignada?
                                    <button type="button" className="btn btn-default btn-sm active" data-toggle="tooltip" title="Asignada"><i className="fa fa-square text-red"></i></button>
                                    :
                                    <></>
                                }
                                {
                                    asigvadaE?
                                    <button type="button" className="btn btn-default btn-sm active" data-toggle="tooltip" title="Asignada en Elaboración"><i className="fa fa-square text-blue"></i></button>
                                    :
                                    <></>
                                }
                                {
                                    asigvadaC?
                                    <button type="button" className="btn btn-default btn-sm active" data-toggle="tooltip" title="Asignada Cumplimentada"><i className="fa fa-square text-yellow"></i></button>
                                    :
                                    <></>
                                }
                                {
                                    asigvadaR?
                                    <button type="button" className="btn btn-default btn-sm active" data-toggle="tooltip" title="Asignada en Revisión"><i className="fa fa-square text-black"></i></button>
                                    :
                                    <></>

                                }
                                {
                                    cumplimentada?
                                    <button type="button" className="btn btn-default btn-sm active" data-toggle="tooltip" title="Cumplimentada"><i className="fa fa-square text-purple"></i></button>
                                    :
                                    <></>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="box-body">
                        <div className="item">
                            <p className="message">
                            {task.descripcion}
                            </p>
                        </div>
                        <div className="attachment">
                            <h4>Adjuntos:</h4>
                            {
                                task.adjuntos.map(adjunto=>{
                                    let dir=this.props.server+"/donwload/"+adjunto;
                                    return(
                                        <p className="filename">
                                            <a href={dir}>{adjunto}</a> 
                                        </p>
                                    )
                                })
                            }
                        </div>
                        {
                            responder?
                            <button className="btn btn-success" onClick={(e)=>{this.props.responseTask(e,task.id)}} data-toggle="tooltip" title="Responder"><i className="fa fa-pencil"></i></button>
                            :
                            <button className="btn btn-success" disabled data-toggle="tooltip" title="Responder"><i className="fa fa-pencil"></i></button>
                        }
                        <button className="btn btn-info" style={{marginLeft:'1%'}} onClick={(e)=>{this.props.openModalDetalles(task.id,this.state.categoria)}} data-toggle="tooltip" title="Ver Detalles"><i className="fa fa-eye"></i></button>
                        {
                            (cumplimentada)?
                            <button className="btn btn-warning" style={{marginLeft:'1%'}} disabled data-toggle="tooltip" title="Rechazar Tarea"><i className="fa fa-ban"></i></button>
                            :
                            <button className="btn btn-warning" style={{marginLeft:'1%'}} onClick={(e)=>{this.props.rechazarTarea(e,task.id,task.category)}} data-toggle="tooltip" title="Rechazar Tarea"><i className="fa fa-ban"></i></button>
                        }
                        {
                            (asignada || asigvadaR || cumplimentada)?
                            <button className="btn btn-primary" disabled style={{marginLeft:'1%'}} data-toggle="tooltip" title="Retroceder Estado"><i className="fa fa-mail-reply"></i></button>
                            :
                            <button className="btn btn-primary" style={{marginLeft:'1%'}} onClick={(e)=>{this.props.cambiarEstadoLoading(task.id,e,task.estado,'back')}} data-toggle="tooltip" title="Retroceder Estado"><i className="fa fa-mail-reply"></i></button>
                        }
                        {
                            (asigvadaC||asigvadaR || cumplimentada)?
                            <button className="btn btn-primary" disabled style={{marginLeft:'1%'}} data-toggle="tooltip" title="Avanzar Estado"><i className="fa fa-mail-forward"></i></button>
                            :
                            <button className="btn btn-primary" style={{marginLeft:'1%'}} onClick={(e)=>{this.props.cambiarEstadoLoading(task.id,e,task.estado,'forward')}} data-toggle="tooltip" title="Avanzar Estado"><i className="fa fa-mail-forward"></i></button>
                        }
                    </div>
                </div>
            )
        }
        else{
            let sasignar=false;
            let asignada=false;
            let responder=false;
            let asigvadaE=false;
            let asigvadaC=false;
            let asigvadaR=false;
            let cumplimentada=false;
            let task=this.props.task;
            if(task.estado==="Sin asignar"){
                sasignar=true;
            }
            else if(task.estado==="Asignada"){
                asignada=true;
            }
            else if(task.estado==="Asignada en Elaboración"){
                asigvadaE=true;
                responder=true;
            }
            else if(task.estado==="Asignada Cumplimentada"){
                asigvadaC=true;
            }
            else if(task.estado==="Asignada en Revisión"){
                asigvadaR=true;
                responder=true;
            }
            else
                cumplimentada=true;
            return(
                <div className="box box-success" key={task.id}>
                    {
                        this.props.loading?
                        <div className="overlay">
                            <i className="fa fa-refresh fa-spin"></i>
                        </div>
                        :
                        <></>
                    }
                    <div className="box-header">
                        <i className="fa fa-thumb-tack"></i>
                        <h3 className="box-title">{task.denominacion}-{this.state.categoria}</h3>
                        {
                            cumplimentada?
                            this.displayCalificacion(task.calificacion)
                            :
                            <></>
                        }
                        <div className="box-tools pull-right">
                            <div className="btn-group" data-toggle="btn-toggle">
                                {
                                    sasignar?
                                    <button type="button" className="btn btn-default btn-sm active" data-toggle="tooltip" title="Sin asignar"><i className="fa fa-square text-green"></i></button>
                                    :
                                    <></>
                                }
                                {
                                    asignada?
                                    <button type="button" className="btn btn-default btn-sm active" data-toggle="tooltip" title="Asignada"><i className="fa fa-square text-red"></i></button>
                                    :
                                    <></>
                                }
                                {
                                    asigvadaE?
                                    <button type="button" className="btn btn-default btn-sm active" data-toggle="tooltip" title="Asignada en Elaboración"><i className="fa fa-square text-blue"></i></button>
                                    :
                                    <></>
                                }
                                {
                                    asigvadaC?
                                    <button type="button" className="btn btn-default btn-sm active" data-toggle="tooltip" title="Asignada Cumplimentada"><i className="fa fa-square text-yellow"></i></button>
                                    :
                                    <></>
                                }
                                {
                                    asigvadaR?
                                    <button type="button" className="btn btn-default btn-sm active" data-toggle="tooltip" title="Asignada en Revisión"><i className="fa fa-square text-black"></i></button>
                                    :
                                    <></>

                                }
                                {
                                    cumplimentada?
                                    <button type="button" className="btn btn-default btn-sm active" data-toggle="tooltip" title="Cumplimentada"><i className="fa fa-square text-purple"></i></button>
                                    :
                                    <></>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="box-body">
                        <div className="item">
                            <p className="message">
                            {task.descripcion}
                            </p>
                        </div>
                        <div className="attachment">
                            <h4>Adjuntos:</h4>
                            {
                                task.adjuntos.map(adjunto=>{
                                    let dir=this.props.server+"/donwload/"+adjunto;
                                    return(
                                        <p className="filename">
                                            <a href={dir}>{adjunto}</a> 
                                        </p>
                                    )
                                })
                            }
                        </div>
                        {
                            responder?
                            <button className="btn btn-success" onClick={(e)=>{this.props.responseTask(e,task.id)}} data-toggle="tooltip" title="Responder"><i className="fa fa-pencil"></i></button>
                            :
                            <button className="btn btn-success" disabled data-toggle="tooltip" title="Responder"><i className="fa fa-pencil"></i></button>
                        }
                        <button className="btn btn-info" style={{marginLeft:'1%'}} onClick={(e)=>{this.props.openModalDetalles(task.id,this.state.categoria)}} data-toggle="tooltip" title="Ver Detalles"><i className="fa fa-eye"></i></button>
                        {
                            (cumplimentada)?
                            <button className="btn btn-warning" style={{marginLeft:'1%'}} disabled data-toggle="tooltip" title="Rechazar Tarea"><i className="fa fa-ban"></i></button>
                            :
                            <button className="btn btn-warning" style={{marginLeft:'1%'}} onClick={(e)=>{this.props.rechazarTarea(e,task.id,task.category)}} data-toggle="tooltip" title="Rechazar Tarea"><i className="fa fa-ban"></i></button>
                        }
                        {
                            (asignada || asigvadaR || cumplimentada)?
                            <button className="btn btn-primary" disabled style={{marginLeft:'1%'}} data-toggle="tooltip" title="Retroceder Estado"><i className="fa fa-mail-reply"></i></button>
                            :
                            <button className="btn btn-primary" style={{marginLeft:'1%'}} onClick={(e)=>{this.props.cambiarEstadoLoading(task.id,e,task.estado,'back')}} data-toggle="tooltip" title="Retroceder Estado"><i className="fa fa-mail-reply"></i></button>
                        }
                        {
                            (asigvadaC||asigvadaR || cumplimentada)?
                            <button className="btn btn-primary" disabled style={{marginLeft:'1%'}} data-toggle="tooltip" title="Avanzar Estado"><i className="fa fa-mail-forward"></i></button>
                            :
                            <button className="btn btn-primary" style={{marginLeft:'1%'}} onClick={(e)=>{this.props.cambiarEstadoLoading(task.id,e,task.estado,'forward')}} data-toggle="tooltip" title="Avanzar Estado"><i className="fa fa-mail-forward"></i></button>
                        }
                    </div>
                </div>
            )
        }
    }
}
export default FacTask;
