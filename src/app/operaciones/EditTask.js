import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import { getTaskQuery,modTaskMutation,deleteAdjuntoMutation } from '../queries/task';
import { uploadFileMutation } from '../queries/file';
import NotificationSystem from 'react-notification-system';
import Dropzone from 'react-dropzone';

class EditTask extends Component{
    constructor(props,context){
        super(props,context);

        this.onDrop = (files) => {
            this.setState({files})
        }
         
        this.state={
            denominacion:null,
            descripcion:null,
            estado:null,
            error:null,
            server:null,
            files:[]
        };

        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.uploadFile=this.uploadFile.bind(this);
        this.eliminarAdjunto=this.eliminarAdjunto.bind(this);

        this.notificationSystem= React.createRef();
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

    componentDidUpdate(){
        const notification = this.notificationSystem.current;
        if(this.state.error){
            notification.addNotification({
                message: this.state.error,
                level: 'error',
                position:'br'
            });
        }
    }

    uploadFile(file){
        this.props.uploadFileMutation({
            variables: {
                file:file
            }
        });
        let arrFile=this.state.files;
        arrFile.push(file);
        this.setState({
            files:arrFile
        });
    }

    displayEstados(estado){
        return(
            <div>
                {
                (estado==="Sin asignar")?
                <select className="form-control"  onChange={ (e) => {this.setState({ estado: e.target.value })}}>
                    <option>Sin asignar</option>
                </select>
                :
                <></>
                }
                {
                    (estado==="Asignada")?
                    <select className="form-control"  onChange={ (e) => {this.setState({ estado: e.target.value })}}>
                        <option>Asignada</option>
                    </select>
                    :
                    <></>
                }
                {
                    (estado==="Asignada en Elaboración")?
                    <select className="form-control"  onChange={ (e) => {this.setState({ estado: e.target.value })}}>
                        <option>Asignada en Elaboración</option>
                    </select>
                    :
                    <></>
                }
                {
                    (estado==="Asignada Cumplimentada")?
                    <select className="form-control"  onChange={ (e) => {this.setState({ estado: e.target.value })}}>
                        <option>Asignada Cumplimentada</option>
                        <option>Asignada en Revisión</option>
                    </select>
                    :
                    <></>
                }
                {
                    (estado==="Asignada en Revisión")?
                    <select className="form-control" onChange={ (e) => {this.setState({ estado: e.target.value })}}>
                        <option>Asignada en Revisión</option>
                        <option>Cumplimentada</option>
                        <option>Asignada Cumplimentada</option>
                    </select>
                    :
                    <></>
                }
            </div>
        )
    }

    eliminarAdjunto(e,adjunto){
        e.preventDefault();
        this.props.deleteAdjuntoMutation({
            variables: {
                adjunto: adjunto,
                id:this.props.match.params.id
            }
        }).then(function(){
            window.location.reload();
        });
    }

    displayContent(){
        const { task } = this.props.data;
        if(task){
            const rowStyle={
                marginTop:'1%'
            }

            if(this.state.denominacion===null){
                this.setState({
                    denominacion:task.denominacion,
                    descripcion:task.descripcion,
                    estado:task.estado
                })
            }

            const files = this.state.files.map(file => (
                <li key={file.name}>
                  {file.name} - {file.size} bytes
                </li>
            ))

            return(
                <form role="form" onSubmit={this.handleSubmit}>
                    <div className="box-body">
                        <div className="row">
                            <div className="col-md-6">
                                <label>Título:</label>
                                <div className="input-group">
                                    {
                                        task.estado==="Sin asignar"?
                                        <input type="text" className="form-control" name="denominacion" value={this.state.denominacion} onChange={this.handleChange} placeholder="Título"></input>
                                        :
                                        <input disabled type="text" className="form-control" name="denominacion" value={this.state.denominacion} onChange={this.handleChange} placeholder="Título"></input>
                                    }
                                    <span className="input-group-addon"><i className="fa fa-check"></i></span>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Estado:</label>
                                    { this.displayEstados(task.estado) }
                                </div>
                            </div>
                        </div>
                        <div className="row" style={rowStyle}>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>Descripción:</label>
                                    {
                                        task.estado==="Sin asignar"?
                                        <textarea className="form-control" rows="3" value={this.state.descripcion} placeholder="Entre ..." onChange={this.handleChange} name="descripcion"></textarea>
                                        :
                                        <textarea disabled className="form-control" rows="3" value={this.state.descripcion} placeholder="Entre ..." onChange={this.handleChange} name="descripcion"></textarea>    
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row" style={rowStyle}>
                            <div className="col-md-6">
                                <h4>Adjuntos:</h4>
                                {
                                    task.adjuntos.map(adjunto=>{
                                        let dir=this.state.server+"/donwload/"+adjunto;
                                        return(
                                            <p className="filename">
                                                <a href={dir}>{adjunto}</a><button className="btn btn-danger btn-xs" onClick={(e)=>{this.eliminarAdjunto(e,adjunto)}} style={{marginLeft:'1%'}} data-toggle="tooltip" title="Eliminar Adjunto"><i className="fa fa-trash-o"></i></button>
                                            </p>
                                        )
                                    })
                                }
                            </div>
                            <div className="col-md-6">
                                <Dropzone onDrop={([file])=>{this.uploadFile(file)}}>
                                    {({getRootProps, getInputProps}) => (
                                        <section>
                                            <div {...getRootProps()} className="input-group">
                                                <input {...getInputProps()}/>
                                                <p style={{fontSize:'16px'}}>Arrastre un fichero aquí, o click para seleccionar.</p>
                                            </div>
                                            <aside>
                                            <h4>Nuevos Adjuntos</h4>
                                            <ul>{files}</ul>
                                            </aside>
                                        </section>
                                    )}
                                </Dropzone>
                            </div>
                        </div>
                    </div>
                    <div className="box-footer">
                        <button type="submit" className="btn btn-primary">Aceptar</button>
                    </div>
                </form>
            )
        }
        else{
            return(
                <p className="text-muted" style={{marginLeft:'2%',fontSize:'16px'}}>Cargando...</p>
            )
        }
    }

    handleChange(e){
        const {name,value}=e.target;
        this.setState({
            [name]:value,
            error:null
        });
    }

    handleSubmit(e){
        e.preventDefault();
        let error;
        if((this.state.denominacion=='')||(this.state.descripcion=="")){
            error="Campos obligatorios.";
            this.setState({
                error:error
            });
        }
        else{
            let arradjuntos=[];
            this.state.files.map(file => {
                arradjuntos.push(file.name);
            });
            const { task } = this.props.data;
            if(task){
                task.adjuntos.map(adjunto=>{
                    arradjuntos.push(adjunto);
                })
            }
            if(localStorage.getItem('token')){
                let selfComponent=this;
                this.props.modTaskMutation({
                    variables: {
                        denominacion: this.state.denominacion,
                        descripcion:this.state.descripcion,
                        id:this.props.match.params.id,
                        estado:this.state.estado,
                        adjuntos:arradjuntos,
                    }
                }).then(function(){
                    selfComponent.props.history.push('/usermain');
                });
            }
            else
                this.props.history.push('/');
        }
    }

    render(){
        const containerStyle={
            height: '575px'
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

        return(
            <div className="container" style={containerStyle}>
                <ol className="breadcrumb">
                    <li><Link to="/"><i className="fa fa-dashboard"></i> Inicio</Link></li>
                    <li><Link to="/usermain">Tareas</Link></li>
                    <li className="active">Modificar Tarea</li>
                </ol>
                <div className="row">
                    <div className="col-md-8">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Modificar Tarea</h3>
                            </div>
                            {this.displayContent()}
                        </div>
                    </div>
                </div>
                <NotificationSystem ref={this.notificationSystem} style={style}/>
            </div>
        )
    }
}

export default compose(
    graphql(getTaskQuery, {
        options: (props) => {
            return {
                variables: {
                    id: props.match.params.id
                }
            }
        }
    }),
    graphql(modTaskMutation, { name: "modTaskMutation" }),
    graphql(deleteAdjuntoMutation, { name: "deleteAdjuntoMutation" }),
    graphql(uploadFileMutation, { name: "uploadFileMutation" })
)(EditTask);