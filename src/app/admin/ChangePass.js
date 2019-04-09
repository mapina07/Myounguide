import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import { graphql,compose } from 'react-apollo';
import { changePassMutation } from '../queries/user';

class ChangePass extends Component{
    constructor(props,context){
        super(props,context);
        
        this.state={
            password:'',
            error:null,
            repassword:''
        };

        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleInputChange=this.handleInputChange.bind(this);
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

    handleSubmit(e){
        e.preventDefault();
        let error=null;
        if((this.state.repassword=="")||(this.state.password=="")){
            error="Campos obligatorios.";
        }
        else if(this.state.password !== this.state.repassword){
            error="Las contraseñas deben ser iguales.";
        }
        if(error){
            this.setState({
                error:error
            });
        }
        else{
            let props=this.props;
            this.props.changePassMutation({
                variables: {
                    usuario:localStorage.getItem('usuario'),
                    password: this.state.password
                }
            }).then(function(){
                props.history.push('/');
            });
        }
    }

    handleInputChange(e) {
        const {name,value}=e.target;
        this.setState({
            [name]:value,
            error:null
        });
    }

    render(){
        const containerStyle={
            height: '615px'
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
                <div className="register-box">
                    <div className="register-box-body">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group has-feedback">
                                <input type="password" name="password" onChange={this.handleInputChange} className="form-control" placeholder="Contraseña"></input>
                                <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="password" name="repassword" onChange={this.handleInputChange} className="form-control" placeholder="Repita contraseña"></input>
                                <span className="glyphicon glyphicon-log-in form-control-feedback"></span>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <button type="submit" className="btn btn-primary btn-block btn-flat">Aceptar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <NotificationSystem ref={this.notificationSystem} style={style}/>
            </div>
        )
    }
}

export default compose(
    graphql(changePassMutation, { name: "changePassMutation" })
)(ChangePass);