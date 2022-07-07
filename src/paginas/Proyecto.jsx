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
import Loading from "../component/Loading";

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
    actualizarTareaEstadoProyectoSocket,
    page,
    setPage,
    pageCount,
    tareasCount
  } = useProyectos();
  const { nombre } = proyectoItem;
  const isAdmin = useAdmin();

  useEffect(() => {
    obtenerProyecto(params.id, page);
  }, [page]);
  
  //socket
  useEffect(() => {
    socket = io(import.meta.env.VITE_URL_BACK);
    socket.emit("proyecto", params.id);
  }, []);

  useEffect(() => {
    socket.on("tarea-agregada", (tareaNueva) => {
      if (tareaNueva.proyecto === proyectoItem._id) {
        submitTareaProyectoSocket(tareaNueva);
      }
    });

    socket.on("tarea-eliminada", (tareaEliminada) => {
      const {tarea, tareasRestantes} = tareaEliminada;
      if (tarea.proyecto === proyectoItem._id) {
        eliminarTareaProyectoSocket(tareaEliminada);
      }
    });

    socket.on("tarea-actualizada", (tareaActualizada) => {
      if (tareaActualizada.proyecto === proyectoItem._id) {
        actualizarTareaProyectoSocket(tareaActualizada);
      }
    });

    socket.on("estado-tarea-actualizada", (tareaEstadoAct) => {
      if (tareaEstadoAct.proyecto._id === proyectoItem._id) {
        actualizarTareaEstadoProyectoSocket(tareaEstadoAct);
      }
    });

    return () => {
      socket.off("tarea-agregada");
      socket.off("tarea-eliminada");
      socket.off("tarea-actualizada");
      socket.off("estado-tarea-actualizada");
    };
  });

  const { msg } = alerta;

  //paginacion pa
  function handlePrevious() {
    setPage((p) => {
      if (p === 1) return p;
      return p - 1;
    });
  }

  function handleNext() {
    setPage((p) => {
      if (p === pageCount) return p;
      return p + 1;
    });
  }

  return  (
    <>
      <div className="flex justify-between">
        <h1 className="font-blank text-4xl">{nombre}</h1> 
        {cargando ? (<div className="flex items-center"><Loading /></div>) : ''}
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

      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-700 dark:text-gray-400">
            Pagina <span className="font-semibold text-gray-900 ">{page}</span>{' '}de{' '}<span className="font-semibold text-gray-900">{pageCount}</span>{' '}- Total: {' '}<span className="font-semibold text-gray-900">{tareasCount}</span> Tareas
        </span>
        <div className="inline-flex mt-2 xs:mt-0">
            <button
              className={`py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-l 
              hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 
              dark:hover:bg-gray-700 dark:hover:text-white ${page === 1 && 'opacity-25'}`}
              onClick={handlePrevious}
              disabled={page === 1}
            >
              Prev
            </button>
          

          <button
            className={`py-2 px-4 text-sm font-medium text-white 
            bg-gray-800 rounded-r border-0 border-l border-gray-700 
            hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 
            dark:hover:bg-gray-700 dark:hover:text-white ${page === pageCount && 'opacity-25'}`}
            disabled={page === pageCount}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
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
