import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import { getCategoriesQuery } from './queries/category';
import Popup from 'reactjs-popup';

class RegisterFac extends Component{
    constructor(props,context){
        super(props,context);
        
        this.state={
            email:'',
            password:'',
            error:null,
            name:'',
            checkbox:false,
            repassword:'',
            listcategory:[],
            open: false
        };

        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleInputChange=this.handleInputChange.bind(this);
        this.handleSelectChange=this.handleSelectChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.displaycontent = this.displaycontent.bind(this);
    }

    openModal (){
        this.setState({ open: true })
    }

    closeModal() {
        this.setState({ open: false })
    }

    displaycontent(){
        const modalStyle={
            width:'100%',
            maxHeight:'450px',
            overflowY: 'scroll'
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
                        <h4 className="modal-title">Términos y Condiciones</h4>
                    </div>
                    <div className="modal-body">
                        <p>La presente Política de Privacidad establece los términos en que Myguide usa y protege la información que es proporcionada por sus usuarios al momento de utilizar su sitio web. Esta compañía está comprometida con la seguridad de los datos de sus usuarios. Cuando le pedimos llenar los campos de información personal con la cual usted pueda ser identificado, lo hacemos asegurando que sólo se empleará de acuerdo con los términos de este documento. Sin embargo esta Política de Privacidad puede cambiar con el tiempo o ser actualizada por lo que le recomendamos y enfatizamos revisar continuamente esta página para asegurarse que está de acuerdo con dichos cambios.</p>
                        <dl>
                            <dt>Información que es recogida en </dt>
                            <dd>Nuestro sitio web podrá recoger información personal por ejemplo: Nombre,  información de contacto como  su dirección de correo electrónica e información demográfica. Así mismo cuando sea necesario podrá ser requerida información específica para procesar algún pedido o realizar una entrega o facturación.</dd>
                            <br></br>
                            <dt>Uso de la información recogida</dt>
                            <dd>Nuestro sitio web emplea la información con el fin de proporcionar el mejor servicio posible, particularmente para mantener un registro de usuarios, de pedidos en caso que aplique, y mejorar nuestros productos y servicios.  Es posible que sean enviados correos electrónicos periódicamente a través de nuestro sitio con ofertas especiales, nuevos productos y otra información publicitaria que consideremos relevante para usted o que pueda brindarle algún beneficio, estos correos electrónicos serán enviados a la dirección que usted proporcione y podrán ser cancelados en cualquier momento. Myguide está altamente comprometido para cumplir con el compromiso de mantener su información segura. Usamos los sistemas más avanzados y los actualizamos constantemente para asegurarnos que no exista ningún acceso no autorizado.</dd>
                            <br></br>
                            <dt>Cookies</dt>
                            <dd>Una cookie se refiere a un fichero que es enviado con la finalidad de solicitar permiso para almacenarse en su ordenador, al aceptar dicho fichero se crea y la cookie sirve entonces para tener información respecto al tráfico web, y también facilita las futuras visitas a una web recurrente. Otra función que tienen las cookies es que con ellas las web pueden reconocerte individualmente y por tanto brindarte el mejor servicio personalizado de su web. Nuestro sitio web emplea las cookies para poder identificar las páginas que son visitadas y su frecuencia. Esta información es empleada únicamente para análisis estadístico y después la información se elimina de forma permanente. Usted puede eliminar las cookies en cualquier momento desde su ordenador. Sin embargo las cookies ayudan a proporcionar un mejor servicio de los sitios web, estás no dan acceso a información de su ordenador ni de usted, a menos de que usted así lo quiera y la proporcione directamente. Usted puede aceptar o negar el uso de cookies, sin embargo la mayoría de navegadores aceptan cookies automáticamente pues sirve para tener un mejor servicio web. También usted puede cambiar la configuración de su ordenador para declinar las cookies. Si se declinan es posible que no pueda utilizar algunos de nuestros servicios.</dd>
                            <br></br>
                            <dt>Enlaces a Terceros</dt>
                            <dd>Este sitio web pudiera contener en laces a otros sitios que pudieran ser de su interés. Una vez que usted de clic en estos enlaces y abandone nuestra página, ya no tenemos control sobre al sitio al que es redirigido y por lo tanto no somos responsables de los términos o privacidad ni de la protección de sus datos en esos otros sitios terceros. Dichos sitios están sujetos a sus propias políticas de privacidad por lo cual es recomendable que los consulte para confirmar que usted está de acuerdo con estas.</dd>
                            <br></br>
                            <dt>Control de su información personal</dt>
                            <dd>En cualquier momento usted puede restringir la recopilación o el uso de la información personal que es proporcionada a nuestro sitio web.  Cada vez que se le solicite rellenar un formulario, como el de alta de usuario, puede marcar o desmarcar la opción de recibir información por correo electrónico.  En caso de que haya marcado la opción de recibir nuestro boletín o publicidad usted puede cancelarla en cualquier momento.</dd>
                            <dd>Esta compañía no venderá, cederá ni distribuirá la información personal que es recopilada sin su consentimiento, salvo que sea requerido por un juez con un orden judicial. Myguide Se reserva el derecho de cambiar los términos de la presente Política de Privacidad en cualquier momento.</dd>
                        </dl>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={()=>{this.closeModal()}}>Cancelar</button>   
                    </div>
                </div>
            </div>
        )
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSelectChange(e){
        var options = e.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
            value.push(options[i].value);
            }
        }
        this.setState({
            listcategory:value
        });
    }

    displayCategories(){
        var data = this.props.getCategoriesQuery;
        if(data.categories){
            return data.categories.map(category => {
                return( <option key={ category.id } value={category.id}>{ category.denominacion }</option> );
            });
        }
        else{
            return( <option disabled>No se encuentran.</option> );
        }
    }

    handleSubmit(e){
        e.preventDefault();
        let error=null;
        if((this.state.email=='')||(this.state.email=="")||(this.state.password=="")){
            error="Campos obligatorios.";
        }
        else if(this.state.password !== this.state.repassword){
            error="Passwords must be equals.";
        }
        else if(!this.state.checkbox){
            error="Debe aceptar los términos y condiciones.";
        }
        else if(this.state.listcategory.length==0){
            error="Debe seleccionar al menos una categoría.";
        }
        if(error){
            this.setState({
                error:error
            });
        }
        else{
            this.props.onSingupFac(this.state.email,this.state.password,this.state.name,this.state.listcategory);
            this.props.history.push('/');
        }
    }

    render(){
        let errorMessage=null;
        if(this.state.error){
            errorMessage=(
                <div className="alert alert-danger alert-dismissible">
                    {this.state.error}
                </div>
            );
        }
        else if(this.props.errorRegister){
            errorMessage=(
                <div className="alert alert-danger alert-dismissible">
                    {this.props.errorRegister}
                </div>
            );
        }

        const containerStyle={
            height: '150%'
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
                {errorMessage}
                <div className="register-box">
                    <div className="register-logo">
                        Acces to MyOunGuide
                    </div>
                    <div className="register-box-body">
                        <p className="login-box-msg">Regístrece con su correo electrónico y su contraseña:</p>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group has-feedback">
                                <input type="text" value={this.state.value} name="name" className="form-control" placeholder="Nombre Completo" onChange={this.handleInputChange}></input>
                                <span className="glyphicon glyphicon-user form-control-feedback"></span>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="email" name="email" value={this.state.value} title="It must be in email format. Include @." onChange={this.handleInputChange} className="form-control" placeholder="Email"></input>
                                <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="password" name="password" onChange={this.handleInputChange} className="form-control" placeholder="Contraseña"></input>
                                <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="password" name="repassword" onChange={this.handleInputChange} className="form-control" placeholder="Repita contraseña"></input>
                                <span className="glyphicon glyphicon-log-in form-control-feedback"></span>
                            </div>
                            <div className="form-group">
                                <label>Categorías:</label>
                                <select multiple className="form-control" onChange={ this.handleSelectChange }>
                                    { this.displayCategories() }
                                </select>
                            </div>
                            <div className="row">
                                <div className="col-xs-8">
                                    <div className="checkbox">
                                        <label>
                                            <input type="checkbox" name="checkbox" onChange={this.handleInputChange}></input> De acuerdo con los <a onClick={(e)=>{this.openModal()}}>términos</a>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <button type="submit" className="btn btn-primary btn-block btn-flat">Register</button>
                                </div>
                            </div>
                        </form>
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
            </div>
        )
    }
}

const mapDispatchToProps=dispatch=>{
    return{
        onSingupFac:(email,password,name,listcategory)=>dispatch(actions.authRegisterFac(email,password,name,listcategory))
    }
}

export default withRouter(connect(null,mapDispatchToProps)(
    compose(
    graphql(getCategoriesQuery, { name: "getCategoriesQuery" })
)(RegisterFac)));