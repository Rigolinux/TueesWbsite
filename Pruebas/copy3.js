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
              // console.log("fecha ingresada: " + dateWithNoInitialValue);
              // console.log("fecha actual: " + moment(new Date()));
              // console.log("fecha cargada", dateWithNoInitialValue);
              // verifdate(perfildoc, data);

              // Referencia a la coleccion de horarios

              // let xd = dateWithNoInitialValue.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
              // console.log("fecha cargada", xd);

              // let dwnivConverted = dateWithNoInitialValue.toDate();
              // console.log("fecha cargada", dwnivConverted);

              // let xdd  = dateWithNoInitialValue.toDate();
              // let xd2 = Timestamp.fromDate(new Date(xdd));
              // console.log("fecha cargada", xd2);

              // let xd3 = Timestamp.fromDate(new Date((dateWithNoInitialValue.seconds + dateWithNoInitialValue.nanoseconds * 10 ** -9)*1000));
              // console.log("fecha cargada", xd3);

              // let DTP_Date = Timestamp.fromDate(new Date(dateWithNoInitialValue));
              // console.log("Date from DateTimePicker: ", DTP_Date);
              
              // let xd = new Date(dateWithNoInitialValue);
              // let ts = Timestamp.fromDate(xd);
              // console.log("Date from DateTimePicker: ", ts);

              // var unix = Math.round(+new Date(xd) / 1000);
              // console.log("Date from DateTimePicker unix: ", unix);

              // var asd = new Date().getTime();
              // console.log("Date from DateTimePicker asd: ", asd);

              // var zx = Date.now() / 1000 | 0;
              // console.log("Date from DateTimePicker zx: ", zx);

              // var tusa = Math.floor(Date.now() / 1000);
              // console.log("Date from DateTimePicker tusa: ", tusa);

              // var asdsd = new Date/1e3|0;
              // console.log("Date from DateTimePicker asdsd: ", asdsd);
              
              // var asdasdasd = xd.getTime() * 1000000;
              // console.log("Date from DateTimePicker asdasdasd: ", asdasdasd);

              // var xxxxxxxx = Math.round(+new Date(xd) / 1000);
              // console.log("Date from DateTimePicker unix: ", xxxxxxxx);

              // let time = dateWithNoInitialValue;
              // const date = new Date(time);
              // const millisecondsSinceEpoch = date.getTime();
              // const seconds = Math.floor(millisecondsSinceEpoch / 1000);

              // console.log("sadadas", millisecondsSinceEpoch)
              // console.log("Date from DateTimePicker seconds: ", seconds);
              
              // let date2 = dateWithNoInitialValue.toDate();
              // console.log("Date from DateTimePicker date2: ", date2);

              // let date3 = dateWithNoInitialValue.updateTime(0, 0, 0, 0);
              // console.log("Date from DateTimePicker date3: ", date3);




              // let xd5 = dateWithNoInitialValue
              // const xd6 = new Date(xd5);

              // console.log("fecha cargada5", xd6);

              // const xd7 = Math.floor(xd6.getTime() / 1000);
              // console.log("fecha cargada6", xd7);

              // const xd9 = Math.floor(xd6.getTime() / 10000);
              // console.log("fecha cargada7", xd9);

              // let a1 = new Date(dateWithNoInitialValue);
              // console.log("fecha cargada8", a1.toISOString());



              // let xd5 = new Date(dateWithNoInitialValue).getTime();
              // console.log("fecha cargada555", xd5);

              // let TimeStampSet = new Date(dateWithNoInitialValue.seconds * 1000)

              // console.log("fecha cargada", dateWithNoInitialValue.toDate());

              // let dwnivaa= moment(dateWithNoInitialValue).toDate();
              // console.log("fecha cargada", dwnivaa);
              


              const horariosCollection = collection(db, "Horarios");
              // const horariosFilter     = query(horariosCollection, where("date_of_travel", "==", dateWithNoInitialValue.toDate()));
              const horariosFilter     = query(horariosCollection, where("correo_del_admin", "==", data.mailDriver), 
              where("type_of_trip", "==", typeTrip),
              // where("date_of_travel", "==", (moment(dateWithNoInitialValue).toDate()))
              );
              const horariosdoc        = [];
              const horariosFilterSnap = getDocs(horariosFilter);
              horariosFilterSnap.then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  horariosdoc.push({
                    // id: doc.id,
                    // correo_del_admin: doc.data().correo_del_admin,
                    // date_of_travel:   doc.data().date_of_travel,
                    date_of_travel:   doc.data().date_of_travel.toDate(),
                    // finalizado:       doc.data().finalizado,
                    // id_user:          doc.data().id_user,
                    // nombre:           doc.data().nombre,
                    // state:            doc.data().state,
                    // type_of_trip:     doc.data().type_of_trip
                  });
                  setHorariosdoc(horariosdoc);
                  // console.log(horariosdoc);
                  // console.log("fb/fs", horariosdoc[0].date_of_travel);
                  // console.log("Document from Firebase/FireStore", horariosdoc[{...doc.data()}].date_of_travel);
                });
                
                console.log(horariosdoc);


                // let valFind = moment(dateWithNoInitialValue).toDate();
                // let valFind = "Sat Dec 30 2022 06:00:00 GMT-0600";

                // let arrayFind = horariosdoc.find((item) => item.correo_del_admin === "conductorprueba@gmail.com");
                // console.log("Arreglo: ", arrayFind);
                
                // let valFind = "conductorprueba@gmail.com";
                // let asd = arrayFind.indexOf(valFind);
                // console.log("Resultadosss: ", asd);

                // let val = "conductorprueba@gmail.com";
                let val = moment(dateWithNoInitialValue).toDate();
                let vaal = val.toString();

                const array1 = horariosdoc;
                // const found = array1.find(element => element.correo_del_admin.toString() === val);
                const found = array1.find(element => element.date_of_travel.toString() === vaal);
                console.log("Resultadosss: ", found);

                let val11 = moment(dateWithNoInitialValue).toDate();
                let val111 = val11.toString();

                let array11 = horariosdoc;
                const founds = (element) => element.date_of_travel.toString() === val111;
                console.log("Resultadosxxxxx: ", array11.findIndex(founds));

                // let val2 = moment(dateWithNoInitialValue).toDate();
                // let vaal2 = val2.toString();
                // console.log("val2: ", vaal2);



                // let arrayReturn = arrayFind.indexOf(valFind);
                // console.log("Posicion: ", arrayReturn);

                // console.log("Valor: ", horariosdoc);

                // let valFind         = moment(dateWithNoInitialValue).toDate();
                // let arrayFind       = horariosdoc;
                // let arrayRet        = arrayFind.indexOf(valFind);
                // console.log("Posicion: ", arrayRet);

                // let valFind2         = moment(dateWithNoInitialValue).toDate();
                // let valFind22        = valFind2.toString();
                // let arrayFind2       = horariosdoc.toString();
                // let arrayRet2        = arrayFind2.indexOf(valFind22);
                // console.log("Posicion: ", arrayRet2);


                




                console.log("=========================================");

                // let dateOfTravel  = moment(horariosdoc[0].date_of_travel);
                // let dwniva        = moment(dateWithNoInitialValue).toDate();
                
                // console.log("dateOfTravel", dateOfTravel);
                // console.log("dwniva", dwniva);

                // let xd = dateOfTravel.diff(dwniva, 'seconds');
                // console.log("xd", xd);

                
                // if(dateOfTravel.diff(dwniva, 'seconds') === 0){
                //   console.log("Las fechas son las mismas");
                // }else{
                //   console.log("Las fechas son diferentes");
                // }
                

              })
              // .then( () => {
              //   if(horariosdoc.length > 0){
              //     // console.log("Existe un horario con el mismo conductor y ruta");

              //     if(horariosdoc[0].date_of_travel === dateWithNoInitialValue.toDate()){
              //       console.log("Las fechas son las mismas");
              //     }else{
              //       console.log("Las fechas son diferentes");
              //     }

              //   } else {
              //     console.log("No hay horarios");
              //   }
              // })
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

  // const verifdate = (perfildoc, data) => {
  //   if(dateWithNoInitialValue !== null){
  //     const horariosCollection = collection(db, "Horarios");
  //     DocumentReference date_of_travelRef = document(db, "Horarios", "date_of_travel");
  //     const dateRef2 = Timestamp.toDate(dateRef);
  //     // const horariosFilter = query(horariosCollection, where("correo_del_admin", "==", perfildoc[0].correo));
  //     const horariosFilter = query(horariosCollection, where("correo_del_admin", "==", data.mailDriver),
  //     where(dateRef2, "==", moment.utc(dateWithNoInitialValue).local().format("YYYY-MM-DD HH:mm:ss:mmm")));
  //     const horariosdoc = [];
  //     const horariosFilterSnap = getDocs(horariosFilter);
  //     horariosFilterSnap.then((querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         horariosdoc.push({
  //           id: doc.id,
  //           ...doc.data(),
  //         });
  //         setHorariosdoc(horariosdoc);
  //         console.log(horariosdoc);

  //         console.log("fecha ingresa: ", dateWithNoInitialValue);
  //         console.log("fecha cargada: ", horariosdoc[0].date_of_travel);
  //         console.log("fecha cargada: ", moment.utc(horariosdoc[0].date_of_travel.toDate()).local().format("YYYY-MM-DD HH:mm:ss:mmm"));

  //         // if(moment.utc(dateWithNoInitialValue.toDate()).local().format("YYYY-MM-DD HH:mm:ss:mmm") === moment.utc(horariosdoc[0].date_of_travel.toDate()).local().format("YYYY-MM-DD HH:mm:ss:mmm")){
  //         //   console.log("son iguales");
  //         // } else {
  //         //   console.log("son distintas");
  //         // }


  //         // createHorario(data, perfildoc, horariosdoc);
  //       });
  //     })
  //     // .then( () => {
  //     //   if(horariosdoc.length > 0){
  //     //     console.log("existe");
  //     //   } else if(horariosdoc.length === 0){
  //     //     console.log("no se encontro el horario");
  //     //   }
  //     // });
  //   } else {
  //     MySwal.fire({
  //       title: "Error",
  //       text: "Debes seleccionar una fecha.",
  //       icon: "error",
  //       confirmButtonText: "Ok",
  //     });
  //   }
  // };

  // const createHorario = async (data, perfildoc, horariosdoc) => {
  //   // let DateCollectionHorarios  = moment(horariosdoc[0].date_of_travel.toDate()).format("lll");

  //   // let DateCollectionHorarios  = moment.tz(horariosdoc[0].date_of_travel).format();
  //   // let DateOnSubmit            = moment(dateWithNoInitialValue.toDate()).format("lll");

  //   // console.log("Base hora: ", DateCollectionHorarios);
  //   // console.log("Ingresada: ", DateOnSubmit);
  //   // console.log("Type of trip WS: ", typeTrip);
  //   // console.log("Type of trip BD: ", horariosdoc[0].type_of_trip);

  //   // console.log("a1: ", dateWithNoInitialValue.toDate('et'));

  //   // console.log("a2: ", horariosdoc[0].date_of_travel.toDate('et'));

  //   let correoEnter   = data.mailDriver;
  //   // let correoCharge  = perfildoc[0].correo;
  //   let correoCharge  = horariosdoc[0].correo_del_admin;

  //   let fechaEnter  = moment.utc(dateWithNoInitialValue).local().format("YYYY-MM-DD HH:mm:ss");
  //   let fechaCharge = moment.utc(horariosdoc[0].date_of_travel.toDate()).local().format("YYYY-MM-DD HH:mm:ss");

  //   let typeTripEnter  = typeTrip;
  //   let typeTripCharge = horariosdoc[0].type_of_trip;

  //   // console.log("aaaaaaaaaaaaaaaaaaa: ", horariosdoc.find(element => element.date_of_travel === fechaEnter));

  //   console.log("==============", horariosdoc.find(element => element.date_of_travel === fechaEnter && element.correo_del_admin === correoEnter))

  //   console.log("type of trip: ", horariosdoc.find(element => element.type_of_trip === '2'));

  //   console.log("date: ", horariosdoc.find(element => element.date_of_travel === fechaEnter));

  //   // console.log("==========================================================")

  //   // console.log("correo ingresado:  ", correoEnter);
  //   // console.log("correo cargado:    ", correoCharge);

  //   // console.log("Fecha ingresada:   ", fechaEnter);
  //   // console.log("Fecha cargada:     ", fechaCharge);

  //   // console.log("Tipo de viaje WS:  ", typeTripEnter);
  //   // console.log("Tipo de viaje BD:  ", typeTripCharge);

  //   // console.log("==========================================================")

  //   // if(horariosdoc.find(element => element.date_of_travel === fechaEnter && element.correo_del_admin === correoEnter)){
  //   //   console.log("es diferente");
  //   // } else {
  //   //   // console.log("es igual");
  //   //   MySwal.fire({
  //   //     title: "Error",
  //   //     text: "El conductor ya tiene un viaje programado para esa fecha",
  //   //     icon: "error",
  //   //     confirmButtonText: "Ok",
  //   //   })
  //   // }
  // };

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
