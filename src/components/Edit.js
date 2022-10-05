import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import TextField                from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker }       from '@mui/x-date-pickers/DateTimePicker'
import { AdapterMoment }        from '@mui/x-date-pickers/AdapterMoment'

// Imports de mui type of trick
import { Select } from '@mui/material'
import MenuItem   from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import { useNavigate, useParams } from 'react-router-dom'

// Imports de la base de datos de firebase-firestore
import { getDoc, updateDoc, doc, collection} from 'firebase/firestore'
import { db } from '../firebase'

function Edit() {

  const [edit_correo_del_admin, set_edit_correo_del_admin]  = useState('')
  const [edit_date_of_travel, set_edit_date_of_travel]       = useState(null)
  const [edit_id_user, set_edit_id_user]                     = useState('')
  const [edit_state, set_edit_state]                         = useState('')
  const [edit_finalizado, set_edit_finalizado]               = useState('')
  const [edit_type_of_trip, set_edit_type_of_trip]           = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Configurando los Hooks

  const [typeTrip, setTypeTrip] = useState('1')
  const [ dateWithNoInitialValue, setDateWithNoInitialValue ] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  // Funcion para actualizar el documento

  const actHorario = async(data) => {
    try{
      await updateDoc(doc(db, "Horarios", id),{
        correo_del_admin: data.mailDriver,
        date_of_travel:   dateWithNoInitialValue.toDate(),
        id_user:          "zJVnuRYwoNdzxdcoNwcEfbqvws53",     // Cambiarlo a futuro para la onda del perfil de conductor
        state:            false,
        finalizado:       false,
        // type_of_trip:     typeTrip,
        type_of_trip:     edit_type_of_trip,
      })
      console.log("Se actualizo el documento en la coleccion Horarios exitosamente")
      navigate('/')
    } catch (error) {
      console.log("Error al actualizar un documento en la coleccion de Horarios", error)
    }
  }

  // const actHorario = async(e) => {
  //   // e.preventDefault()
  //   try{
  //     const horarioDoc = doc(db, "Horarios", id)
  //     const data = { 
  //       correo_del_admin: correo_del_admin,
  //       date_of_travel:   dateWithNoInitialValue.toDate(),
  //       id_user:          id_user,
  //       state:            state,
  //       finalizado:       finalizado,
  //       type_of_trip:     typeTrip,
  //     }
  //     await updateDoc(horarioDoc, data)
  //     // await updateDoc(doc(db, "Horarios", id), {
  //     //   correo_del_admin: data.mailDriver,
  //     //   date_of_travel:   dateWithNoInitialValue.toDate(),
  //     //   id_user:          "zJVnuRYwoNdzxdcoNwcEfbqvws53",     // Cambiarlo a futuro para la onda del perfil de conductor
  //     //   state:            false,
  //     //   finalizado:       false,
  //     //   type_of_trip:     typeTrip,
  //     // })
  //     console.log("Se actualizo el documento en la coleccion Horarios exitosamente")
  //     // navigate('/')
  //   } catch (error) {
  //     console.log("Error al actualizar un documento en la coleccion de Horarios", error)
  //   }
  // }

  const getHorarioid = async(id) => {
    try{
      const horarioDoc = doc(db, "Horarios", id)
      const horario = await getDoc(horarioDoc)
      if(horario.exists()){
        set_edit_correo_del_admin (horario.data().correo_del_admin)
        set_edit_date_of_travel   (horario.data().date_of_travel)
        set_edit_id_user          (horario.data().id_user)
        set_edit_state            (horario.data().state)
        set_edit_finalizado       (horario.data().finalizado)
        set_edit_type_of_trip     (horario.data().type_of_trip)

        console.log(horario.data())
      } else {
        console.log("No se encontro el documento")
      }
    } catch (error) {
      console.log("Error al obtener el documento", error)
    }
  }

  // const getHorarioid = async(id) => {
  //   const horarioDoc = await getDoc(doc(db, "Horarios", id))
  //   if(horarioDoc.exists()){
  //     // return horarioDoc.data()
  //     setcorreo_del_admnin(horarioDoc.data().correo_del_admin)
  //     setdate_of_travel   (horarioDoc.data().date_of_travel)
  //     setid_user          (horarioDoc.data().id_user)
  //     setstate            (horarioDoc.data().state)
  //     setfinalizado       (horarioDoc.data().finalizado)
  //     settype_of_trip     (horarioDoc.data().type_of_trip)
  //     console.log         ("Se encontro el documento", horarioDoc.data())
  //   } else {
  //     console.log("No se encontro el documento")
  //   }
  // }

  useEffect(() => {
    getHorarioid(id)
    // eslint-disable-next-line
  }, [])

  const handleTypeTrip = (event) => {
    // setTypeTrip(event.target.value)
    set_edit_type_of_trip(event.target.value)
    console.log("Selecciono el tipo de viaje: ", event.target.value)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div className='container'>
      <div className='row'>
        <div className='col'>

          <div className='mb-3'>
            <h1>Editar un viaje</h1>
          </div>
          
          <form onSubmit={handleSubmit(actHorario)}>

            <div className='mb-3'>
              <label className='form-label'>Correo del conductor</label>
              <input 
                {...register('mailDriver', { required: true })}
                type='text'
                className='form-control'
                value={edit_correo_del_admin}
                onChange={(e) => set_edit_correo_del_admin(e.target.value)}
              />
            </div>

            <div className='mb-3'>
              <label className='form-label'>Nueva Fecha y hora del viaje</label>
              
              <DateTimePicker
                value={dateWithNoInitialValue}
                onChange={(newValue) => { setDateWithNoInitialValue(newValue); }}
                renderInput={(params) => <TextField {...params} />}
                className='form-control'
              />
            </div>

            <div className='mb-3'>
              <InputLabel className='form-label' id='type-trip'>Nuevo Tipo de viaje</InputLabel>

              {/* <div className='row'>
                <label className='form-label'>Tipo de viaje anterior:
                  {
                    set_edit_type_of_trip === '1' ? ' Metrocentro - Universidad' : ' Universidad - Metrocentro'
                  }
                  {edit_type_of_trip === 1 ? " Metrocentro - Universidad" : " Universidad - Metrocentro"}
                </label>
              </div> */}

              <Select
                labelId="type-trip"
                id="tryp-selector"
                value={edit_type_of_trip}
                label="Tipo de viaje"
                onChange={handleTypeTrip}
                className='form-select'
              >
                <MenuItem value="1">Metrocentro - Universidad</MenuItem>
                <MenuItem value="2">Universidad - Metrocentro</MenuItem>
              </Select>

            </div>
            
            <button type='submit' className='btn btn-primary'>
              Actualizar
            </button>

            <a href='/' className='btn btn-danger' style={{ marginLeft: '10px' }}> Regresar </a>

          </form>
        </div>
      </div>
    </div>
    </LocalizationProvider>
  )
}

export default Edit