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

// Imports del datapicker

// import dayjs from 'dayjs';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

//swift alert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Create() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // states
  // const [value, setValue] = React.useState(moment(new Date()))
  // const [dateinv, setDateInv] = React.useState((new Date()))
  const [typeTrip, setTypeTrip] = React.useState("1");
  // const [hours, setHours ] = React.useState();

  const [dateWithNoInitialValue, setDateWithNoInitialValue] =
    React.useState(null);

  const [perfildoc, setPerfildoc] = React.useState([]);
  const [horariosdoc, setHorariosdoc] = React.useState([]);

  const navigate = useNavigate();

  const onSubmit = (data) => {

    // Validando campos vacios
    if (data.mailDriver !== "" && data.mailDriver !== undefined && data.mailDriver !== null) {
      // console.log(data.mailDriver);
      const perfilesCollection  = collection(db, "Perfiles");
      const perfilFilter        = query(perfilesCollection, where("type_user", "==", true), where("correo", "==", data.mailDriver));
      const perfildoc           = [];
      const perfilesFilterSnap  = getDocs(perfilFilter);

      perfilesFilterSnap.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          perfildoc.push({
            id: doc.id,
            ...doc.data(),
          });
          setPerfildoc(perfildoc);
          // console.log(perfildoc);
          // verifdate(perfildoc, data);
        });
      }).then( () => {
        if(perfildoc.length > 0){

          // Validando que la fecha no este vacia
          if (dateWithNoInitialValue !== null) {

            // Validando que la fecha no sea menor a la actual
            if (dateWithNoInitialValue > moment(new Date())) {
              
              // LLamando a la colección de horarios
              const horariosCollection = collection(db, "Horarios");
              const horariosFilter     = query(horariosCollection, where("correo_del_admin", "==", data.mailDriver), 
              where("type_of_trip", "==", typeTrip)//, where("date_of_travel", "==", dwnivEntertoString1)
              );
              const horariosdoc        = [];
              const horariosFilterSnap = getDocs(horariosFilter);
              horariosFilterSnap.then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  horariosdoc.push({
                    id: doc.id,
                    correo_del_admin: doc.data().correo_del_admin,
                    date_of_travel:   doc.data().date_of_travel.toDate().toString(),
                    type_of_trip:     doc.data().type_of_trip,
                    // date_of_travel:   doc.data().date_of_travel,
                    finalizado:       doc.data().finalizado,
                    id_user:          doc.data().id_user,
                    nombre:           doc.data().nombre,
                    state:            doc.data().state,
                  });
                  setHorariosdoc(horariosdoc);
                });
                console.log(horariosdoc); // se coloca aca para que no se repita segun los datos del arreglo

                // ==================== Buscando en el arreglo la fecha seleccionada ====================
                let dwnivEnter          = moment(dateWithNoInitialValue).toDate();
                let dwnivEntertoString  = dwnivEnter.toString();
                let horariosdocArray    = horariosdoc;
                const founds = (element) => element.date_of_travel.toString() === dwnivEntertoString;
                // console.log("Posicion: ", horariosdocArray.findIndex(founds));
                let position = horariosdocArray.findIndex(founds);
                let positionConvert = position.toString();
                console.log("Posicion convertida: ", positionConvert);
                // ======================================================================================

                
                if(positionConvert >= 0){
                  // ==================== Buscando la direncia en segundos de las fechas ====================
                  let dateOfTravel  = moment(horariosdoc[positionConvert].date_of_travel);
                  let dwniva        = moment(dateWithNoInitialValue).toDate();          
                  // console.log("dateOfTravel", dateOfTravel);
                  // console.log("dwniva", dwniva);
                  // let xd = dateOfTravel.diff(dwniva, 'seconds');
                  // console.log("xd", xd);
                  let typeOfTrip  = horariosdoc[positionConvert].type_of_trip;
                  let correoAdmin = horariosdoc[positionConvert].correo_del_admin;

                  // if(dateOfTravel.diff(dwniva, 'seconds') === 0 && (typeOfTrip === typeTrip) === 1 && correoAdmin === data.mailDriver && typeOfTrip !== typeTrip){
                  if(dateOfTravel.diff(dwniva, 'seconds') === 0 && typeOfTrip === typeTrip && correoAdmin === data.mailDriver){
                    console.log("Las fechas son las mismas");
                    MySwal.fire({
                      title: "Error",
                      text: "El conductor ya tiene un viaje programado para esa fecha",
                      icon: "error",
                      confirmButtonText: "Ok",
                    });
                  }
                  // else{
                  //   console.log("Las fechas son diferentes");
                  // }
                  // ======================================================================================
                } else {
                  console.log("No existe registro por ende se puede crear");
                  createHorario(data, perfildoc, positionConvert);
                }

              });
            } else {
              MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "La fecha no puede ser menor a la actual.",
              });
            }
          } else {
            MySwal.fire({
              title: "Error!",
              text: "Debe de ingresar una fecha.",
              icon: "error",
              confirmButtonText: "Ok",
            });
          }
        } else {
          console.log("no se encontro el perfil");
          console.log("correo ingresado: " + data.mailDriver);
          console.log("correo cargado", perfildoc === null ? "" : "no existe");
          console.log("perfil cargado", perfildoc);
          MySwal.fire({
            title: "Error!",
            text: "El correo ingresado no pertece a un conductor.",
            icon: "error",
            confirmButtonText: "Ok",
          })
        }
      });
    } else {
      MySwal.fire({
        title: "Error",
        text: "Debes ingresar un correo.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const createHorario = async (data, perfildoc) => {
    try {
      await addDoc(collection(db, "Horarios"), {
        correo_del_admin: data.mailDriver,
        date_of_travel:   dateWithNoInitialValue.toDate(),
        finalizado:       false,
        id_user:          perfildoc[0].id_user,
        nombre:           perfildoc[0].nombre,
        state:            false,
        type_of_trip:     typeTrip,
      });
      MySwal.fire({
        title: "Horario creado",
        text: "El horario se ha creado correctamente.",
        icon: "success",
        confirmButtonText: "Ok",
      })

      .finally(() => {
        navigate(0);
    });
    
    } catch (error) {
      // console.log(
      //   "Error al crear un documento en la coleccion de Horarios",
      //   error
      // );
      MySwal.fire({
        title: "Error",
        text: "Error al crear un documento en la coleccion de Horarios.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleTypeTrip = (event) => {
    setTypeTrip(event.target.value);
    console.log(event.target.value);
  };

  return (
    <body style={{ background: "#023262", height: "100vh", fontFamily: "" }}>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div className="container">
        <div className="row">
          <div className="col">

            <br/><br/><br/><br/><br/>
            
            <form className="form-control" onSubmit={handleSubmit(onSubmit)}>

              <center>
                <h1 style={{margin: '20px'}}>Crear Horario.</h1>
              </center>

              <div className="mb-3">
                <label className="form-label">Correo Del Transportista.</label>
                <input
                  {...register("mailDriver")}
                  // {...register("mailDriver", { required: true })}
                  // type="text"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha Y Hora De Viaje.</label>
                <DateTimePicker
                  value={dateWithNoInitialValue}
                  onChange={(newValue) => setDateWithNoInitialValue(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <InputLabel className="form-label" id="type-trip">
                  Tipo de viaje
                </InputLabel>
                <Select
                  labelId="type-trip"
                  id="tryp-selector"
                  value={typeTrip}
                  label="Tipo de viaje"
                  onChange={handleTypeTrip}
                  className="form-select"
                >
                  <MenuItem value="1">Metrocentro - Universidad.</MenuItem>
                  <MenuItem value="2">Universidad - Metrocentro.</MenuItem>
                </Select>
              </div>

              <center>
                <button type="submit" className="btn btn-primary" style={{ width: '40%', margin: '15px'}}> Crear. </button>
                {/* <a href="/" className="btn btn-danger" style={{ marginLeft: "10px" }}> {" "} Regresar.{" "} </a> */}
                <a href="/" className="btn btn-danger" style={{ width: '40%', margin: '15px'}}>Regresar.</a>
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

export default Create;
