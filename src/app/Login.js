import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import { withRouter,Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import NotificationSystem from 'react-notification-system';

class Login extends Component{
    constructor(props,context){
        super(props,context);
        
        this.state={
            username:'',
            password:'',
            error:null
        };

        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.responseFacebook=this.responseFacebook.bind(this);

        this.notificationSystem= React.createRef();
    }

    componentDidMount(){
        const notification = this.notificationSystem.current;
        if(this.props.error){
            notification.addNotification({
                message: this.props.error,
                level: 'error',
                position:'br'
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

    handleChange(e){
        const {name,value}=e.target;
        this.setState({
            [name]:value,
            error:null
        });
    }

    handleSubmit(e){
        e.preventDefault();
        //Validation on input
        let error=null;
        if((this.state.username=='')||(this.state.password=="")){
            error="Campos obligatorios.";
            this.setState({
                error:error
            });
        }
        else{
            this.props.onAuth(this.state.username,this.state.password);
            this.props.history.push('/');
        }
    }

    responseFacebook(response){
        this.props.onAuthFacebook(response);
        this.props.history.push('/');
    }

    render(){
        const divStyle = {
            marginBottom: '5%',
        };

        const question2 = {
            marginBottom: '5%',
            marginTop:'5%'
        };

        const mainrow = {
            marginLeft: '17%',
            marginTop:'10%'
        };

        const mediumcol = {
            marginTop: '15%'
        };

        const containerStyle={
            height: '575px'
        }

        const socialStyle={
            marginBottom:'8%'
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
                <div className="login-logo">
                    Acceder a MyOunGuide
                </div>
                <div className="row" style={mainrow}>
                    <div className="col-md-4">
                        <div className="login-box-body">
                            <p className="login-box-msg" style={socialStyle}>Entre con su cuenta social:</p>
                            <div className="social-auth-links text-center">
                                <FacebookLogin
                                    appId="1921670931295869"
                                    fields="name,email,picture"
                                    callback={this.responseFacebook}
                                    cssClass="btn btn-block btn-social btn-facebook btn-flat"
                                    icon="fa-facebook"
                                    language="es_ES"
                                    buttonText="Login With Facebook"
                                    render={renderProps => (
                                        <button className="btn btn-block btn-social btn-facebook btn-flat" onClick={renderProps.onClick}><i className="fa fa-facebook"></i>Login con Facebook</button>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-1" style={mediumcol}>
                        <div className="login-box-body">
                            <p>O</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="login-box-body">
                            <p className="login-box-msg">Entre con su correo electrónico y contraseña:</p>
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group has-feedback">
                                    <input type="email" value={this.state.value} title="It must be in email format. Include @." name="username" onChange={this.handleChange} className="form-control" placeholder="Correo"></input>
                                    <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
                                </div>
                                <div className="form-group has-feedback">
                                    <input type="password" name="password" onChange={this.handleChange} className="form-control" placeholder="Contraseña"></input>
                                    <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="pull-right" style={divStyle} ><a>¿Haz olvidado tu contraseña?</a></div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <button type="submit" className="btn btn-primary btn-block btn-flat">Entrar</button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="pull-right" style={question2}>¿Aún no tienes una cuenta? <Link to="/typeregister">Regístrate</Link></div>
                                    </div>
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

const mapDispatchToProps=dispatch=>{
    return{
        onAuth:(username,password)=>dispatch(actions.authLogin(username,password)),
        onAuthFacebook:(response)=>dispatch(actions.authLoginFacebook(response))
    }
}

const mapStateToProps=state=>{
    return{
        state:state,
        loading: state.loading,
        error:state.error,
        errorRegister:state.errorRegister
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Login));