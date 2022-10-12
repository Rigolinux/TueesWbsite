//hooks reacts
import { useState, useEffect } from "react";

//router
import { Link } from "react-router-dom";

// database uses
import {
  collection,
  getDocs,
  // getDoc,
  deleteDoc,
  doc,
  where,
  query,
} from "firebase/firestore";

//database concetion from firebase
import { db } from "../firebase";

//icons
import { AiFillDelete } from "react-icons/ai";
import { GrUpdate } from "react-icons/gr";

//swift alert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import moment from "moment";

const MySwal = withReactContent(Swal);

function Show() {
  //hooks configurations                  ===== 1 - configuramos los hooks
  const [data, setData] = useState([]);

  //db referencies                        ===== 2 - referenciamos a la DB firestore
  // const dbcollection = collection(db,"testing");
  const dbcollection = collection(db, "Horarios");
  // const dbcollectionfilter = query(where(dbcollection, "id", "==", "hh21RxGampOZNaxydnRl"));

  //show all values                       ===== 3 - Funcion para mostrar TODOS los docs
  const getValues = async () => {
    // const showFilter  = query(dbcollection, where("id", "!=", "hh21RxGampOZNaxydnRl"));
    const showFilter  = query(dbcollection, where("id_user", "!=", "prueba"));
    const showSnap    = getDocs(showFilter);

    showSnap.then((querySnapshot) => {


    // await getDocs(dbcollection).then((querySnapshot) => {
      //recoger los valores de la db
      const dataDb = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      //asignarlos a un arreglo
      setData(dataDb);
    });
  };

  //delete values                         ===== 4 - Funcion para eliminar un doc
  const deleteValues = async (id) => {
    const deleteDb = doc(db, "Horarios", id);
    await deleteDoc(deleteDb);
    getValues();
    console.log("borrado");
  };

  //confirmation with sweet alert 2       ===== 5 - Funcion de confirmacion para SweetAlert2

  // 5 - Funcion de confirmacion para SweetAlert2

  // const confirmDelete = (id) => {
  //     const swalWithBootstrapButtons = MySwal.mixin({
  //         customClass: {
  //             confirmButton: 'btn btn-success',
  //             cancelButton: 'btn btn-danger'
  //         },
  //         buttonsStyling: false
  //     });

  //     swalWithBootstrapButtons.fire({
  //         title: 'Estas seguro?',
  //         text: "No podras revertir esto!",
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonText: 'Si, eliminar!',
  //         cancelButtonText: 'Cancelar',
  //         reverseButtons: true
  //     }).then((result) => {
  //         if (result.isConfirmed) {
  //             deleteValues(id);
  //             swalWithBootstrapButtons.fire(
  //                 'Eliminado!',
  //                 'El horario ha sido eliminado.',
  //                 'success'
  //             )
  //         } else if (
  //             /* Read more about handling dismissals below */
  //             result.dismiss === Swal.DismissReason.cancel
  //         ) {
  //             swalWithBootstrapButtons.fire(
  //                 'Cancelado',
  //                 'El registro esta a salvo',
  //                 'error'
  //             )
  //         }
  //     });
  // }

  const confirmDelete = (id) => {
    MySwal.fire({
      title: "¿Estas seguro de eliminar este viaje - horario?",
      text: "No podras revertir esta accion",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteValues(id);
        MySwal.fire("Eliminado!", "El horario ha sido eliminado.", "success");
      }
    });
  };

  //use effect for                        ===== 6 - usamos useEffect
  useEffect(() => {
    getValues();
    // console.log(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //values of data

  //return view to component

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="d-grid gap-2">
            <Link to="/create" className="btn btn-secondary mt-2 mb-2">
              Crear un nuevo viaje.
            </Link>
            <Link to="/crearUsuario" className="btn btn-secondary mt-2 mb-2">
              Crear un nuevo Usuario
            </Link>
          </div>

          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>Encargado.</th>
                <th>Tipo De Viaje.</th>
                <th>Fecha Estimada.</th>
                <th>Acciones.</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  {/* <td>{item.correo_del_admin}</td> */}
                  <td>{item.nombre}</td>
                  <td>
                    {item.type_of_trip === "1"
                      ? "Metrocentro - Universidad"
                      : "Universidad - Metrocentro"}
                  </td>
                  {/* <td>{moment(item.date_of_travel).format('LLLL')}</td> */}
                  <td>{moment(item.date_of_travel.toDate()).format("lll")}</td>
                  {/* <td>{item.date_of_travel}</td>  */}
                  <td>
                    <Link to={`/edit/${item.id}`} className="btn btn-primary ">
                      <GrUpdate />
                    </Link>

                    <button
                      className="btn btn-danger m-2"
                      onClick={() => {
                        confirmDelete(item.id);
                      }}
                    >
                      <AiFillDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Show;
