import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import { addTaskMutation } from '../queries/task';
import { uploadFileMutation } from '../queries/file';
import { getCategoriesQuery } from '../queries/category';
import Dropzone from 'react-dropzone';
import NotificationSystem from 'react-notification-system';
import { deleteInitAdjuntoMutation } from '../queries/task';

class AddTask extends Component{
    constructor(props,context){
        super(props,context);

        this.onDrop = (files) => {
            this.setState({files})
        }
         
        this.state={
            denominacion:'',
            descripcion:'',
            categoria:null,
            adjuntos:[],
            error:null,
            files: []
        };

        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.uploadFile=this.uploadFile.bind(this);
        this.displayCategories=this.displayCategories.bind(this);
        this.eliminarAdjunto=this.eliminarAdjunto.bind(this);

        this.notificationSystem= React.createRef();
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
        if((this.state.denominacion=='')||(this.state.descripcion=="")||(this.state.categoria=="")){
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
                let props=this.props;
                this.props.addTaskMutation({
                    variables: {
                        denominacion: this.state.denominacion,
                        descripcion:this.state.descripcion,
                        categoria:this.state.categoria,
                        adjuntos:arradjuntos,
                        usuario:localStorage.getItem('usuario')
                    }
                }).then(function(){
                    window.location.replace('/usermain');
                });
            }
            else
                this.props.history.push('/');
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

    displayCategories(){
        var data = this.props.data;
        if(data.loading){
            return( <option disabled>Loading categories</option> );
        } else {
            if(this.state.categoria===null){
                this.setState({
                    categoria:data.categories[0].id
                })
            }
            return data.categories.map(category => {
                return( <option key={ category.id } value={category.id}>{ category.denominacion }</option> );
            });
        }
    }

    render(){
        const containerStyle={
            height: '575px'
        }

        const rowStyle={
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

        const files = this.state.files.map(file => (
            <li key={file.name}>
              {file.name} - {file.size} bytes <button className="btn btn-danger btn-xs" onClick={(e)=>{this.eliminarAdjunto(e,file.name)}} style={{marginLeft:'1%'}} data-toggle="tooltip" title="Eliminar Adjunto"><i className="fa fa-trash-o"></i></button>
            </li>
          ))

        return(
            <div className="container" style={containerStyle}>
                <ol className="breadcrumb">
                    <li><Link to="/"><i className="fa fa-dashboard"></i> Inicio</Link></li>
                    <li><Link to="/usermain">Tareas</Link></li>
                    <li className="active">Adicionar Tarea</li>
                </ol>
                <div className="row">
                    <div className="col-md-8">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Adicionar Tarea</h3>
                            </div>
                            <form role="form" onSubmit={this.handleSubmit}>
                                <div className="box-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>Título:</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" name="denominacion" onChange={this.handleChange} placeholder="Título"></input>
                                                <span className="input-group-addon"><i className="fa fa-check"></i></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Categoría:</label>
                                                <select className="form-control"  onChange={ (e) => this.setState({ categoria: e.target.value }) }>
                                                    { this.displayCategories() }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" style={rowStyle}>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>Descripción:</label>
                                                <textarea className="form-control" rows="3" placeholder="Entre ..." onChange={this.handleChange} name="descripcion"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
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
    graphql(getCategoriesQuery),
    graphql(addTaskMutation, { name: "addTaskMutation" }),
    graphql(uploadFileMutation, { name: "uploadFileMutation" }),
    graphql(deleteInitAdjuntoMutation, { name: "deleteInitAdjuntoMutation" }),
)(AddTask);