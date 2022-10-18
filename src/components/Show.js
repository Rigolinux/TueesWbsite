//hooks reacts
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

//router
import { Link } from "react-router-dom";

// database uses
import {
  collection,
  getDocs,
  // getDoc,
  deleteDoc,
  doc,
  // where,
  query,
  orderBy,
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
    // const showFilter  = query(dbcollection, where("id_user", "!=", "prueba"));
    const showFilter = query(dbcollection, orderBy("date_of_travel", "asc"));
    const showSnap = getDocs(showFilter);

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

  //

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <body style={{ background: "#023262", height: "100vh", fontFamily: "" }}>
      <center>
        <div className="container">
          <br />
          <br />

          <table>
            <tr>
              <td style={{ width: "20%", justifyContent: "center" }}>
                <Link to="/create" className="btn btn-secondary mt-2 mb-2">
                  Crear Horario.
                </Link>
              </td>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <td style={{ width: "20%", justifyContent: "center" }}>
                <Link
                  to="/createUser"
                  className="btn btn-secondary mt-2 mb-2"
                >
                  Crear Usuario.
                </Link>
              </td>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <td style={{ width: "20%", justifyContent: "center" }}>
                <Link
                  to="/history"
                  className="btn btn-secondary mt-2 mb-2"
                >
                  Ver Historial.
                </Link>
              </td>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <td style={{ width: "20%", justifyContent: "center" }}>
                {/* <Link to="/create" className="btn btn-secondary mt-2 mb-2">Crear un nuevo viaje.</Link> */}
                <Button variant="danger" onClick={handleLogout}>
                  Cerrar Sesion.
                </Button>
              </td>
            </tr>
          </table>

          <br />
          <br />

          <table className="table table-dark table-hover">
            <thead>
              <tr style={{ textAlign: "center" }}>
                {/* <th>Encargado.</th>
                <th>Tipo De Viaje.</th>
                <th>Fecha Estimada.</th>
                <th>Acciones.</th> */}
                <th>Conductor.</th>
                <th>Ruta.</th>
                <th>Fecha.</th>
                <th>Opciones.</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  {/* <td>{item.correo_del_admin}</td> */}
                  <td style={{ textAlign: "center" }}>{item.nombre}</td>
                  <td style={{ textAlign: "center" }}>
                    {item.type_of_trip === "1"
                      ? "Metrocentro - Universidad"
                      : "Universidad - Metrocentro"}
                  </td>
                  {/* <td>{moment(item.date_of_travel).format('LLLL')}</td> */}
                  <td style={{ textAlign: "center" }}>
                    {moment(item.date_of_travel.toDate()).format("lll")}
                  </td>
                  {/* <td>{item.date_of_travel}</td>  */}
                  <td style={{ textAlign: "center" }}>
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
        <br />
        <div style={{ color: "white" }}>
          {/* Universidad Evangélica de El Salvador - TUess - Derechos Reservados © Octubre 2022 */}
          TUees - Derechos Reservados © Octubre 2022
        </div>
      </center>
    </body>
  );
}

export default Show;
