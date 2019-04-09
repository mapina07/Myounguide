import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getTaskQuery } from '../queries/task';
import { graphql,compose } from 'react-apollo';
import NotificationSystem from 'react-notification-system';
import { addRespuestaMutation } from '../queries/respuesta';
import { uploadFileMutation } from '../queries/file';
import { deleteInitAdjuntoMutation } from '../queries/task';
import Dropzone from 'react-dropzone';

class ResponderTask extends Component{
    constructor(props,context){
        super(props,context);

        this.onDrop = (files) => {
            this.setState({files})
        }

        this.state={
            texto:'',
            error:null,
            files: []
        };

        this.getTask=this.getTask.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.notificationSystem= React.createRef();
        this.handleSubmit=this.handleSubmit.bind(this);
        this.uploadFile=this.uploadFile.bind(this);
        this.eliminarAdjunto=this.eliminarAdjunto.bind(this);
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
        if(this.state.texto==''){
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
            if(localStorage.getItem('token')){
                this.props.addRespuestaMutation({
                    variables: {
                        texto: this.state.texto,
                        usuario:localStorage.getItem('usuario'),
                        tarea:this.props.match.params.idtask,
                        adjuntos:arradjuntos
                    }
                });
                if(localStorage.getItem('rol')==="Facilitador")
                    this.props.history.push('/facmain');
                else
                    this.props.history.push('/usermain');
            }
            else
                this.props.history.push('/');
        }
    }

    getTask(){
        const { task } = this.props.data;
        if(task){
            return task.denominacion;
        }
        else
            return "";
    }

    eliminarAdjunto(e,adjunto){
        e.preventDefault();
        let selfComponent=this;
        this.props.deleteInitAdjuntoMutation({
            variables: {
                adjunto: adjunto
            }
        }).then(function(){
            let arrAdjuntos=selfComponent.state.files;
            for(var i=0; i< arrAdjuntos.length; i++){ 
                if (arrAdjuntos[i].name === adjunto) {
                    arrAdjuntos.splice(i, 1); 
                }
            }
            selfComponent.setState({
                files:arrAdjuntos,
                error:null
            });
        });
    }

    render(){
        const containerStyle={
            marginTop:'2%',
            height: '550px'
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

        const files = this.state.files.map(file => (
            <li key={file.name}>
              {file.name} - {file.size} bytes <button className="btn btn-danger btn-xs" onClick={(e)=>{this.eliminarAdjunto(e,file.name)}} style={{marginLeft:'1%'}} data-toggle="tooltip" title="Eliminar Adjunto"><i className="fa fa-trash-o"></i></button>
            </li>
          ))

        return(

            <div className="container" style={containerStyle}>
                <ol className="breadcrumb">
                    <li><Link to="/"><i className="fa fa-dashboard"></i> Inicio</Link></li>
                    {
                        localStorage.getItem('rol')==="Facilitador"?
                        <li><Link to="/facmain">Tareas</Link></li>
                        :
                        <li><Link to="/usermain">Tareas</Link></li>
                    }
                    <li className="active">Responder Tarea</li>
                </ol>
                <div className="row">
                    <div className="col-md-8">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Responder Tarea: {this.getTask()}</h3>
                            </div>
                            <form role="form" onSubmit={this.handleSubmit}>
                                <div className="box-body">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>Respuesta:</label>
                                                <textarea className="form-control" rows="6" placeholder="Entre ..." onChange={this.handleChange} name="texto"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-8">
                                            <Dropzone onDrop={([file])=>{this.uploadFile(file)}}>
                                                {({getRootProps, getInputProps}) => (
                                                    <section>
                                                        <div {...getRootProps()} className="input-group">
                                                            <input {...getInputProps()}/>
                                                            <p style={{fontSize:'16px'}}>Arrastre un fichero aquí, o click para seleccionar.</p>
                                                        </div>
                                                        <aside>
                                                        <h4>Adjuntos</h4>
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
                    id: props.match.params.idtask
                }
            }
        }
    }),
    graphql(addRespuestaMutation, { name: "addRespuestaMutation" }),
    graphql(deleteInitAdjuntoMutation, { name: "deleteInitAdjuntoMutation" }),
    graphql(uploadFileMutation, { name: "uploadFileMutation" })
)(ResponderTask);