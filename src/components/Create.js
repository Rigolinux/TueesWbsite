import React from "react";
import { useForm } from "react-hook-form";

//mui date imports
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import moment from 'moment'
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

//mui type of trick mui imports
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

import { useNavigate } from 'react-router-dom'

//import firestore
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

// Imports del datapicker

// import dayjs from 'dayjs';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

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

  
    const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "Horarios"), {
        correo_del_admin: data.mailDriver,
        date_of_travel: dateWithNoInitialValue.toDate(),
        id_user: "zJVnuRYwoNdzxdcoNwcEfbqvws53", // Cambiarlo a futuro para la onda del perfil de conductor
        state: false,
        finalizado: false,
        type_of_trip: typeTrip,
      });
      console.log("Se creo el documento en la coleccion Horarios exitosamente")
      navigate('/')
    } catch (error) {
      console.log("Error al crear un documento en la coleccion de Horarios", error)
    }
  };

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
    console.log(typeTrip);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="mb-3">
              <h1>Crear un nuevo viaje</h1>
            </div>

            <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">Correo del transportista</label>
                <input
                  {...register("mailDriver", { required: true })}
                  // type="text"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha y hora de viaje</label>
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

              <button type="submit" className="btn btn-primary">
                Crear
              </button>

              <a href='/' className='btn btn-danger' style={{ marginLeft: '10px' }}> Regresar </a>

            </form>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default Create;
