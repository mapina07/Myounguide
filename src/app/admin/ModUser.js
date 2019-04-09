import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql,compose } from 'react-apollo';
import { getUserQuery,modUserMutation } from '../queries/user';
import NotificationSystem from 'react-notification-system';
import Popup from 'reactjs-popup';

class ModUser extends Component{
    constructor(props,context){
        super(props,context);
        
        this.state={
            nombre:null,
            email:'',
            rol:'',
            error:null,
            open: false
        };

        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.getUser=this.getUser.bind(this);
        this.notificationSystem= React.createRef();
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.displaycontent = this.displaycontent.bind(this);
        this.redirectUser = this.redirectUser.bind(this);
    }

    redirectUser(){
        this.props.history.push('/users');
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
                        <p>Se ha modificado el usuario correctamente.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" onClick={()=>{this.redirectUser()}}>Aceptar</button>   
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

    closeModal() {
        this.setState({ open: false })
    }

    handleChange(e){
        const {name,value}=e.target;
        this.setState({
            [name]:value
        });
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

    handleSubmit(e){
        e.preventDefault();
        let error;
        if((this.state.nombre=='')||(this.state.email=="")||(this.state.rol=="")){
            error="Campos obligatorios.";
            this.setState({
                error:error
            });
        }
        else{
            let selfComponent=this;
            this.props.modUserMutation({
                variables: {
                    id:this.props.match.params.id,
                    nombre: this.state.nombre,
                    email:this.state.email,
                    rol:this.state.rol
                }
            }).then(function(response){
                if(response.data.updateUser.id)
                    selfComponent.openModal();
                else{
                    error="Error al modificar usuarios.";
                    this.setState({
                        error:error
                    });
                }
            });
        }
    }

    getUser(){
        const { user } = this.props.data;
        if(user){
            return user;
        }
        else
            return null;
    }

    render(){
        const user=this.getUser();
        if(user){
            if(this.state.nombre===null){
                this.setState({
                    nombre:user.nombre,
                    email:user.email,
                    rol:user.rol
                });
            }
        }

        const containerStyle={
            marginTop:'2%',
            height: '550px'
        }

        const rowStyle={
            marginTop:'1%'
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
                    <li><Link to="/users">Usuarios</Link></li>
                    <li className="active">Modificar Usuario</li>
                </ol>
                <div className="row">
                    <div className="col-md-8">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Modificar Usuario</h3>
                            </div>
                            <form role="form" onSubmit={this.handleSubmit}>
                                <div className="box-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>Nombre:</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" value={this.state.nombre} name="nombre" onChange={this.handleChange} placeholder="Nombre"></input>
                                                <span className="input-group-addon"><i className="fa fa-file-text-o"></i></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label>Correo Electrónico:</label>
                                            <div className="input-group">
                                                <input type="email" className="form-control" value={this.state.email} name="email" onChange={this.handleChange} placeholder="Correo"></input>
                                                <span className="input-group-addon"><i className="fa fa-envelope-o"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" style={rowStyle}>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Rol</label>
                                                <select className="form-control"  value={this.state.rol} onChange={ (e) => this.setState({ rol: e.target.value }) }>
                                                    <option>Seleccione un Rol</option>
                                                    <option>Administrador</option>
                                                    <option>Facilitador</option>
                                                    <option>Usuario</option>
                                                </select>
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
    graphql(getUserQuery, {
        options: (props) => {
            return {
                variables: {
                    id: props.match.params.id
                }
            }
        }
    }),
    graphql(modUserMutation, { name: "modUserMutation" })
)(ModUser);