//pages
import Login        from "./pages/Login";
import Home         from "./pages/Home";
import RequireAuth  from "./auth/RequireAuth";

// Importamos nuestros componentes
import Create from './components/Create';
import Edit   from './components/Edit';
import Show   from "./components/Show";
// import Prueba from "./components/prueba";
import CrearUsuario from "./components/CrearUsuario";
import History from "./components/History";
import CreateUser from "./components/CreateUser";

// Importamos el enrutador o el router
// router react 
import { Routes,Route } from "react-router-dom";

//context
import {useAuth} from './context/authContext';

function App() {
  const {user} = useAuth();

  if(user === false){
    return <p>Loading user....</p>
  }

  return <>
    <Routes>
      <Route path="/" element={<RequireAuth/>}>
        <Route index                element={<Home />} />
        <Route path="/create"       element={<Create />} />
        <Route path="/edit/:id"     element={<Edit />} />
        <Route path="/show"         element={<Show />} />
        <Route path="/crearUsuario" element={<CrearUsuario />} />
        <Route path="/history"      element={<History />} />
        <Route path="/createUser"   element={<CreateUser />} />
        {/* <Route path="/prueba"   element={<Prueba />} /> */}

      </Route>
      <Route path="/login"  element={<Login />} />
      {/* <Route path="/show"   element={<Show />} /> */}
    </Routes>
  </>
}

export default App;
