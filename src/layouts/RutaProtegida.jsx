
import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";


const RutaProtegida = () => {
  const { auth, cargando } = useAuth();
  if(cargando) return 'Cargando...';
  return (
	<>
		{(auth.usuario !== undefined && auth.usuario._id) ? (
      <div>
        <Header className="bg-gray-100"/>
        <div className="md:flex md:min-h-screen">
          <Sidebar />
          <main className="flex-1 p-10">
            <Outlet />
          </main>
        </div>
      </div>
    )
    : 
    <Navigate  to="/" />
    
    }
	</>
  )
}

export default RutaProtegida