import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import { califTaskMutation } from '../queries/task';
import { graphql, compose } from 'react-apollo';

class UserTask extends Component{
    constructor(props,context){
        super(props,context);

        this.state={
            categoria:null,
            open: false,
            idtarea:'',
            calificacion:1
        };

        this.getCategory=this.getCategory.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.displaycontent = this.displaycontent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.displayCalificacion = this.displayCalificacion.bind(this);
    }

    componentDidMount(){
        this.getCategory(this.props.task.category);
    }

    handleSubmit(e){
        e.preventDefault();
        if(localStorage.getItem('token')){
            let selfComponent=this;
            this.props.califTaskMutation({
                variables: {
                    calificacion:parseInt(this.state.calificacion),
                    id:this.state.idtarea
                }
            }).then(function(){
                window.location.reload();
            });
        }
        else
            this.props.history.push('/');
    }

    openModal(idtarea){
        this.setState({ 
            open: true,
            idtarea:idtarea
         })
    }

    closeModal() {
        this.setState({ open: false })
    }

    displaycontent(){
        const modalStyle={
            width:'60%'
        }

        const modalHeaderStyle={
            backgroundColor:'#00c0ef'
        }

        return(
            <div className="modal-dialog" style={modalStyle}>
                <div className="modal-content">
                    <div className="modal-header" style={modalHeaderStyle}>
                        <button type="button" className="close" aria-label="Close" onClick={()=>{this.closeModal()}}>
                        <span aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title">Realizar Votación</h4>
                    </div>
                    <form role="form" onSubmit={this.handleSubmit}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Puntuación:</label>
                                <select className="form-control"  onChange={ (e) => {this.setState({ calificacion: e.target.value })} }>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={()=>{this.closeModal()}}>Cancelar</button>   
                            <button type="submit" className="btn btn-success">Aceptar</button>
                        </div>
                    </form>
                </div>
            </div>
        )
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

    render(){
        const contentModalStyle={
            width:'25%',
            height:'1px',
            padding:'0px',
            borderBottom:'0px',
            backgroundColor:'#7f7f7f',
            borderColor:'#7f7f7f',
            marginTop:'5%'
        }

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
                        <button className="btn btn-success" style={{marginLeft:'1%'}} onClick={(e)=>{this.props.openModalDetalles(task.id,this.state.categoria)}} data-toggle="tooltip" title="Ver Detalles"><i className="fa fa-eye"></i></button>
                        {
                            (sasignar || asignada || asigvadaC || asigvadaR)?
                            <button className="btn btn-primary" onClick={(e)=>{this.props.edittask(task.id)}} style={{marginLeft:'1%'}} data-toggle="tooltip" title="Editar Tarea"><i className="fa fa-edit"></i></button>
                            :
                            <button className="btn btn-primary" disabled style={{marginLeft:'1%'}} data-toggle="tooltip" title="Editar Tarea"><i className="fa fa-edit"></i></button>
                        }
                        {
                            sasignar?
                            <button className="btn btn-danger" onClick={(e)=>{this.props.openModal(task.id)}} style={{marginLeft:'1%'}} data-toggle="tooltip" title="Eliminar Tarea"><i className="fa fa-trash-o"></i></button>
                            :
                            <button className="btn btn-danger" disabled style={{marginLeft:'1%'}} data-toggle="tooltip" title="Eliminar Tarea"><i className="fa fa-trash-o"></i></button>
                        }
                        {
                            cumplimentada?
                            <button className="btn btn-warning" onClick={(e)=>{this.openModal(task.id)}} style={{marginLeft:'1%'}} data-toggle="tooltip" title="Votar Tarea"><i className="fa fa-thumbs-o-up"></i></button>
                            :
                            <button className="btn btn-warning" disabled style={{marginLeft:'1%'}} data-toggle="tooltip" title="Votar Tarea"><i className="fa fa-thumbs-o-up"></i></button>
                        }
                    </div>
                    <Popup
                        open={this.state.open}
                        closeOnDocumentClick
                        onClose={this.closeModal}
                        contentStyle={contentModalStyle}
                        children={this.displaycontent}
                        >
                    </Popup>
                </div>
            )
        }
        else{
            let task=this.props.task;
            let sasignar=false;
            let asignada=false;
            let asigvadaE=false;
            let asigvadaC=false;
            let asigvadaR=false;
            let cumplimentada=false;
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
            return(
                <div className="box box-success" key={task.id}>
                    {
                        this.state.loading?
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
                                    <button type="button" className="btn btn-default btn-sm active" data-toggle="tooltip" title="Respondida"><i className="fa fa-square text-yellow"></i></button>
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
                        <button className="btn btn-success" style={{marginLeft:'1%'}} onClick={(e)=>{this.props.openModalDetalles(task.id,this.state.categoria)}} data-toggle="tooltip" title="Ver Detalles"><i className="fa fa-eye"></i></button>
                        {
                            (sasignar || asignada || asigvadaC || asigvadaR)?
                            <button className="btn btn-primary" onClick={(e)=>{this.props.edittask(task.id)}} style={{marginLeft:'1%'}} data-toggle="tooltip" title="Editar Tarea"><i className="fa fa-edit"></i></button>
                            :
                            <button className="btn btn-primary" disabled style={{marginLeft:'1%'}} data-toggle="tooltip" title="Editar Tarea"><i className="fa fa-edit"></i></button>
                        }
                        {
                            sasignar?
                            <button className="btn btn-danger" onClick={(e)=>{this.props.openModal(task.id)}} style={{marginLeft:'1%'}} data-toggle="tooltip" title="Eliminar Tarea"><i className="fa fa-trash-o"></i></button>
                            :
                            <button className="btn btn-danger" disabled style={{marginLeft:'1%'}} data-toggle="tooltip" title="Eliminar Tarea"><i className="fa fa-trash-o"></i></button>
                        }
                        {
                            cumplimentada?
                            <button className="btn btn-warning" onClick={(e)=>{this.openModal(task.id)}} style={{marginLeft:'1%'}} data-toggle="tooltip" title="Votar Tarea"><i className="fa fa-thumbs-o-up"></i></button>
                            :
                            <button className="btn btn-warning" disabled style={{marginLeft:'1%'}} data-toggle="tooltip" title="Votar Tarea"><i className="fa fa-thumbs-o-up"></i></button>
                        }
                    </div>
                    <Popup
                        open={this.state.open}
                        closeOnDocumentClick
                        onClose={this.closeModal}
                        contentStyle={contentModalStyle}
                        children={this.displaycontent}
                        >
                    </Popup>
                </div>
            )
        }
    }
}
export default compose(
    graphql(califTaskMutation, { name: "califTaskMutation" })
)(UserTask);
