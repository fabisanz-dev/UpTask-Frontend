import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ModalFormularioTarea from "../component/ModalFormularioTarea";
import ModalEliminarTarea from "../component/ModalEliminarTarea";
import useProyectos from "../hooks/useProyectos";
import Tarea from "../component/Tarea";
import Alerta from "../component/Alerta";
import Colaborador from "../component/Colaborador";
import ModalEliminarColaborador from "../component/ModalEliminarColaborador";
import useAdmin from "../hooks/useAdmin";
import io from "socket.io-client";

let socket;

const Proyecto = () => {
  const params = useParams();
  const {
    obtenerProyecto,
    proyectoItem,
    cargando,
    modalFormularioTarea,
    handleModalTarea,
    alerta,
    submitTareaProyectoSocket,
    eliminarTareaProyectoSocket,
    actualizarTareaProyectoSocket,
    actualizarTareaEstadoProyectoSocket
  } = useProyectos();
  const { nombre } = proyectoItem;
  const isAdmin = useAdmin();

  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

  //socket
  useEffect(() => {
    socket = io(import.meta.env.VITE_URL_BACK)
    socket.emit("proyecto", params.id)
  }, []);

  useEffect(() => {
    socket.on('tarea-agregada', tareaNueva=>{
      if(tareaNueva.proyecto === proyectoItem._id){
        submitTareaProyectoSocket(tareaNueva)
      }
    })

    socket.on('tarea-eliminada', tareaEliminada=>{
      if(tareaEliminada.proyecto === proyectoItem._id){
        eliminarTareaProyectoSocket(tareaEliminada)
      }
    })

    socket.on('tarea-actualizada', tareaActualizada=>{
      if(tareaActualizada.proyecto === proyectoItem._id){
        actualizarTareaProyectoSocket(tareaActualizada)
      }
    })

    socket.on('estado-tarea-actualizada', tareaEstadoAct=>{
      if(tareaEstadoAct.proyecto._id === proyectoItem._id){
        actualizarTareaEstadoProyectoSocket(tareaEstadoAct)
      }
    })

    return () => {
      socket.off("tarea-agregada")
      socket.off("tarea-eliminada")
      socket.off("tarea-actualizada")
      socket.off("estado-tarea-actualizada")
    }

  })

  const { msg } = alerta;


  return cargando ? (
    <svg
      role="status"
      className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  ) : (
    <>
      <div className="flex justify-between">
        <h1 className="font-blank text-4xl">{nombre}</h1>
        {isAdmin && (
          <div className="flex items-center text-gray-400 hover:text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <Link
              to={`/proyectos/editar/${params.id}`}
              className="uppercase font-bold"
            >
              Editar
            </Link>
          </div>
        )}
      </div>

      {isAdmin && (
        <button
          onClick={handleModalTarea}
          className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-500
 text-white text-center mt-5 flex gap-2 items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
          Agregar
        </button>
      )}

      <p className="text-xl font-bold mt-10">Tareas del proyecto</p>
      
      <div className="bg-white shadow mt-2 rounded-lg">
        {proyectoItem.tareas?.length ? (
          proyectoItem.tareas?.map((tarea) => (
            <Tarea key={tarea._id} tarea={tarea} />
          ))
        ) : (
          <div className="text-center my-5 p-10">no hay tareas</div>
        )}
      </div>

      {isAdmin && (
        <>
          <div className="flex items-center justify-between m-10">
            <p className="text-xl font-bold">Colaboradores del proyecto</p>

            <Link
              to={`/proyectos/nuevo-colaborador/${proyectoItem._id}`}
              className="text-gray-400 hover:text-black font-bold uppercase"
            >
              Añadir
            </Link>
          </div>
          <div className="bg-white shadow mt-2 rounded-lg">
            {proyectoItem.colaboradores?.length ? (
              proyectoItem.colaboradores?.map((colaborador) => (
                <Colaborador key={colaborador._id} colaborador={colaborador} />
              ))
            ) : (
              <div className="text-center my-5 p-10">no hay colaboradores</div>
            )}
          </div>
        </>
      )}

      <ModalFormularioTarea />
      <ModalEliminarTarea />
      <ModalEliminarColaborador />
    </>
  );
};

export default Proyecto;
