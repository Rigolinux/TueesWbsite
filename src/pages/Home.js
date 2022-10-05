import React from 'react'

import {useAuth} from '../context/authContext';
import {useNavigate} from 'react-router-dom';
//components
import Show from '../components/Show';


function Home() {
    const navigate = useNavigate();
    const {logout} = useAuth();

    const handleLogout = async() => {
        
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    
    }
  return (
    <>
        {/* <h1>Home</h1> */}
        <button className='btn btn-primary' onClick={handleLogout}>Cerrar Sesion Temporal</button>

        <Show/>

        {/* <button className='btn btn-danger'>
            BOTON DE PRUEBA
        </button> */}

    </>
  )
}

export default Home