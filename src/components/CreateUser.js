import React from "react";
import { useForm } from "react-hook-form";

//mui date imports
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

//mui type of trick mui imports
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

import { useNavigate } from "react-router-dom";

//import firestore
// import { addDoc, collection } from "firebase/firestore";
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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Imports del datapicker

// import dayjs from 'dayjs';
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

//swift alert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function CreateUser() {

    // ================================================================

    const { register, handleSubmit, formState: { errors } } = useForm();

    const [typeSex, setTypeSex] = React.useState("1");
    const [typeUser, setTypeUser] = React.useState(false);
    const [typeLevel, setTypeLevel] = React.useState(false);

    const [dateWithNoInitialValue, setDateWithNoInitialValue] = React.useState(null);

    // ... other code

    const navigate = useNavigate();

    // ================================================================

    const onSubmit = (data) => {

        // Invalidando los campos vacios

        if(data.nameUser !== "" && data.nameUser !== undefined && data.nameUser !== null){

            if(data.mailUser !== "" && data.mailUser !== undefined && data.mailUser !== null){

                if(data.passUser !== "" && data.passUser !== undefined && data.passUser !== null){

                    if(dateWithNoInitialValue !== null){

                        // validando que la fecha no sea mayor a la actual
                        if(dateWithNoInitialValue < moment(new Date())){

                            const mail      = data.mailUser;
                            const pass      = data.passUser;
                            const name      = data.nameUser;
                            const dateNc    = dateWithNoInitialValue.toDate();
                            console.log("Correo:", mail, "||", "Contraseña:", pass, "||", "Nombre:", name, "||", "Fecha:", dateNc);
                            createUserAuthentication(mail, pass, name, dateNc);                            

                        } else {
                            MySwal.fire({
                                title: "Error",
                                text: "La fecha de nacimiento no puede ser mayor a la actual.",
                                icon: "error",
                                confirmButtonText: "Ok",
                            });
                        }

                    } else{
                        MySwal.fire({
                            title: "Error",
                            text: "Debes ingresar una fecha de nacimiento.",
                            icon: "error",
                            confirmButtonText: "Ok",
                        });
                    }

                } else {
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
            
        } else {
            MySwal.fire({
                title: "Error",
                text: "Debes ingresar un nombre de usuario.",
                icon: "error",
                confirmButtonText: "Ok",
            });
        }
    }

    // ================================================================

    // ----------------------------------------------------------------

    // Creando el usuario en authentication

    const createUserAuthentication = (mail, pass, name, dateNc) =>{
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, mail, pass)
        .then((userCredential) => {
            const user      = userCredential.user;
            const uiduser   = user.uid;
            console.log("Se creo el usuario exitosamente", user);
            console.log("El uid del usuario es: ", uiduser);
            // console.log("El correo del usuario es: ", user.email);
            // console.log("El uid del usuario es: ", user.uid);
            createUserProfile(uiduser, mail, name, dateNc);
        })
        .catch((error) => {
            MySwal.fire({
                title: "Error",
                text: 
                    error.message === "Firebase: Error (auth/invalid-email)."           ? "El Correo Ingresado No Es Válido." 
                :   error.message === "Firebase: Error (auth/email-already-in-use)."    ? "El Correo Ingresado Ya está En Uso."
                :   "Error desconocido.",
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            console.log("Error al crear el usuario en authentication", error.message);
        });
    }

    // Creando el usuario en la coleccion de perfiles

    const createUserProfile = async (uiduser, mail, name, dateNc) => {
        
        console.log("====================================");
        console.log("correo:", mail, "||", "nombre:", name, "||", "fecha:", dateNc, "||", "uid:", uiduser);
        console.log("====================================");

        try{
            await addDoc(collection(db, "Perfiles"), {
                color:                  "black",
                correo:                 mail,
                fecha_de_nacimiento:    dateNc,
                icon:                   1,
                id_user:                uiduser,
                nombre:                 name,
                sexo:                   typeSex,
                type_user:              typeUser,
                values:                 3,
                administrador:          typeLevel,
            });
            MySwal.fire({
                title: "Exito",
                text: "Se creo el usuario exitosamente.",
                icon: 'success',
                confirmButtonText: 'Ok',
            })

            .finally(() => {
                navigate(0);
            });
            
        } catch (error) {
            MySwal.fire({
                title: "Error",
                text: "Error al crear el perfil del usuario",
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            console.log("Error al crear el perfil del usuario", error)
        }
    }

    // ----------------------------------------------------------------

    const handleChangeSex = (event) => {
        setTypeSex(event.target.value);
        console.log(event.target.value);
    };

    const handleChangeUser = (event) => {
        setTypeUser(event.target.value);
        console.log(event.target.value);
    };

    const handleChangeLevel = (event) => {
        setTypeLevel(event.target.value);
        console.log(event.target.value);
    };


  return (
    <div style={{ background: "#023262", height: "100vh" }}>
        {/* <body style={{ background: "#023262", height: "100vh" }}> */}
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <br />
                            <form className="form-control" onSubmit={handleSubmit(onSubmit)}>

                                <center>
                                    <h1 style={{ margin: '20px'}}>Crear Un Nuevo Usuario.</h1>
                                </center>

                                <div className="mb-3">
                                    <label className="form-label">Nombre Completo: </label>
                                    <input {...register("nameUser")} className="form-control"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Correo Electronico: </label>
                                    <input {...register("mailUser")} className="form-control"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Contraseña: </label>
                                    <input {...register("passUser")} className="form-control"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Fecha De Nacimiento: </label>
                                    <DatePicker 
                                        value={dateWithNoInitialValue} 
                                        onChange={(newValue) => setDateWithNoInitialValue(newValue)} 
                                        renderInput={(params) => <TextField {...params} />}
                                        className="form-control"
                                    />
                                </div>

                                <div className="mb-3">
                                    <InputLabel className="form-label" id="type-sex">Sexo: </InputLabel>
                                    <Select 
                                        labelId="type-sex"
                                        id="type-sex-select"
                                        value={typeSex}
                                        label="Sexo"
                                        onChange={handleChangeSex}
                                        className="form-select">
                                            <MenuItem value="1">Masculino.</MenuItem>
                                            <MenuItem value="2">Femenino. </MenuItem>
                                            <MenuItem value="3">Otro.     </MenuItem>
                                    </Select>
                                </div>

                                <div className="mb-3">
                                    <InputLabel className="form-label" id="type-user">Tipo de Usuario: </InputLabel>
                                    <Select
                                        labelId="type-user"
                                        id="type-user-select"
                                        value={typeUser}
                                        label="Tipo de Usuario"
                                        onChange={handleChangeUser}
                                        className="form-select">
                                            <MenuItem value={true}>Conductor.</MenuItem>
                                            <MenuItem value={false}>Estudiante.</MenuItem>
                                            {/* <MenuItem value={0}>Administrador.</MenuItem> */}
                                    </Select>
                                </div>

                                <div className="mb-3">
                                    <InputLabel className="form-label" id="type-level">Nivel de Usuario: </InputLabel>
                                    <Select
                                        labelId="type-level"
                                        id="type-level-select"
                                        value={typeLevel}
                                        label="Nivel de usuario"
                                        onChange={handleChangeLevel}
                                        className="form-select">
                                            <MenuItem value={true}>Nivel De Usuario Administrador.</MenuItem>
                                            <MenuItem value={false}>Nivel De Usuario Normal.</MenuItem>
                                    </Select>
                                </div>

                                <center>
                                    <button type="submit" className="btn btn-primary" style={{ width: '40%', margin: '15px'}}> Crear. </button>
                                    <a href="/" className="btn btn-danger" style={{ width: '40%', margin: '15px'}}>Regresar.</a>
                                </center>

                            </form>
                        </div>
                    </div>
                </div>

                <br/>
                <center>
                    <div style={{ color: 'white' }}>
                        {/* Universidad Evangélica de El Salvador - TUess - Derechos Reservados © Octubre 2022 */}
                        TUees - Derechos Reservados © Octubre 2022
                    </div>
                </center>

            </LocalizationProvider>
        {/* </body> */}
    </div>
  )
}

export default CreateUser