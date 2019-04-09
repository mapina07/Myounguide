import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { getUsersQuery,deleteUserMutation } from '../queries/user';
import { graphql, compose } from 'react-apollo';
import Popup from 'reactjs-popup';

class User extends Component{
    constructor(props,context){
        super(props,context);
        
        this.state={
            open: false,
            openNotif: false,
            loading:false,
            idfila:"",
            error:null
        };

        this.deleteUser=this.deleteUser.bind(this);
        this.displayusers=this.displayusers.bind(this);
        this.modFormatter=this.modFormatter.bind(this);
        this.deleteFormatter=this.deleteFormatter.bind(this);
        this.adduser=this.adduser.bind(this);
        this.openModal = this.openModal.bind(this);
        this.openModalNotif = this.openModalNotif.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.displaycontent = this.displaycontent.bind(this);
        this.displaycontentNotif = this.displaycontentNotif.bind(this);
    }

    openModal(idfila){
        this.setState({ 
            open: true,
            idfila:idfila
         })
    }

    openModalNotif(){
        this.setState({ 
            openNotif: true
         })
    }

    closeModal() {
        this.setState({ open: false })
    }

    adduser(e){
        e.preventDefault();
        this.props.history.push('/adduser');
    }

    displayusers(){
        var data = this.props.data;
        if(data.loading){
           return [];
        } else {
            const arrUsers=[];
            data.users.map(user => {
                var fila={
                    'id':user.id,
                    'nombre':user.nombre,
                    'email':user.email,
                    'rol':user.rol
                };
                arrUsers.push(fila);
            })
           return arrUsers;
        }
    }

    deleteUser(id){
        let selfComponent=this;
        this.props.deleteUserMutation({
            variables: {
                id: id
            }
        }).then(function(response){
            if(response.data.deleteUser.id){
                selfComponent.openModalNotif();
            }
            else{
                error="Error al eliminar usuarios.";
                this.setState({
                    error:error
                });
            }
        });
    }

    modFormatter(cell, row) {
        if((row.rol==="Usuario")||(row.rol==="Facilitador")){
            return (
                <center><i className="fa fa-ban"></i></center>
              );
        }
        else{
            return (
                <center><a data-toggle="tooltip" title="Modificar"><i className="fa fa-edit"></i></a></center>
            );
        }
    }

    deleteFormatter(cell, row) {
        return (
            <center><a data-toggle="tooltip" title="Eliminar"><i className="fa fa-trash-o"></i></a></center>
            );
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
                        <button type="button" className="btn btn-success" onClick={()=>{this.deleteUser(this.state.idfila)}}>Aceptar</button>   
                    </div>
                </div>
            </div>
        )
    }

    displaycontentNotif(){
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
                        <p>Se ha eliminado el usuario correctamente.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" onClick={()=>{window.location.reload();}}>Aceptar</button>   
                    </div>
                </div>
            </div>
        )
    }

    render(){
        const columns = [{
                dataField: 'id',
                text: 'Id',
                hidden: true
            },{
                dataField: 'nombre',
                text: 'Nombre y Apellidos'
            },{
                dataField: 'email',
                text: 'Correo Electrónico'
            },{
                dataField: 'rol',
                text: 'Rol'
            },{
                dataField: 'modificar',
                text: '',
                formatter: this.modFormatter,
                events: {
                    onClick: (e, column, columnIndex, row, rowIndex) => {
                        if(columnIndex==3){
                            if((row.rol!=="Usuario")&&(row.rol!=="Facilitador")){
                                if(localStorage.getItem('token'))
                                    this.props.history.push('/moduser/'+row.id);
                                else
                                    this.props.history.push('/');
                            }
                        }                       
                    }
                }
            },{
                dataField: 'eliminar',
                text: '',
                formatter: this.deleteFormatter,
                events: {
                    onClick: (e, column, columnIndex, row, rowIndex) => {
                        if(columnIndex==4){
                            if(localStorage.getItem('token'))
                                this.openModal(row.id); 
                            else
                                this.props.history.push('/');
                        }                    
                    }
                }
        }];
        
        const containerStyle={
            height: '585px'
        }

        const iconStyle={
            marginRight:'5%'
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
                    <div className="col-md-6">
                        <div className="box box-primary box-solid">
                            <div className="box-header with-border">
                                <h4 className="box-title">Listado de Usuarios</h4>
                                <div className="box-tools pull-right">
                                    <button type="button" className="btn btn-box-tool" data-toggle="tooltip" title="Adicionar" onClick={this.adduser}>
                                    <i className="fa fa-plus" style={iconStyle}></i>Adicionar</button>
                                </div>
                            </div>
                            <div className="panel-body">
                                <BootstrapTable keyField="id" data={ this.displayusers() } columns={ columns } pagination={ paginationFactory() }/>
                            </div>
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
                    open={this.state.openNotif}
                    closeOnDocumentClick={false}
                    contentStyle={contentModalStyle}
                    children={this.displaycontentNotif}
                    >
                </Popup>
            </div>
        )
    }
}

export default compose(
    graphql(getUsersQuery),
    graphql(deleteUserMutation, { name: "deleteUserMutation" })
)(User); 