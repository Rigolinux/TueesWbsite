import {createContext,useContext} from 'react';

import {signInWithEmailAndPassword,onAuthStateChanged,signOut } from "firebase/auth";
import {auth} from '../firebase'

import { useState,useEffect } from 'react';


export const authContext = createContext();

//un context para no hacer llamados
export const useAuth = () => {
    const context = useContext(authContext);
    return context;
}

export function AuthProvider({children}){

    const [user, setUser] = useState(false);
    
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
            
            if(user){
                const {email, photoURL, displayName, uid} = user;
                setUser({email, photoURL, displayName, uid});
            }else
            {
                setUser(null);
            }
        });
        return ()=> unsubscribe();
    },[])

    const logout= ()=>{
        return signOut(auth);
    }
    const login = (email,password) => {
        
        return signInWithEmailAndPassword(auth, email, password);
    
    }

    return (
        <authContext.Provider value={{login,logout,user}}>
            {children}
        </authContext.Provider>
    );
}