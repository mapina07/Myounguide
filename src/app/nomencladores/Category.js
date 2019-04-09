import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import BootstrapTable from 'react-bootstrap-table-next';
import { getCategoriesQuery,deleteCategoryMutation } from '../queries/category';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Popup from 'reactjs-popup';

class Category extends Component{
    constructor(props,context){
        super(props,context);
        
        this.state={
            loading:false,
            open: false,
            openNotif: false,
            error:null
        };

        this.addcategory=this.addcategory.bind(this);
        this.displaycategories=this.displaycategories.bind(this);
        this.modFormatter=this.modFormatter.bind(this);
        this.deleteFormatter=this.deleteFormatter.bind(this);
        this.deleteCategory=this.deleteCategory.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.displaycontent = this.displaycontent.bind(this)
        this.openModalNotif = this.openModalNotif.bind(this);
        this.displaycontentNotif = this.displaycontentNotif.bind(this);
    }

    openModalNotif(){
        this.setState({ 
            openNotif: true
         })
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
                        <p>Se ha eliminado la categoría correctamente.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" onClick={()=>{window.location.reload();}}>Aceptar</button>   
                    </div>
                </div>
            </div>
        )
    }

    addcategory(e){
        e.preventDefault();
        this.props.history.push('/addcategory');
    }

    displaycategories(){
        var data = this.props.data;
        if(data.loading){
           return [];
        } else {
            const arrCategories=[];
            data.categories.map(category => {
                var fila={
                    'id':category.id,
                    'denominacion':category.denominacion
                };
                arrCategories.push(fila);
            })
           return arrCategories;
        }
    }

    openModal (){
        this.setState({ open: true })
    }

    closeModal () {
        this.setState({ open: false })
    }

    deleteCategory(id){
        let selfComponent=this;
        this.props.deleteCategoryMutation({
            variables: {
                id: id
            }
        }).then(function(response){
            if(response.data.deleteCategory.id){
                selfComponent.openModalNotif();
            }
            else{
                error="Error al eliminar categorías.";
                this.setState({
                    error:error
                });
            }
        });
    }

    modFormatter(cell, row) {
        return (
            <center><a data-toggle="tooltip" title="Modificar"><i className="fa fa-edit"></i></a></center>
          );
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
                        <button type="button" className="btn btn-success" onClick={()=>{this.deleteCategory(localStorage.getItem('idfila'));}}>Aceptar</button>
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
                dataField: 'denominacion',
                text: 'Denominacion'
            },{
                dataField: 'modificar',
                text: '',
                formatter: this.modFormatter,
                events: {
                    onClick: (e, column, columnIndex, row, rowIndex) => {
                        if(columnIndex==1)
                            this.props.history.push('/modcategory/'+row.id);                       
                    }
                }
            },{
                dataField: 'eliminar',
                text: '',
                formatter: this.deleteFormatter,
                events: {
                    onClick: (e, column, columnIndex, row, rowIndex) => {
                        if(columnIndex==2){
                            localStorage.setItem('idfila',row.id);
                            this.openModal();
                        }      
                    }
                }
        }];

        const containerStyle={
            height: '600px'
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
                    <div className="col-md-4">
                        <div className="box box-primary box-solid">
                            <div className="box-header with-border">
                                <h4 className="box-title">Listado de Categorías</h4>
                                <div className="box-tools pull-right">
                                    <button type="button" className="btn btn-box-tool" data-toggle="tooltip" title="Adicionar" data-widget="chat-pane-toggle" onClick={this.addcategory}>
                                    <i className="fa fa-plus" style={iconStyle}></i>Adicionar</button>
                                </div>
                            </div>
                            <div className="panel-body">
                                <BootstrapTable keyField="id" data={ this.displaycategories() } columns={ columns } pagination={ paginationFactory() }/>
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
    graphql(getCategoriesQuery),
    graphql(deleteCategoryMutation, { name: "deleteCategoryMutation" })
)(Category);