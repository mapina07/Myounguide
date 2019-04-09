import React, { Component } from 'react';
import { Link,withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';
import { getTasksQuery } from '../queries/task';
import { graphql, compose } from 'react-apollo';

class HeaderBar extends Component{
    constructor(props,context){
        super(props,context);

        this.state={
            nombre:'',
            rol:'',
            busqueda:''
        }

        this.actionlogout=this.actionlogout.bind(this);
        this.cantidadTareas=this.cantidadTareas.bind(this);
        this.handleKeyPress=this.handleKeyPress.bind(this);
    }

    handleKeyPress(e){
        if (e.key === 'Enter') {
            const {value}=e.target;
            this.props.history.push('/busqueda/'+value);
          }
    }

    componentWillReceiveProps(){
        this.setState({
            nombre:localStorage.getItem('nombre'),
            rol:localStorage.getItem('rol')
        })
    }

    cantidadTareas(){
        var { tasks } = this.props.data;
        if(tasks){
            let contador=0;
            tasks.map(task=>{
                if(task!==null)
                    contador++;
            });
            return contador;
        }
        else
            return 0;
    }

    actionlogout(){
        this.props.logout();
        this.props.history.push('/');
    }

    render() {
        const navStyle={
            marginLeft:'20%'
        }

        const rol=localStorage.getItem('rol');

        return (
            <div>
                <header className="main-header">
                    {/* Header Navbar: style can be found in header.less */}
                    <nav className="navbar navbar-static-top">
                        <div className="container">
                            <div className="navbar-header">
                                <Link to="/" className="navbar-brand"><b>MyOun</b>Guide</Link>
                                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse">
                                    <i className="fa fa-bars"></i>
                                </button>
                            </div>
                            <div className="collapse navbar-collapse pull-left" id="navbar-collapse">
                                <form className="navbar-form navbar-left" role="search">
                                    <div className="input-group">
                                        <input type="text" className="form-control" name="busqueda" onKeyPress={this.handleKeyPress} placeholder="Buscar Expertos"></input>
                                        <span className="input-group-addon"><i className="fa fa-search"></i></span>
                                    </div>
                                </form>
                            </div>
                            <div className="navbar-custom-menu">
                                {
                                    this.props.isAuthenticated ?
                                    <ul className="nav navbar-nav">
                                        {
                                            rol==='Usuario'?
                                            <li className="dropdown tasks-menu">
                                                <Link to="/usermain">
                                                    <i className="fa fa-flag-o"></i>
                                                    <span className="label label-danger">{this.cantidadTareas()}</span>
                                                </Link>
                                            </li>
                                            :
                                            <></>
                                        }
                                        {
                                            rol==='Facilitador'?
                                            <li className="dropdown tasks-menu">
                                                <Link to="/facmain">
                                                    <i className="fa fa-flag-o"></i>
                                                    <span className="label label-danger">{this.cantidadTareas()}</span>
                                                </Link>
                                            </li>
                                            :
                                            <></>
                                        }
                                        <li className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">Idioma <span className="caret"></span></a>
                                            <ul className="dropdown-menu" role="menu">
                                                <li><a>Español</a></li>
                                            </ul>
                                        </li>
                                        <li className="dropdown user user-menu">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                                <img src="img/user.png" className="user-image" alt="User Image" />
                                                <span className="hidden-xs">{this.state.nombre}</span>
                                            </a>
                                            <ul className="dropdown-menu">
                                                {/* User image */}
                                                <li className="user-header">
                                                    <img src="img/user.png" className="img-circle" alt="User Image" />
                                                    <p>
                                                        {this.state.nombre} - {this.state.rol}
                                                    </p>
                                                </li>
                                                {/* Menu Footer */}
                                                <li className="user-footer">
                                                    <div className="pull-left">
                                                        <Link to="/changepass" className="btn btn-default btn-flat">Cambiar Contraseña</Link>
                                                    </div>
                                                    <div className="pull-right">
                                                        <a href="#" className="btn btn-default btn-flat" onClick={this.actionlogout}>Salir</a>
                                                    </div>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                    :
                                    <ul className="nav navbar-nav">
                                        <li className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">Idioma <span className="caret"></span></a>
                                            <ul className="dropdown-menu" role="menu">
                                                <li><a>Español</a></li>
                                            </ul>
                                        </li>
                                        <li><Link to="/login">Login</Link></li>
                                        <li><Link to="/typeregister">Registro</Link></li>
                                    </ul>
                                }
                            </div>
                        </div>
                    </nav>
                </header>
                <div className="nav" >
                    <div className="container">
                        <div className="navbar-custom-menu" style={navStyle}>
                            {
                                this.props.isAuthenticated ?
                                <ul className="nav navbar-nav">
                                    {
                                        rol==='Usuario'?
                                        <li><Link to="/addtask"><i className="fa fa-tasks" ></i> Adicionar Tarea</Link></li>
                                        :
                                        <></>
                                    }
                                    {
                                        rol==='Usuario'?
                                        <li>
                                            <Link to="/usermain">
                                                <i className="fa fa-flag-o"></i> Tareas
                                            </Link>
                                        </li>
                                        :
                                        <></>
                                    }
                                    {
                                        rol==='Facilitador'?
                                        <li>
                                            <Link to="/facmain">
                                                <i className="fa fa-flag-o"></i> Tareas
                                            </Link>
                                        </li>
                                        :
                                        <></>
                                    }
                                    {
                                        rol==='Administrador'?
                                        <li className="dropdown" >
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="fa fa-gears" ></i> Administrar<span className="caret"></span></a>
                                            <ul className="dropdown-menu" role="menu">
                                                <li><Link to="/categories">Categoría</Link></li>
                                                <li><Link to="/users">Usuarios</Link></li>
                                            </ul>
                                        </li>
                                        :
                                        <></>
                                    }
                                    {
                                        rol==='Administrador'?
                                        <li>
                                            <Link to="/adminmain">
                                                <i className="fa fa-flag-o"></i> Tareas
                                            </Link>
                                        </li>
                                        :
                                        <></>
                                    }
                                    <li><a><i className="fa fa-newspaper-o" ></i> Como funciona</a></li>
                                    <li><a><i className="fa fa-question" ></i> Ayuda</a></li>
                                </ul>
                                :
                                <ul className="nav navbar-nav">
                                    <li><a><i className="fa fa-newspaper-o" ></i> Como funciona</a></li>
                                    <li><a><i className="fa fa-question" ></i> Ayuda</a></li>
                                </ul>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps=dispatch=>{
    return{
        logout:()=>dispatch(actions.logout())
    }
}

export default withRouter(connect(null,mapDispatchToProps)(compose(
    graphql(getTasksQuery, {
        options: (props) => {
            return {
                variables: {
                    usuario: localStorage.getItem('usuario')
                }
            }
        }
    })
)(HeaderBar)));