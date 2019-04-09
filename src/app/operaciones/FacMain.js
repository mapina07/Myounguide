import React, { Component } from 'react';
import { getTasksQuery,changeStateTaskMutation,rechazarTaskMutation } from '../queries/task';
import { graphql, compose } from 'react-apollo';
import Popup from 'reactjs-popup';
import VerRespuestas from './VerRespuestas';
import FacTask from './FacTask';
import NotificationSystem from 'react-notification-system';

class FacMain extends Component{
    constructor(props,context){
        super(props,context);

        this.state={
            idtarea:'',
            loading:false,
            estado:"",
            filtro:"",
            openDetalles:false,
            server:null,
            categoria:"",
            error:null,
            open: false
        };

        this.displayTareas=this.displayTareas.bind(this);
        this.cambiarEstado=this.cambiarEstado.bind(this);
        this.responseTask=this.responseTask.bind(this);
        this.cambiarEstadoLoading=this.cambiarEstadoLoading.bind(this);
        this.cambiarFiltro=this.cambiarFiltro.bind(this);
        this.openModalDetalles=this.openModalDetalles.bind(this);
        this.closeModalDetalles=this.closeModalDetalles.bind(this);
        this.displaycontentDetalles=this.displaycontentDetalles.bind(this);
        this.rechazarTarea=this.rechazarTarea.bind(this);
        this.notificationSystem= React.createRef();
        this.openModal = this.openModal.bind(this);
        this.displaycontent = this.displaycontent.bind(this);
    }

    componentDidUpdate(){
        if(this.state.loading)
            this.cambiarEstado(this.state.estado,this.state.idtarea);
        else{
            const notification = this.notificationSystem.current;
            if(this.state.error){
                notification.addNotification({
                    message: this.state.error,
                    level: 'error',
                    position:'br'
                });
            }
        }
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
                        <h4 className="modal-title">Notificación</h4>
                    </div>
                    <div className="modal-body">
                        <p>Se ha rechazado la tarea correctamente.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" onClick={()=>{window.location.reload();}}>Aceptar</button>   
                    </div>
                </div>
            </div>
        )
    }

    openModal(){
        this.setState({ 
            open: true
        })
    }

    cambiarFiltro(e){
        e.preventDefault();
        if(e.target.value==="Todos")
            this.setState({filtro:""});
        else
            this.setState({filtro:e.target.value});
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

    responseTask(e,idtask){
        e.preventDefault();
        this.props.history.push('/respondertask/'+idtask);
    }

    cambiarEstadoLoading(idtarea,e,estado,proceso){
        e.preventDefault();
        if(proceso==="forward"){
            if(estado==="Sin asignar"){
                if(!this.state.loading){
                    this.setState({ 
                        loading:true, 
                        idtarea:idtarea,
                        estado:"Asignada"
                    });
                }
            }
            else if(estado==="Asignada"){
                if(!this.state.loading){
                    this.setState({ 
                        loading:true, 
                        idtarea:idtarea,
                        estado:"Asignada en Elaboración"
                    });
                }
            }
            else if(estado==="Asignada en Elaboración"){
                if(!this.state.loading){
                    this.setState({ 
                        loading:true, 
                        idtarea:idtarea,
                        estado:"Asignada Cumplimentada"
                    });
                }
            }
        }
        else{
            if(estado==="Asignada en Elaboración"){
                if(!this.state.loading){
                    this.setState({ 
                        loading:true, 
                        idtarea:idtarea,
                        estado:"Asignada"
                    });
                }
            }
            else if(estado==="Asignada Cumplimentada"){
                if(!this.state.loading){
                    this.setState({ 
                        loading:true, 
                        idtarea:idtarea,
                        estado:"Asignada en Elaboración"
                    });
                }
            }
        }
    }

    openModalDetalles(idtarea,categoria){
        this.setState({ 
            openDetalles: true,
            idtarea:idtarea,
            categoria:categoria
        })
    }

    closeModalDetalles() {
        this.setState({ openDetalles: false })
    }

    rechazarTarea(e,idtarea,categoria){
        e.preventDefault();
        let selfComponent=this;
        this.props.rechazarTaskMutation({
            variables: {
                id: idtarea,
                usuario:localStorage.getItem('usuario'),
                categoria:categoria
            }
        }).then(function(response){
            if(response.data.rechazarTask)
                selfComponent.openModal();
            else{
                error="Error al rechazar tarea.";
                this.setState({
                    error:error
                });
            }
        });
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
                            <FacTask task={task} server={this.state.server} loading={this.state.loading} openModalDetalles={this.openModalDetalles} filtro={false} responseTask={this.responseTask} rechazarTarea={this.rechazarTarea} cambiarEstadoLoading={this.cambiarEstadoLoading}/>
                        )
                    }
                    else if(this.state.filtro===task.estado){
                        return(
                            <FacTask task={task} server={this.state.server} loading={this.state.loading} openModalDetalles={this.openModalDetalles} filtro={true} responseTask={this.responseTask} rechazarTarea={this.rechazarTarea} cambiarEstadoLoading={this.cambiarEstadoLoading}/>
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
                                                let dir=this.state.server+"/donwload/"+adjunto;
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
                            <div className="box box-success">
                                <div className="box-header">
                                    <i className="fa fa-archive"></i>
                                    <h3 className="box-title">Respuestas</h3>
                                </div>
                                <div className="box-body">
                                        <VerRespuestas idtask={tarea.id} history={this.props.history} estado={tarea.estado}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    render(){
        let token=localStorage.getItem('token');
        if(token===null)
            this.props.history.push('/');

        const containerStyle={
            height: '586px'
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

        var style = {
            NotificationItem: { // Override the notification item
                DefaultStyle: { // Applied to every notification, regardless of the notification level
                    with: '150%',
                    height:'75px',
                    fontSize:'16px'
                }
            }
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
                    open={this.state.openDetalles}
                    closeOnDocumentClick
                    onClose={this.closeModalDetalles}
                    contentStyle={contentMStyleDetalles}
                    children={this.displaycontentDetalles}
                    >
                </Popup>
                <NotificationSystem ref={this.notificationSystem} style={style}/>
                <Popup
                    open={this.state.open}
                    closeOnDocumentClick={false}
                    onClose={this.closeModal}
                    contentStyle={contentModalStyle}
                    children={this.displaycontent}
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
    graphql(changeStateTaskMutation, { name: "changeStateTaskMutation" }),
    graphql(rechazarTaskMutation, { name: "rechazarTaskMutation" })
)(FacMain);