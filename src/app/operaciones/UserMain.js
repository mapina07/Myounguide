import React, { Component } from 'react';
import { getTasksQuery,deleteTaskMutation,changeStateTaskMutation } from '../queries/task';
import { graphql, compose } from 'react-apollo';
import Popup from 'reactjs-popup';
import VerRespuestas from './VerRespuestas';
import UserTask from './UserTask';

class UserMain extends Component{
    constructor(props,context){
        super(props,context);

        this.state={
            open: false,
            idtarea:'',
            loading:false,
            estado:"",
            filtro:"",
            openDetalles:false,
            categoria:""
        };

        this.displayTareas=this.displayTareas.bind(this);
        this.openModal = this.openModal.bind(this);
        this.openModalDetalles = this.openModalDetalles.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeModalDetalles = this.closeModalDetalles.bind(this);
        this.displaycontent = this.displaycontent.bind(this)
        this.displaycontentDetalles = this.displaycontentDetalles.bind(this)
        this.eliminarTask=this.eliminarTask.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.cambiarEstadoLoading=this.cambiarEstadoLoading.bind(this);
        this.cambiarFiltro=this.cambiarFiltro.bind(this);
        this.edittask=this.edittask.bind(this);
    }

    componentDidUpdate(){
        if(this.state.loading)
            this.cambiarEstado(this.state.estado,this.state.idtarea);
    }

    cambiarEstado(estado,idtask){
        this.props.changeStateTaskMutation({
            variables: {
                idtask: idtask,
                estado:estado
            }
        }).then(function(){
            window.location.reload();
        });
    }

    openModal(idtarea){
        this.setState({ 
            open: true,
            idtarea:idtarea
         })
    }

    openModalDetalles(idtarea,categoria){
        this.setState({ 
            openDetalles: true,
            idtarea:idtarea,
            categoria:categoria
        })
    }

    closeModal() {
        this.setState({ open: false })
    }

    closeModalDetalles() {
        this.setState({ openDetalles: false })
    }

    eliminarTask(idtask){
        this.props.deleteTaskMutation({
            variables: {
                id: idtask
            }
        }).then(function(){
            window.location.reload();
        });
    }

    displaycontent(){
        const modalStyle={
            width:'100%'
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
                        <h4 className="modal-title">Confirmación</h4>
                    </div>
                    <div className="modal-body">
                        <p>Esta seguro que desea eliminar el elemento?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={()=>{this.closeModal()}}>Cancelar</button>   
                        <button type="button" className="btn btn-success" onClick={()=>{this.eliminarTask(this.state.idtarea)}}>Aceptar</button>
                    </div>
                </div>
            </div>
        )
    }

    displaycontentDetalles(){
        var { tasks } = this.props.data;
        if(tasks){
            let tarea="";
            tasks.map(task=>{
                if(task){
                    if(task.id===this.state.idtarea)
                        tarea=task;
                }
            });
            
            const modalStyle={
                width:'100%'
            }
    
            const modalHeaderStyle={
                backgroundColor:'#00c0ef'
            }

            let fechaInt=parseInt(tarea.fechaHora);
            let fecha=new Date(fechaInt).toUTCString();

            return(
                <div className="modal-dialog" style={modalStyle}>
                    <div className="modal-content">
                        <div className="modal-header" style={modalHeaderStyle}>
                            <button type="button" className="close" aria-label="Close" onClick={()=>{this.closeModalDetalles()}}>
                            <span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">Detalles</h4>
                        </div>
                        <div className="modal-body">
                            <div className="box box-success" style={{maxHeight:'145px',overflowY: 'scroll'}}>
                                <div className="box-header">
                                    <i className="fa fa-thumb-tack"></i>
                                    <h3 className="box-title">{tarea.denominacion}-{this.state.categoria}</h3>
                                </div>
                                <div className="box-body">
                                    <div className="item">
                                        <p className="message">
                                        {tarea.descripcion}
                                        </p>
                                    </div>
                                    <div className="attachment">
                                        <p>{fecha}</p>
                                    </div>
                                    <div className="attachment">
                                        <h4>Adjuntos:</h4>
                                        {
                                            tarea.adjuntos.map(adjunto=>{
                                                let dir=this.props.server+"/donwload/"+adjunto;
                                                return(
                                                    <p className="filename">
                                                         <a href={dir}>{adjunto}</a> 
                                                    </p>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            {<div className="box box-success">
                                <div className="box-header">
                                    <i className="fa fa-archive"></i>
                                    <h3 className="box-title">Respuestas</h3>
                                </div>
                                <div className="box-body">
                                        <VerRespuestas idtask={tarea.id} history={this.props.history} server={this.props.server} estado={tarea.estado}/>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            )
        }
    }

    cambiarEstadoLoading(idtarea,e,estado){
        e.preventDefault();
        if(!this.state.loading){
            this.setState({ 
                loading:true, 
                idtarea:idtarea,
                estado:estado
            });
        }
    }

    edittask(id){
        this.props.history.push('/modtask/'+id);
    }

    displayTareas(){
        var { tasks } = this.props.data;
        if(tasks){
            if(tasks.length==0){
                return(
                    <p className="text-muted" style={{marginLeft:'2%',fontSize:'16px'}}>No tiene tareas confeccionadas.</p>
                )
            }
            return tasks.map(task => {
                if(task){
                    if(this.state.filtro===""){
                        return(
                            <UserTask task={task} loading={this.state.loading} openModalDetalles={this.openModalDetalles} edittask={this.edittask} openModal={this.openModal} filtro={false} server={this.props.server}/>
                        )
                    }
                    else if(this.state.filtro===task.estado){
                        return(
                            <UserTask task={task} loading={this.state.loading} openModalDetalles={this.openModalDetalles} edittask={this.edittask} openModal={this.openModal} filtro={true} server={this.props.server}/>
                        )
                    }
                }
             })
        }
        else{
            return(
                <p className="text-muted" style={{marginLeft:'2%',fontSize:'16px'}}>Cargando...</p>
            )
        }
    }

    cambiarFiltro(e){
        e.preventDefault();
        if(e.target.value==="Todos")
            this.setState({filtro:""});
        else
            this.setState({filtro:e.target.value});
    }

    render(){
        let token=localStorage.getItem('token');
        if(token===null)
            this.props.history.push('/');

        const containerStyle={
            height: '590px'
        }

        const contentModalStyle={
            width:'25%',
            height:'1px',
            padding:'0px',
            borderBottom:'0px',
            backgroundColor:'#7f7f7f',
            borderColor:'#7f7f7f',
            marginTop:'5%'
        }
        const contentMStyleDetalles={
            width:'80%',
            height:'1px',
            padding:'0px',
            borderBottom:'0px',
            backgroundColor:'#7f7f7f',
            borderColor:'#7f7f7f',
            marginTop:'1%'
        }

        return(
            <div className="container" style={containerStyle}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="row" style={{ marginBottom:'1%'}}>
                            <div className="col-md-2">
                                <button type="button" className="btn btn-default btn-sm"><i className="fa fa-square text-green"></i></button> Sin Asignar
                            </div>
                            <div className="col-md-2">
                                <button type="button" className="btn btn-default btn-sm"><i className="fa fa-square text-red"></i></button> Asignada
                            </div>
                            <div className="col-md-2">
                                <button type="button" className="btn btn-default btn-sm"><i className="fa fa-square text-blue"></i></button> Elaboración
                            </div>
                            <div className="col-md-2">
                                <button type="button" className="btn btn-default btn-sm"><i className="fa fa-square text-yellow"></i></button> A. Cumplimentada
                            </div>
                            <div className="col-md-2">
                                <button type="button" className="btn btn-default btn-sm"><i className="fa fa-square text-black"></i></button> Revisión
                            </div>
                            <div className="col-md-2">
                                <button type="button" className="btn btn-default btn-sm"><i className="fa fa-square text-purple"></i></button> Cumplimentada
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="box-body">
                                    <div className="form-group">
                                        <label className="col-sm-4 control-label" style={{marginTop:'1%'}}>Filtrar por Estado</label>
                                        <div className="col-sm-6">
                                                <select className="form-control"  onChange={ (e) => this.cambiarFiltro(e) }>
                                                    <option>Todos</option>
                                                    <option>Sin asignar</option>
                                                    <option>Asignada</option>
                                                    <option>Asignada en Elaboración</option>
                                                    <option>Asignada Cumplimentada</option>
                                                    <option>Asignada en Revisión</option>
                                                    <option>Cumplimentada</option>
                                                </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="box box-default" style={{maxHeight:'475px',overflowY: 'scroll'}}>
                            {this.displayTareas()}
                        </div>
                    </div>
                </div>
                <Popup
                    open={this.state.open}
                    closeOnDocumentClick
                    onClose={this.closeModal}
                    contentStyle={contentModalStyle}
                    children={this.displaycontent}
                    >
                </Popup>
                <Popup
                    open={this.state.openDetalles}
                    closeOnDocumentClick
                    onClose={this.closeModalDetalles}
                    contentStyle={contentMStyleDetalles}
                    children={this.displaycontentDetalles}
                    >
                </Popup>
            </div>
        )
    }
}

export default compose(
    graphql(getTasksQuery, {
        options: (props) => {
            return {
                variables: {
                    usuario: localStorage.getItem('usuario')
                }
            }
        }
    }),
    graphql(deleteTaskMutation, { name: "deleteTaskMutation" }),
    graphql(changeStateTaskMutation, { name: "changeStateTaskMutation" })
)(UserMain);