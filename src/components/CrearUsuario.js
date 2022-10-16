import React from 'react'
// import { useForm } from "react-hook-form";

// mui imports
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

// Importando mui type of tricks
import { Select } from '@mui/material';
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

// Importando firebase y auth
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from '../firebase';

// Importando el data picker
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import moment from "moment";

//swift alert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const CrearUsuario = () => {

  // const { register, handleSubmit } = useForm();

  const [dateWithNoInitialValue, setDateWithNoInitialValue] = React.useState(null);
  const [typeUser, setTypeUser] = React.useState(false);
  const [typeSex, setTypeSex]   = React.useState("1");

  // Creando el usuario en firebase autentication

  const createUser = (correo, contraseña, nombre, fecha) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, correo, contraseña)
      .then((userCredential) => {
        const user = userCredential.user;
        const uiduser = user.uid;
        console.log("Se creo el usuario exitosamente", user)
        console.log("El uid del usuario es: ", uiduser)
        // console.log("El correo del usuario es: ", user.email)
        // console.log("El uid del usuario es: ", user.uid)

        createUserProfile(uiduser, correo, nombre, fecha)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
      });
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const correo      = e.target.emailField.value;
  //   const contraseña  = e.target.passwordField.value;
  //   const nombre      = e.target.Nombre.value;
  //   const fecha       = dateWithNoInitialValue.toDate();
  //   createUser(correo, contraseña, nombre, fecha);
  //   console.log("Correo:", correo, "||", "Contraseña:", contraseña, "||", "Nombre:", nombre, "||", "Fecha:", fecha)
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dateWithNoInitialValue !== null) {
      const correo      = e.target.emailField.value;
      const contraseña  = e.target.passwordField.value;
      const nombre      = e.target.Nombre.value;
      const fecha       = dateWithNoInitialValue.toDate();
      createUser(correo, contraseña, nombre, fecha);
      console.log("Correo:", correo, "||", "Contraseña:", contraseña, "||", "Nombre:", nombre, "||", "Fecha:", fecha)

    } else {
      MySwal.fire({
        title: "Error",
        text: "Debes seleccionar una fecha de nacimiento",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }

    // try {
    //   const correo      = e.target.emailField.value;
    //   const contraseña  = e.target.passwordField.value;
    //   const nombre      = e.target.Nombre.value;
    //   const fecha       = dateWithNoInitialValue.toDate();
    //   createUser(correo, contraseña, nombre, fecha);
    //   console.log("Correo:", correo, "||", "Contraseña:", contraseña, "||", "Nombre:", nombre, "||", "Fecha:", fecha)
    // } catch (error) {
    //   console.log(error)
    // }
  }

    // Creando el usuario en la coleccion de perfiles

    const createUserProfile = async ( uiduser, correo, nombre, fecha) => {

      console.log("====================================");
      console.log("correo:", correo, "||", "nombre:", nombre, "||", "fecha:", fecha, "||", "uid:", uiduser)
      console.log("====================================");

      try {
        await addDoc(collection(db, "Perfiles"), {
          nombre:               nombre,
          correo:               correo,
          id_user:              uiduser,
          fecha_de_nacimiento:  fecha,
          sexo:                 typeSex,
          type_user:            typeUser,
          icon:                 "1",
          color:                "black",
          values:               3,
        });
        Swal.fire({
          icon: "success",
          title: "Usuario creado exitosamente",
          showConfirmButton: false,
          timer: 2000,
        })
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al crear el perfil del usuario"
        })
        console.log("Error al crear el perfil del usuario", error)
      }
    }

  const handleChangeUser = (event) => {
    setTypeUser(event.target.value);
    console.log("Tipo de usuario seleccionado: ", event.target.value);
  };

  const handleChangeSex = (event) => {
    setTypeSex(event.target.value);
    console.log("Tipo de sexo seleccionado: ", event.target.value);
  }

  return (
    <body style={{ background: "#023262", height: "100vh", fontFamily: "" }}>

    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div className="container">
        <div className="row">
          <div className="col">
            <br/><br/><br/>

            <form className="form-control" onSubmit={handleSubmit}>
              
              <center>
                <h1 style={{margin: '20px'}}>Crear Un Nuevo Usuario.</h1>
              </center>

              <div className="mb-3">
                <label className="form-label">Nombre Completo: </label>
                <input
                  id="Nombre"
                  type="text"
                  className="form-control"
                  required={true}
                  // {...register("Nombre", { required: true })}
                />
              </div>

              <div className="mb-3">
                <label className='form-label' id='emailField'>Correo Electronico: </label>
                <input
                  id='emailField'
                  type="email"
                  className="form-control"
                  required={true}
                  // {...register("Correo", { required: true })}
                />
              </div>

              <div className="mb-3">
                <label className='form-label' id='passwordField'>Contraseña: </label>
                <input
                  id='passwordField'
                  type="password"
                  className="form-control"
                  required={true}
                  // {...register("Contraseña", { required: true })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha de Nacimiento: </label>
                {/* <DateTimePicker
                  value={dateWithNoInitialValue}
                  onChange={(newValue) => setDateWithNoInitialValue(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  className="form-control"
                /> */}
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
                  className="form-select"
                >
                  <MenuItem value="1">Masculino</MenuItem>
                  <MenuItem value="2">Femenino </MenuItem>
                  <MenuItem value="3">Otro     </MenuItem>
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
                  className="form-select"
                >
                  <MenuItem value={true}>Conductor     </MenuItem>
                  <MenuItem value={false}>Estudiante    </MenuItem>
                </Select>
              </div>

              <center>
                <button type="submit" className="btn btn-primary" style={{ width: '40%', margin: '15px'}}>Registrar</button>
                <a href='/' className='btn btn-danger' style={{ width: '40%', margin: '15px'}}>Regresar </a>
              </center>

            </form>
          </div>
        </div>
      </div>
      
      <br/>
      <center>
        <div style={{color: 'white'}}>
          {/* Universidad Evangélica de El Salvador - TUess - Derechos Reservados © Octubre 2022 */}
          TUees - Derechos Reservados © Octubre 2022
        </div>
      </center>
    </LocalizationProvider>
    </body>
  );
}

export default CrearUsuario