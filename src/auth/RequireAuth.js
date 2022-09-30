import React from 'react'

//state user
import {useAuth} from '../context/authContext';


import {Navigate} from 'react-router-dom';
import {Outlet} from 'react-router-dom';

function RequireAuth() {
    
    const {user} = useAuth();
    if(!user){
        return <Navigate to="/login" />
    }
    
    return <div><Outlet /></div>;

}

export default RequireAuth