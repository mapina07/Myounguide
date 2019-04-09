import React from 'react';
import { Route } from 'react-router-dom';
import Login from './Login';
import TypeRegister from './TypeRegister';
import Register from './Register';
import Category from './nomencladores/Category';
import AddCategory from './nomencladores/AddCategory';
import ModCategory from './nomencladores/ModCategory';
import User from './admin/User';
import AddUser from './admin/AddUser';
import ModUser from './admin/ModUser';
import RegisterFac from './RegisterFac';
import AddTask from './operaciones/AddTask';
import Terminos from './Terminos';
import UserMain from './operaciones/UserMain';
import FacMain from './operaciones/FacMain';
import ResponderTask from './operaciones/ResponderTask';
import AboutUs from './AboutUs';
import AdminMain from './operaciones/AdminMain';
import EditTask from './operaciones/EditTask';
import Busqueda from './Busqueda';
import ChangePass from './admin/ChangePass';

const BaseRouter=(props)=>{
    return(
        <div>
            <Route path='/login' component={Login}/>
            <Route path='/register' component={Register}/>
            <Route path='/typeregister' component={TypeRegister}/>
            <Route path='/categories' component={Category}/>
            <Route path='/addcategory' component={AddCategory}/>
            <Route path='/modcategory/:id' component={ModCategory}/>
            <Route path='/users' component={User}/>
            <Route path='/adduser' component={AddUser}/>
            <Route path='/moduser/:id' component={ModUser}/>
            <Route path='/registerfac' component={RegisterFac}/>
            <Route path='/addtask' component={AddTask}/>
            <Route path='/term' component={Terminos}/>
            <Route path='/usermain' render={()=>{return(<UserMain server={props.server} history={props.history}/>)}}/>
            <Route path='/facmain' render={()=>{return(<FacMain server={props.server} history={props.history}/>)}}/>
            <Route path='/respondertask/:idtask' component={ResponderTask}/>
            <Route path='/aboutus' component={AboutUs}/>
            <Route path='/adminmain' component={AdminMain}/>
            <Route path='/modtask/:id' component={EditTask}/>
            <Route path='/busqueda/:value' component={Busqueda}/>
            <Route path='/changepass' component={ChangePass}/>
        </div>
    )
};

export default BaseRouter;