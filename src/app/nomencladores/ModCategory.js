import React, { Component } from 'react';
import { graphql,compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import { getCategoryQuery,updateCategoryMutation } from '../queries/category';
import Popup from 'reactjs-popup';
import NotificationSystem from 'react-notification-system';

class ModCategory extends Component{
    constructor(props,context){
        super(props,context);
        
        this.state={
            denominacion:null,
            error:null,
            open: false
        };

        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.getCategory=this.getCategory.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.displaycontent = this.displaycontent.bind(this);
        this.redirectCategory = this.redirectCategory.bind(this);
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

    redirectCategory(){
        this.props.history.push('/categories');
    }

    openModal(){
        this.setState({ 
            open: true
        })
    }

    closeModal() {
        this.setState({ open: false })
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
                        <p>Se ha modificado la categoría correctamente.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" onClick={()=>{this.redirectCategory()}}>Aceptar</button>   
                    </div>
                </div>
            </div>
        )
    }

    getCategory(){
        const { category } = this.props.data;
        if(category){
            return category.denominacion;
        }
        else
            return "";
    }

    handleChange(e){
        const {name,value}=e.target;
        this.setState({
            [name]:value
        });
    }

    handleSubmit(e){
        e.preventDefault();
        let error;
        if(this.state.denominacion==''){
            error="Campo obligatorio.";
            this.setState({
                error:error
            });
        }
        else{
            let selfComponent=this;
            this.props.updateCategoryMutation({
                variables: {
                    denominacion: this.state.denominacion,
                    id: this.props.match.params.id
                }
            }).then(function(response){
                if(response.data.updateCategory.id)
                    selfComponent.openModal();
                else{
                    error="Error al adicionar usuarios.";
                    this.setState({
                        error:error
                    });
                }
            });
            /* this.props.history.push('/categories'); */
        }
    }

    render(){
        const { id } = this.props.match.params;

        const denominacion=this.getCategory();
        let value="";
        if(this.state.denominacion===null)
            value=denominacion;
        else
            value=this.state.denominacion;

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
                    <li><Link to="/categories">Categorías</Link></li>
                    <li className="active">Modificar Categoría</li>
                </ol>
                <div className="row">
                    <div className="col-md-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Modificar Categoría</h3>
                            </div>
                            <form role="form" onSubmit={this.handleSubmit}>
                                <div className="box-body">
                                    <div className="input-group">
                                        <input type="text" className="form-control" value={value} name="denominacion" onChange={this.handleChange}></input>
                                        <span className="input-group-addon"><i className="fa fa-check"></i></span>
                                    </div>
                                </div>
                                <div className="box-footer">
                                    <button type="submit" className="btn btn-primary">Guardar</button>
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
    graphql(getCategoryQuery, {
        options: (props) => {
            return {
                variables: {
                    id: props.match.params.id
                }
            }
        }
    }),
    graphql(updateCategoryMutation, { name: "updateCategoryMutation" })
)(ModCategory);