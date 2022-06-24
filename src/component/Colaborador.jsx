import useProyectos from "../hooks/useProyectos"

const Colaborador = ({colaborador}) => {
	const {handleModalEliminarColaborador} = useProyectos();
  return (
	<div className="flex justify-between items-center border-b p-5">
	<div>
		<p>{ colaborador.nombre }</p>
		<p className="text-sm text-gray-700">{colaborador.email}</p>
		</div>
	<button 
	type="button"
	className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
	onClick={()=>handleModalEliminarColaborador(colaborador)}
	>
		eliminar
	</button>
	</div>

  )
}

export default Colaborador