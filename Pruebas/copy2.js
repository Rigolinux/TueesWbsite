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
              // console.log("fecha ingresada: " + dateWithNoInitialValue);
              // console.log("fecha actual: " + moment(new Date()));
              // console.log("fecha cargada", dateWithNoInitialValue);
              // verifdate(perfildoc, data);
            } else {
              MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "La fecha no puede ser menor a la actual",
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
