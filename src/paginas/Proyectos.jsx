import Alerta from "../component/Alerta";
import PreviewProyectos from "../component/PreviewProyectos";
import useProyectos from "../hooks/useProyectos";
import { useEffect } from "react";


const Proyectos = () => {
  const { proyectos, alerta } = useProyectos();
  const { msg } = alerta;

 
  return (
	<>
    <h1 className="text-4xl font-black">
      Mis proyectos
    </h1>  
    { msg && <Alerta alerta={alerta}/> }
    <div className="bg-white shadow mt-10 rounded-lg p-5">
      {proyectos ? (
        proyectos.map(proyecto => {
         return <PreviewProyectos key={proyecto._id} proyecto={proyecto} />
        })
      ):
      <p className="text-center text-gray-600 uppercase">
        No existen proyectos</p>
      }
    </div>

  </>
  )
}

export default Proyectos