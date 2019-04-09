import React, { Component } from 'react';

class AdminTask extends Component{
    constructor(props,context){
        super(props,context);

        this.state={
            categoria:null
        };

        this.getCategory=this.getCategory.bind(this);
        this.displayCalificacion=this.displayCalificacion.bind(this);
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
            }
            else if(task.estado==="Asignada Cumplimentada"){
                asigvadaC=true;
            }
            else if(task.estado==="Asignada en Revisión"){
                asigvadaR=true;
            }
            else
                cumplimentada=true;
            let fechaInt=parseInt(task.fechaHora);
            let fecha=new Date(fechaInt).toUTCString();
            return(
                <div className="box box-success" key={task.id}>
                    <div className="box-header">
                        <i className="fa fa-thumb-tack"></i>
                        <h3 className="box-title">{task.denominacion}-{this.state.categoria}</h3>
                        {
                            cumplimentada?
                            this.displayCalificacion(task.calificacion)
                            :
                            <></>
                        }
                        <div className="box-tools pull-right" data-toggle="tooltip" title="Status">
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
                            <p>{fecha}</p>
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
                            cumplimentada?
                            <button className="btn btn-danger" disabled data-toggle="tooltip" title="Eliminar Tarea"><i className="fa fa-trash-o"></i></button>
                            :
                            <button className="btn btn-danger" onClick={(e)=>{this.props.openModal(task.id)}} data-toggle="tooltip" title="Eliminar Tarea"><i className="fa fa-trash-o"></i></button>
                        }
                    </div>
                </div>
            )
        }
        else{
            let sasignar=false;
            let asignada=false;
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
            }
            else if(task.estado==="Asignada Cumplimentada"){
                asigvadaC=true;
            }
            else if(task.estado==="Asignada en Revisión"){
                asigvadaR=true;
            }
            else
                cumplimentada=true;
            let fechaInt=parseInt(task.fechaHora);
            let fecha=new Date(fechaInt).toUTCString();
            return(
                <div className="box box-success" key={task.id}>
                    <div className="box-header">
                        <i className="fa fa-thumb-tack"></i>
                        <h3 className="box-title">{task.denominacion}-{this.state.categoria}</h3>
                        {
                            cumplimentada?
                            this.displayCalificacion(task.calificacion)
                            :
                            <></>
                        }
                        <div className="box-tools pull-right" data-toggle="tooltip" title="Status">
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
                            <p>{fecha}</p>
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
                            cumplimentada?
                            <button className="btn btn-danger" disabled data-toggle="tooltip" title="Eliminar Tarea"><i className="fa fa-trash-o"></i></button>
                            :
                            <button className="btn btn-danger" onClick={(e)=>{this.props.openModal(task.id)}} data-toggle="tooltip" title="Eliminar Tarea"><i className="fa fa-trash-o"></i></button>
                        }
                    </div>
                </div>
            )
        }
    }
}
export default AdminTask;
