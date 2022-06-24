import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useProyectos from "../hooks/useProyectos";
import FormularioColaborador from "../component/FormularioColaborador";
import Alerta from "../component/Alerta";


const NuevoColaborador = () => {
  const { obtenerProyecto, proyectoItem, cargando, colaborador, agregarColaborador, alerta } = useProyectos();
  const params = useParams();

  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

  if(!proyectoItem._id) return <Alerta alerta={alerta}/>

 
  return (
    <>
      <h1 className="text-4xl font-black">
        Añadir colaborador(a) - Proyecto: {proyectoItem.nombre}
      </h1>
      <div className="mt-10 flex justify-center">
        <FormularioColaborador />
      </div>

	{cargando ? '...Cargando' : colaborador?._id && (
		<div className="flex justify-center mt-10">
			<div className="bg-white py-10 px-5 md:w-10/12 rounded-lg shadow w-full">
				<h1 className="text-2xl font-bold mb-10 text-center">Resultado: </h1>

				<div className="flex justify-between items-center">
					<p>{colaborador.nombre}</p>
					<button
					type="button"
					className="bg-slate-600 px-5 py-2 rounded-lg uppercase text-sm font-bold text-white"
					onClick={() => agregarColaborador({ email: colaborador.email })}
					>Agregar colaborador</button>
				</div>
			</div>
		</div>
	)}
    </>
  );
};

export default NuevoColaborador;
