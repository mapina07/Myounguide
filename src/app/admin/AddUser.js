import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import { addUserMutation } from '../queries/user';
import Popup from 'reactjs-popup';
import NotificationSystem from 'react-notification-system';

class AddUser extends Component{
    constructor(props,context){
        super(props,context);
        
        this.state={
            nombre:'',
            email:'',
            error:null,
            open: false
        };

        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.displaycontent = this.displaycontent.bind(this);
        this.redirectUser = this.redirectUser.bind(this);

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

    redirectUser(){
        this.props.history.push('/users');
        window.location.reload();
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
                        <p>Se ha adicionado el usuario correctamente.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" onClick={()=>{this.redirectUser()}}>Aceptar</button>   
                    </div>
                </div>
            </div>
        )
    }

    handleChange(e){
        const {name,value}=e.target;
        this.setState({
            [name]:value,
            error:null
        });
    }

    openModal(){
        this.setState({ 
            open: true
         })
    }

    closeModal() {
        this.setState({ open: false })
    }

    handleSubmit(e){
        e.preventDefault();
        let error;
        if((this.state.nombre=='')||(this.state.email=="")){
            error="Campos obligatorios.";
            this.setState({
                error:error
            });
        }
        else{
            let selfComponent=this;
            this.props.addUserMutation({
                variables: {
                    nombre: this.state.nombre,
                    email:this.state.email
                }
            }).then(function(response){
                if(response.data.addUser.id)
                    selfComponent.openModal();
                else{
                    error="Error al adicionar usuarios.";
                    this.setState({
                        error:error
                    });
                }
            });
        }
    }

    render(){
        const containerStyle={
            marginTop:'2%',
            height: '550px'
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
                <ol className="breadcrumb">
                    <li><Link to="/"><i className="fa fa-dashboard"></i> Inicio</Link></li>
                    <li><Link to="/users">Usuarios</Link></li>
                    <li className="active">Adicionar Usuario</li>
                </ol>
                <div className="row">
                    <div className="col-md-8">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Adicionar Usuario</h3>
                            </div>
                            <form role="form" onSubmit={this.handleSubmit}>
                                <div className="box-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>Nombre:</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" name="nombre" onChange={this.handleChange} placeholder="Nombre"></input>
                                                <span className="input-group-addon"><i className="fa fa-file-text-o"></i></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label>Correo Electrónico:</label>
                                            <div className="input-group">
                                                <input type="email" className="form-control" name="email" onChange={this.handleChange} placeholder="Correo"></input>
                                                <span className="input-group-addon"><i className="fa fa-envelope-o"></i></span>
                                            </div>
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
                <Popup
                    open={this.state.open}
                    closeOnDocumentClick={false}
                    onClose={this.closeModal}
                    contentStyle={contentModalStyle}
                    children={this.displaycontent}
                    >
                </Popup>
                <NotificationSystem ref={this.notificationSystem} style={style}/>
            </div>
        )
    }
}

export default compose(
    graphql(addUserMutation, { name: "addUserMutation" })
)(AddUser);