//pages
import Login        from "./pages/Login";
import Home         from "./pages/Home";
import RequireAuth  from "./auth/RequireAuth";

// Importamos nuestros componentes
import Create from './components/Create';
import Edit   from './components/Edit';
import Show   from "./components/Show";

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
        <Route index            element={<Home />} />
        <Route path="/create"   element={<Create />} />
        <Route path="/edit/:id" element={<Edit />} />
      </Route>
      <Route path="/login"  element={<Login />} />
      {/* <Route path="/show"   element={<Show />} /> */}
    </Routes>
  </>
}

export default App;
