import React from 'react';
import {useForm} from "react-hook-form";
import {Button} from "react-bootstrap";
import {useAuth} from '../context/authContext';
import {useNavigate} from 'react-router-dom';

import {
    addDoc,
    getDoc,
    // updateDoc,
    doc,
    collection,
    query,
    where,
    getDocs,
    limit,
    Timestamp,
    DocumentReference,
    FieldValue,
    // orderBy,
  } from "firebase/firestore";
  import { db } from "../firebase";

//swift alert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

function Login() {

    const [error,setError] = React.useState('');
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [perfildoc, setPerfildoc] = React.useState([]);
    
    const {login} = useAuth();
    
    const navigate = useNavigate();
    
    const onSubmit = async(data) => {

        if(data.email !== "" && data.email !== undefined && data.email !== null){

            if(data.password !== "" && data.password !== undefined && data.password !== null){

                try {
                    await login(data.email, data.password);
                    // navigate("/");
                    startSession(data);
                } catch (error) {
                    MySwal.fire({
                        title: "Error",
                        text: error.message === 
                        "Firebase: Error (auth/invalid-email)." ? "El correo no es valido." 
                        : error.message === "Firebase: Error (auth/user-not-found)." ? "El usuario no existe." 
                        : error.message === "Firebase: Error (auth/wrong-password)." ? "La contraseña es incorrecta." : "Error desconocido.",
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                }
            }else{
                MySwal.fire({
                    title: "Error",
                    text: "Debes ingresar una contraseña.",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            }
        } else {
            MySwal.fire({
                title: "Error",
                text: "Debes ingresar un correo.",
                icon: "error",
                confirmButtonText: "Ok",
            });
        }   
    }

    const startSession = async(data) => {

        // verificando que el correo ingresado sea de un conductor o administrador
        const perfilesCollection  = collection(db, "Perfiles");
        const perfilFilter        = query(perfilesCollection, where("administrador", "==", true), where("correo", "==", data.email));
        const perfildoc           = [];
        const perfilesFilterSnap  = getDocs(perfilFilter);

        perfilesFilterSnap.then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                perfildoc.push({
                    id: doc.id,
                    ...doc.data(),
                });
              setPerfildoc(perfildoc);
            });
        }).then(() => {
            if(perfildoc.length > 0){
                console.log("es administrador");
                navigate("/");
            } else {
                console.log("no es administrador");
                MySwal.fire({
                    title: "Error",
                    text: "El Correo Ingresado No Le Pertenece A Ningún Administrador.",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            }
        })
    }
    
    return (
        <body style={{background: '#023262', height: '100vh', fontFamily: ""}}>
            <center>
                    <div className="container">
                        <div>
                            {/* <h1>Login</h1> */}
                            {/* <h1>TUees</h1> */}

                            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>


                            {error && <div className="alert alert-danger">{error}</div>}
                            
                            <form className='form-control mb-2' onSubmit={handleSubmit(onSubmit)}>
                                
                                <h1 style={{margin: '20px'}}>TUees</h1>
                                
                                <table style={{margin: '20px', justifyContent: 'center'}}>
                                    <tr>
                                        <td style={{width: '25%'}}>
                                            <label className="mb-3" style={{marginRight: '20px'}}>Correo: </label>
                                        </td>
                                        <td>
                                            <input className="form-control mb-3" {...register("email")}/>
                                            {errors.email && <span>This field is required</span>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{width: '25%'}}>
                                            <label className="mb-3" style={{marginRight: '20px'}}>Contraseña: </label>
                                        </td>
                                        <td>
                                            <input type="password" className="form-control mb-3" {...register("password")}/>
                                            {errors.password && <span>This field is required</span>}
                                        </td>
                                    </tr>
                                </table>

                                <Button variant="dark" type="submit" style={{width: '70%', margin: '15px'}}>Iniciar sesión</Button>
                            </form>
                            <br/>
                            <div style={{color: 'white'}}>
                                {/* Universidad Evangélica de El Salvador - TUess - Derechos Reservados © Octubre 2022 */}
                                TUees - Derechos Reservados © Octubre 2022
                            </div>

                        </div>
                    </div>
            </center>
        </body>
    );
}

export default Login