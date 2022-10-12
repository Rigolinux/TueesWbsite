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
  // getDoc,
  // updateDoc,
  // doc,
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
    const perfilesCollection = collection(db, "Perfiles");
    // const perfilFilter        = query(perfilesCollection, where("type_user", "==", true), where("correo", "==", data.mailDriver));
    const perfilFilter = query(
      perfilesCollection,
      where("type_user", "==", true), 
      where("correo", "==", data.mailDriver)
    );
    const perfildoc = [];
    const perfilesFilterSnap = getDocs(perfilFilter);
    perfilesFilterSnap.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        perfildoc.push({
          id: doc.id,
          ...doc.data(),
        });
        setPerfildoc(perfildoc);
        // console.log(data.mailDriver);
        if(data.mailDriver !== null && data.mailDriver !== undefined && data.mailDriver !== ""){
          if(data.mailDriver === perfildoc[0].correo){
            if(dateWithNoInitialValue !== null){
              checkingData(data, perfildoc);
            } else {
              MySwal.fire({
                title: "Error",
                text: "Debes seleccionar una fecha",
                icon: "error",
                confirmButtonText: "Ok",
              });
            }
          } else {
            MySwal.fire({
              title: "Error",
              text: "El correo ingresado no pertece a un conductor.",
              icon: "error",
              confirmButtonText: "Ok",
            });
          }
        } else {
          MySwal.fire({
            title: "Error",
            text: "Debes ingresar el correo de un conductor",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      });
    });
  };

  const checkingData = (data, perfildoc) => {
    const horariosCollection = collection(db, "Horarios");
    const horariosFilter = query(horariosCollection);
      // where("correo_del_admin", "==", perfildoc[0].correo)
      // where("date_of_travel",   "==", dateWithNoInitialValue.toDate()),
      // where("type_of_trip",     "==", typeTrip));
    const horariosdoc = [];
    const horariosFilterSnap = getDocs(horariosFilter);
    horariosFilterSnap.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        horariosdoc.push({
          id: doc.id,
          ...doc.data(),
        });
        setHorariosdoc(horariosdoc);
        // console.log("horariosdoc: ", horariosdoc);
        createHorario(data, perfildoc, horariosdoc);
      });
    });
  };

  const createHorario = async (data, perfildoc, horariosdoc) => {
    let DateCollectionHorarios  = moment(horariosdoc[0].date_of_travel.toDate()).format("lll");
    let DateOnSubmit            = moment(dateWithNoInitialValue.toDate()).format("lll");
    // console.log("Base hora: ", DateCollectionHorarios);
    // console.log("Ingresada: ", DateOnSubmit);
    // console.log("Type of trip WS: ", typeTrip);
    // console.log("Type of trip BD: ", horariosdoc[0].type_of_trip);

    console.log("a1: ", dateWithNoInitialValue.toDate());
    console.log("a2: ", horariosdoc[0].date_of_travel.toDate());
    
    console.log("a1c: ", data.mailDriver);
    console.log("a2c: ", horariosdoc[0].correo_del_admin);

    console.log("a1t: ", typeTrip);
    console.log("a2t: ", horariosdoc[0].type_of_trip);

    // if(DateCollectionHorarios  !== DateOnSubmit){
    //   MySwal.fire({
    //     title: "Success",
    //     text: "Libre",
    //     icon: "error",
    //     confirmButtonText: "Ok",
    //   })
    // } else {
    //   MySwal.fire({
    //     title: "Error",
    //     text: "El conductor ya tiene un viaje programado para esa fecha",
    //     icon: "error",
    //     confirmButtonText: "Ok",
    //   })
    // }

    if (data.mailDriver === horariosdoc[0].correo_del_admin === perfildoc[0].id )
    {
      MySwal.fire({
        title: "Error",
        text: "El conductor ya tiene un viaje programado para esa fecha",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } else {
      // horariosCreate(data, perfildoc, horariosdoc);
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
    }



    // if (
    //   DateCollectionHorarios  !== DateOnSubmit &&
    //   typeTrip                !== horariosdoc[0].type_of_trip &&
    //   data.mailDriver         !== horariosdoc[0].correo_del_admin
    // ) {
    //   console.log("No hay coincidencia 1");
    //   // horariosCreate(data, perfildoc, horariosdoc);
    // } else if (
    //   DateCollectionHorarios  !== DateOnSubmit &&
    //   typeTrip                === horariosdoc[0].type_of_trip &&
    //   data.mailDriver         === horariosdoc[0].correo_del_admin
    // ) {
    //   console.log("No hay coincidencia 2");
    //   // horariosCreate(data, perfildoc, horariosdoc);
    // } else if (
    //   DateCollectionHorarios  === DateOnSubmit &&
    //   typeTrip                !== horariosdoc[0].type_of_trip &&
    //   data.mailDriver         === horariosdoc[0].correo_del_admin
    // ) {
    //   console.log("No hay coincidencia 3");
    //   // horariosCreate(data, perfildoc, horariosdoc);
    // } else {
    //   MySwal.fire({
    //     title: "Error",
    //     text: "El conductor ya tiene un viaje programado para esa fecha",
    //     icon: "error",
    //     confirmButtonText: "Ok",
    //   });
    // }
  };

  // const horariosCreate = async (data, perfildoc, horariosdoc) => {
  //   try {
  //     await addDoc(collection(db, "Horarios"), {
  //       correo_del_admin: data.mailDriver,
  //       date_of_travel: dateWithNoInitialValue.toDate(),
  //       finalizado: false,
  //       id_user: perfildoc[0].id_user,
  //       nombre: perfildoc[0].nombre,
  //       state: false,
  //       type_of_trip: typeTrip,
  //     });
  //     MySwal.fire({
  //       title: "Horario creado",
  //       text: "El horario se ha creado correctamente.",
  //       icon: "success",
  //       confirmButtonText: "Ok",
  //     });
  //   } catch (error) {
  //     // console.log(
  //     //   "Error al crear un documento en la coleccion de Horarios",
  //     //   error
  //     // );
  //     MySwal.fire({
  //       title: "Error",
  //       text: "Error al crear un documento en la coleccion de Horarios.",
  //       icon: "error",
  //       confirmButtonText: "Ok",
  //     });
  //   }
  // };

    

    //  else {
    //   MySwal.fire({
    //     title: "Error",
    //     text: "Ya se tiene un viaje para esa fecha.",
    //     icon: "error",
    //     confirmButtonText: "Ok",
    //   })
    //   console.log("Ya existe");
  

  // console.log("Collection perfiles: ", perfildoc[0].correo);
  // console.log("Ingresado en input: ", data.mailDriver);
  // try {
  //   await addDoc(collection(db, "Horarios"), {
  //     correo_del_admin: data.mailDriver,
  //     date_of_travel:   dateWithNoInitialValue.toDate(),
  //     finalizado:       false,
  //     id_user:          perfildoc[0].id_user,
  //     nombre:           perfildoc[0].nombre,
  //     state:            false,
  //     type_of_trip:     typeTrip,
  //   });
  //   MySwal.fire({
  //     title: "Horario creado",
  //     text: "El horario se ha creado correctamente.",
  //     icon: "success",
  //     confirmButtonText: "Ok",
  //   });
  // } catch (error) {
  //   // console.log(
  //   //   "Error al crear un documento en la coleccion de Horarios",
  //   //   error
  //   // );
  //   MySwal.fire({
  //     title: "Error",
  //     text: "Error al crear un documento en la coleccion de Horarios.",
  //     icon: "error",
  //     confirmButtonText: "Ok",
  //   });
  // }
  // };

  // const handleDateChangue = (newdate) => {
  //   setDateInv(moment(newdate))
  //   setValue(newdate)
  // }
  // const handleTimeChangue = (newtime) => {
  //   setHours(moment(newtime))
  //   console.log(hours)
  //   console.log(newtime)

  // }

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
