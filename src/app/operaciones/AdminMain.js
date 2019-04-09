import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { getAllTasksQuery,deleteTaskMutation } from '../queries/task';
import Popup from 'reactjs-popup';
import AdminTask from './AdminTask';

class AdminMain extends Component{
    constructor(props,context){
        super(props,context);

        this.state={
            open: false,
            openMensaje: false,
            loading:false,
            filtro:"",
            server:null,
            descripcion:"",
            idtarea:null
        };

        this.displayTareas=this.displayTareas.bind(this);
        this.eliminarTask=this.eliminarTask.bind(this);
        this.cambiarFiltro=this.cambiarFiltro.bind(this);
        this.openModal = this.openModal.bind(this);
        this.openModalMensaje = this.openModalMensaje.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeModalMensaje = this.closeModalMensaje.bind(this);
        this.displaycontent = this.displaycontent.bind(this);
        this.displaycontentMensaje = this.displaycontentMensaje.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.cambiarEstadoLoading = this.cambiarEstadoLoading.bind(this)
    }

    componentDidUpdate(){
        if(this.state.loading)
            this.eliminarTask(this.state.idtarea);
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

    cambiarEstadoLoading(){
        if(!this.state.loading){
            this.setState({ 
                loading:true,
                openMensaje: false
            });
        }
    }

    handleChange(e){
        const {name,value}=e.target;
        this.setState({
            [name]:value,
            error:null
        });
    }

    openModal(idtarea){
        this.setState({ 
            open: true,
            idtarea:idtarea
         })
    }

    openModalMensaje(){
        this.setState({ 
            openMensaje: true,
            open: false
         })
    }

    closeModalMensaje() {
        this.setState({ openMensaje: false })
    }

    closeModal() {
        this.setState({ open: false })
    }

    cambiarFiltro(e){
        e.preventDefault();
        if(e.target.value==="Todos")
            this.setState({filtro:""});
        else
            this.setState({filtro:e.target.value});
    }

    displayTareas(){
        var { alltasks } = this.props.data;
        if(alltasks){
            if(alltasks.length==0){
                return(
                    <p class="text-muted" style={{marginLeft:'2%',fontSize:'16px'}}>No hay tareas en el sistema.</p>
                )
            }
            return alltasks.map(task => {
                if(this.state.filtro===""){
                    return(
                        <AdminTask task={task} loading={this.state.loading} filtro={false} openModal={this.openModal} server={this.state.server}/>
                    )
                }
                else if(this.state.filtro===task.estado){
                    return(
                        <AdminTask task={task} loading={this.state.loading} filtro={true} openModal={this.openModal} server={this.state.server}/>
                    )
                }
             })
        }
        else{
            return(
                <p className="text-muted" style={{marginLeft:'2%',fontSize:'16px'}}>Cargando...</p>
            )
        }
    }

    eliminarTask(idtask){
        let selfComponent=this;
        let data={
            usuario:localStorage.getItem('usuario'),
            idtarea:selfComponent.state.idtarea,
            descripcion:selfComponent.state.descripcion
        };
        fetch('/api/enviarCorreo',{
            method:'POST',
            body:JSON.stringify(data),
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'authorization':localStorage.getItem('token')
            }
        }).then(data=>{
            selfComponent.props.deleteTaskMutation({
                variables: {
                    id: idtask
                }
            }).then(function(){
                window.location.reload();
            });
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
                        <button type="button" className="btn btn-success" onClick={()=>{this.openModalMensaje()}}>Aceptar</button>   
                    </div>
                </div>
            </div>
        )
    }

    displaycontentMensaje(){
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
                        <button type="button" className="close" aria-label="Close" onClick={()=>{this.closeModalMensaje()}}>
                        <span aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title">Argummento</h4>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>Descripción:</label>
                                    <textarea className="form-control" rows="3" placeholder="Entre ..." onChange={this.handleChange} name="descripcion"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={()=>{this.closeModalMensaje()}}>Cancelar</button>   
                        <button type="button" className="btn btn-success" onClick={()=>{this.cambiarEstadoLoading()}}>Aceptar</button>
                    </div>
                </div>
            </div>
        )
    }

    render(){
        let token=localStorage.getItem('token');
        if(token===null)
            this.props.history.push('/');

        const containerStyle={
            height: '585px'
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
                            {   
                                this.state.loading?
                                <div className="overlay">
                                    <i className="fa fa-refresh fa-spin"></i>
                                </div>
                                :
                                <></>
                            }
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
                    open={this.state.openMensaje}
                    closeOnDocumentClick
                    onClose={this.closeModalMensaje}
                    contentStyle={contentModalStyle}
                    children={this.displaycontentMensaje}
                    >
                </Popup>
            </div>
        )
    }
}

export default compose(
    graphql(getAllTasksQuery),
    graphql(deleteTaskMutation, { name: "deleteTaskMutation" })
)(AdminMain);