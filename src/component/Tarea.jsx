import { formatearFecha } from "../helpers/formatearFecha";
import useAdmin from "../hooks/useAdmin";
import useProyectos from "../hooks/useProyectos";

const Tarea = ({ tarea }) => {
  const { nombre, descripcion, fechaEntrega, estado, prioridad, _id, completado } = tarea;
  const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } = useProyectos();
  const isAdmin = useAdmin();
  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div className="flex flex-col items-start">
        <p className="mb-1 text-xl">{nombre}</p>
        <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
        <p className="mb-1 text-xl">{formatearFecha(fechaEntrega)}</p>
        <p className="mb-1 text-gray-600">{prioridad}</p>
        {estado && <p className="text-xs bg-green-700 text-white uppercase rounded-lg p-2">Completado por: {completado?.nombre}</p>}
      </div>
      <div className="flex gap-1 flex-col md:flex-row">
        {isAdmin && (
          <button
            className="bg-indigo-600 px-4 py-3 text-white text-sm font-bold rounded-lg"
            onClick={() => handleModalEditarTarea(tarea)}
          >
            Editar
          </button>
        )}

        <button className={`${ estado ? 'bg-sky-600' : 'bg-gray-600'} px-4 py-3 
        text-white text-sm font-bold rounded-lg`} 
        onClick={() => completarTarea(_id)}
        >
          {estado ? 'Completa' : 'Incompleta' }
        </button>

        {isAdmin && (
          <button
            className="bg-red-600 px-4 py-3 text-white text-sm font-bold rounded-lg"
            onClick={() => handleModalEliminarTarea(tarea)}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default Tarea;
