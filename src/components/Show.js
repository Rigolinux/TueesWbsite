
//hooks reacts
import {useState, useEffect} from 'react';

//router
import {Link} from 'react-router-dom';

// database uses
import {collection, getDocs, getDoc, deleteDoc,doc} from "firebase/firestore";

//database concetion from firebase
import {db} from '../firebase';

//icons
import { AiFillDelete } from "react-icons/ai";
import { GrUpdate } from "react-icons/gr";

//swift alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import moment from 'moment';

const MySwal = withReactContent(Swal);



function Show() {
    //hooks configurations
    const [data, setData] = useState([]);
    

    //db referencies
    const dbcollection = collection(db,"testing");
    //show all values
    const getValues = async () => {
        
        
        await getDocs(dbcollection).then((querySnapshot) => {
            
            //recoger los valores de la db
            const dataDb = querySnapshot.docs.map((doc) => ({...doc.data(),id:doc.id}));
            //asignarlos a un arreglo
            setData(dataDb)
        });
        
        
        
    }
    //delete values
    const deleteValues = async (id) => {
      const deleteDb =  doc(db, "Horarios", id);
        await deleteDoc(deleteDb);
        getValues();

    }
    //confirmation with sweet alert 2

    //use effect for
    useEffect(() => {
       getValues()
        console.log(data);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //values of data
   
   
    //return view to component

  return (
    <>
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className='d-grid gap-2'>
                        <Link to='/create' className='btn btn-secondary mt-2 mb-2'>Crear</Link>
                    </div>
                    <table className="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th>Encargado</th>
                              
                                <th>Tipo de viaje</th>
                                <th>fecha estimada </th>
                                <th>Acciones</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                              { 
                                data.map( (item) => (
                                    <tr key={item.id}>
                                        <td>{item.correo_del_admin}</td>
                                        <td>{item.type_of_trip==="1" ?"Metrocentro-Universidad" :"Universidad-Metrocentro"}</td>
                                        {/* <td>{moment(item.date_of_travel.toDate()).format('lll')}</td>  */}
                                        {/* <td>{item.date_of_travel}</td>  */}
                                        <td> 
                                            <Link to={`/edit/${item.id}`} className='btn btn-primary '><GrUpdate /></Link>
                                            <button className='btn btn-danger m-2' onClick={() => {deleteValues(item.id)} }><AiFillDelete /></button>
                                            
                                        </td>
                                    </tr>
                                )
                            )
                                   
                                
                        }  
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
  )
}

export default Show