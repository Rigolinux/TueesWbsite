import React from 'react'
import { useForm } from 'react-hook-form'

//mui date imports
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import moment from 'moment'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

//mui type of trick mui imports
import { Select } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'

//import firestore
import { doc, setDoc } from "firebase/firestore";
import {db} from "../firebase"

function Create() {
  const {
    register,
    handleSubmit,
    
    formState: { errors },
  } = useForm()

  // states
  const [value, setValue] = React.useState(moment(new Date()))
  const [dateinv, setDateInv] = React.useState((new Date()))
  const [typeTrip, setTypeTrip] = React.useState('1')
  const [hours, setHours ] = React.useState();
  
  
 
 

  const onSubmit = async(data) => {
    try {
      
      await setDoc(doc(db,"testing","que la chupe cornejo"), {
      
        correo_del_admin: data.mailDriver,
        date_of_travel: dateinv.toString(),
        id_user: "qweqweqw",
        state: false,
        type_of_trip:typeTrip   
      })
      console.log("revisa la db pto")
    } catch (error) {
      console.log(error)
    }
    

  }
  const handleDateChangue = (newdate) => {
    setDateInv(moment(newdate))
    setValue(newdate)
  }
  const handleTimeChangue = (newtime) => {
    setHours(moment(newtime))
    console.log(hours)
    console.log(newtime)
    
  }
  const handleTypeTrip = (event) => {
    setTypeTrip(event.target.value)
    console.log(typeTrip)
  }
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
        <label>Correo de transportista</label>
        <input {...register('mailDriver', { required: true })} />

        <InputLabel id="type-trip">Tipo de viaje</InputLabel>
        <Select
          labelId="type-trip"
          id="tryp-selector"
          value={typeTrip}
          label="Tipo de viaje"
          onChange={handleTypeTrip}

        >
          <MenuItem value="1">Metrocentro-Universidad</MenuItem>
          <MenuItem value='2'>Universidad-Metrocentro</MenuItem>
        </Select>
        <TimePicker
          label="Time"
          value={hours}
          onChange={handleTimeChangue}
          renderInput={(params) => <TextField {...params} />}
        />
        {/* Date format  */}
        
        {/*  <DateTimePicker
          label="Date&Time picker"
          value={value}
          onChange={handleDateChangue}
          renderInput={(params) => <TextField {...params} />}
        />  */}
        <input type="submit" />
      </form>
    </LocalizationProvider>
  )
}

export default Create
