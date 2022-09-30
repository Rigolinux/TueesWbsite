import React from 'react';

import {useForm} from "react-hook-form";
import {Button} from "react-bootstrap";

import {useAuth} from '../context/authContext';

import {useNavigate} from 'react-router-dom';

function Login() {
    const [error,setError] = React.useState('');
    const {register, handleSubmit, formState: {errors}} = useForm();

    const {login} = useAuth();
    
    const navigate = useNavigate();

    const onSubmit = async(data) => {

        
        setError("");
        try {
          await login(data.email, data.password);

          
          navigate("/");
        } catch (error) {
          setError(error.message);
        }
        
        
       
    }
    const cssinput = "form-control mb-2";
    return (
        <div className='mb-3'>
            <div>
                <h1>Login</h1>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
        <form className='form-control mb-2' onSubmit={handleSubmit(onSubmit)}>
            <input  className="form-control mb-2 " {...register("email", {required: true})} />
            {errors.email && <span>This field is required</span>}
            <input type="password" className="form-control mb-3" {...register("password", {required: true})} />
            {errors.password && <span>This field is required</span>}
            <Button variant="dark" type="submit">Login</Button>
        </form>
        </div>
    );
}

export default Login