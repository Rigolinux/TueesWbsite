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
          // console.log("existe");
          // console.log("correo ingresado: " + data.mailDriver);
          // console.log("correo cargado", perfildoc[0].correo);
          // console.log("perfil cargado", perfildoc);
          verifdate(perfildoc, data);
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

  const verifdate = (perfildoc, data) => {
    if(dateWithNoInitialValue !== null){
      const horariosCollection = collection(db, "Horarios");
      const horariosFilter = query(horariosCollection, where("correo_del_admin", "==", perfildoc[0].correo), where("date_of_travel", "==", dateWithNoInitialValue.toDate()));
      const horariosdoc = [];
      const horariosFilterSnap = getDocs(horariosFilter);
      horariosFilterSnap.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          horariosdoc.push({
            id: doc.id,
            ...doc.data(),
          });
          setHorariosdoc(horariosdoc);
          console.log("horariosdoc: ", horariosdoc);
          // createHorario(data, perfildoc, horariosdoc);
          let correoEnter     = data.mailDriver;
          let correoCharge    = horariosdoc[0].correo_del_admin;
          let fechaEnter      = moment.utc(dateWithNoInitialValue).local().format("YYYY-MM-DD HH:mm:ss");
          let fechaCharge     = moment.utc(horariosdoc[0].date_of_travel.toDate()).local().format("YYYY-MM-DD HH:mm:ss");
          let typeTripEnter   = typeTrip;
          let typeTripCharge  = horariosdoc[0].type_of_trip;

          console.log("==========================================================")
          console.log("id documento    :  ", horariosdoc[0].id);
          console.log("correo ingresado:  ", correoEnter);
          console.log("correo cargado:    ", correoCharge);
          console.log("Fecha ingresada:   ", fechaEnter);
          console.log("Fecha cargada:     ", fechaCharge);
          console.log("Tipo de viaje WS:  ", typeTripEnter);
          console.log("Tipo de viaje BD:  ", typeTripCharge);
          console.log("==========================================================")

          if(fechaEnter === fechaCharge && typeTripEnter === typeTripCharge){
            // console.log("existe");
            MySwal.fire({
              title: "Error!",
              text: "El viaje ya existe.",
              icon: "error",
              confirmButtonText: "Ok",
            })
          } else {
            console.log("disponible");
            // horariosCreate(data, perfildoc, horariosdoc);
          }
        });
      });
      // checkingData(data, perfildoc);
    } else {
      MySwal.fire({
        title: "Error",
        text: "Debes seleccionar una fecha.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const horariosCreate = async (data, perfildoc, horariosdoc) => {
    try {
      await addDoc(collection(db, "Horarios"), {
        correo_del_admin: data.mailDriver,
        date_of_travel: dateWithNoInitialValue.toDate(),
        finalizado: false,
        id_user: perfildoc[0].id_user,
        nombre: perfildoc[0].nombre,
        state: false,
        type_of_trip: typeTrip,
      });
      MySwal.fire({
        title: "Horario creado",
        text: "El horario se ha creado correctamente.",
        icon: "success",
        confirmButtonText: "Ok",
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
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="mb-3">
              <center>
                <h1>Crear un nuevo viaje</h1>
              </center>
            </div>

            <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">Correo del transportista.</label>
                <input
                  {...register("mailDriver")}
                  // {...register("mailDriver", { required: true })}
                  // type="text"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha y hora de viaje.</label>
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
                  <MenuItem value="1">Metrocentro - Universidad</MenuItem>
                  <MenuItem value="2">Universidad - Metrocentro</MenuItem>
                </Select>
              </div>

              <center>
                <button type="submit" className="btn btn-primary">
                  Crear
                </button>
                <a
                  href="/"
                  className="btn btn-danger"
                  style={{ marginLeft: "10px" }}
                >
                  {" "}
                  Regresar{" "}
                </a>
              </center>
            </form>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default Create;
