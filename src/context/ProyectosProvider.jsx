import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import io from "socket.io-client";

let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {
  const [proyectos, setProyectos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [proyectoItem, setProyectoItem] = useState({});
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  //modal state
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
  const [tarea, setTarea] = useState({}); //state para editar modal
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
  //colaboradores state
  const [colaborador, setColaborador] = useState({});
  const [modalEliminarColaborador, setModalEliminarColaborador] =
    useState(false);
  //buscador
  const [buscador, setBuscador] = useState(false);

  useEffect(() => {
    socket = io(import.meta.env.VITE_URL_BACK);
  }, []);

  /**
   * funcion para manejar el comp: Alerta error
   * @param {*} alertaObj
   */
  const alertaFn = (alertaObj) => {
    setAlerta(alertaObj);
    setTimeout(() => {
      setAlerta({});
    }, 3000);
  };

  /**
   * Recibir los datos del formulario proyecto
   * @param {*} proyecto
   */
  const recibirDatosProyectos = async (proyecto) => {
    const token = sessionStorage.getItem("token-user");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    //si existe id (obtenida del parametro) es edicion-actualizacion
    if (proyecto.id) {
      try {
        const { data } = await clienteAxios.put(
          `/proyectos/${proyecto.id}`,
          proyecto,
          config
        );
        //actualizar state
        const proyectoAct = proyectos.map((proyectoState) =>
          proyectoState._id !== data._id ? proyectoState : data
        );
        setProyectos(proyectoAct);

        setAlerta({
          msg: "Proyecto actualizado correctamente",
          error: false,
        });
        setTimeout(() => {
          setAlerta({});
          navigate("/proyectos");
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    } else {
      //si NO existe id (obtenida del parametro) es creacion
      try {
        const { data } = await clienteAxios.post(
          "/proyectos",
          proyecto,
          config
        );
        setProyectos([...proyectos, data.proyectoAlmacenado]); //actualizar el state con la nueva data
        setAlerta({
          msg: "Proyecto creado correctamente",
          error: false,
        });
        setTimeout(() => {
          setAlerta({});
          navigate("/proyectos");
        }, 3000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //obtener proyectos
  useEffect(() => {
    const obtenerProyectos = async () => {
      const token = sessionStorage.getItem("token-user");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      try {
        const { data } = await clienteAxios.get("/proyectos/", config);
        console.log(data);
        setProyectos(data);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerProyectos();
  }, []);

  const obtenerProyecto = async (id) => {
    const token = sessionStorage.getItem("token-user");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    setCargando(true);
    try {
      const { data } = await clienteAxios.get(`/proyectos/${id}`, config);
      //setear data
      setProyectoItem(data);
    } catch (error) {
      navigate("/proyectos");
      alertaFn({
        msg: error.response.data.msg,
        error: true,
      });
    }
    setTimeout(() => {
      setCargando(false);
    }, 1000);
  };

  //Eliminar proyecto
  const eliminarProyecto = async (id) => {
    console.log("Eliminando proyecto...", id);
    const token = sessionStorage.getItem("token-user");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    if (id) {
      try {
        const { data } = await clienteAxios.delete(`/proyectos/${id}`, config);
        //actualizar state
        const proyectoAct = proyectos.filter(
          (proyectoState) => proyectoState._id !== id
        );
        setProyectos(proyectoAct);

        setAlerta({
          msg: "Proyecto Eliminado correctamente",
          error: false,
        });
        setTimeout(() => {
          setAlerta({});
          navigate("/proyectos");
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //Cambiar estado del modal
  const handleModalTarea = () => {
    setModalFormularioTarea(!modalFormularioTarea);
    setTarea({}); //limpiar state para crear una nueva tarea
  };

  /**
   * recibirDatosTareas pasar obj tarea
   * @param {*} tarea
   */
  const recibirDatosTareas = async (tarea) => {
    console.log(tarea);
    if (!tarea.id) {
      await agregarTarea(tarea);
    } else {
      await actualizarTarea(tarea);
    }
  };

  const agregarTarea = async (tarea) => {
    const token = sessionStorage.getItem("token-user");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    try {
      const { data } = await clienteAxios.post("/tareas", tarea, config);

      setAlerta({});
      setModalFormularioTarea(false);

      //socket emitir data tarea creado
      socket.emit("nueva-tarea", data);
    } catch (error) {
      console.log(error);
    }
  };

  const actualizarTarea = async (tarea) => {
    const token = sessionStorage.getItem("token-user");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    try {
      const { data } = await clienteAxios.put(
        `/tareas/${tarea.id}`,
        tarea,
        config
      );
      //socket para actializar
      socket.emit("actualizar-tarea", data);

      setAlerta({});
      setModalFormularioTarea(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalEditarTarea = (tarea) => {
    setTarea(tarea);
    setModalFormularioTarea(true);
  };

  const handleModalEliminarTarea = (tarea) => {
    setTarea(tarea);
    setModalEliminarTarea(!modalEliminarTarea);
  };

  const eliminarTarea = async () => {
    const token = sessionStorage.getItem("token-user");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    try {
      const { data } = await clienteAxios.delete(
        `/tareas/${tarea._id}`,
        config
      );

      setAlerta({
        msg: data.msg,
        error: false,
      });
      setTimeout(() => {
        setAlerta({});
      }, 2000);

      //socket
      socket.emit("eliminar-tarea", tarea);

      setModalEliminarTarea(false);
      setTarea({});
    } catch (error) {}
  };

  /**
   * Recibir datos del colaborador para realizar peticion de busqueda
   * @param {*} email
   */
  const submitColaborador = async (email) => {
    const token = sessionStorage.getItem("token-user");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    try {
      const { data } = await clienteAxios.post(
        `/proyectos/colaboradores`,
        { email },
        config
      );
      setColaborador(data);
    } catch (error) {
      alertaFn({
        msg: error.response.data.msg,
        error: false,
      });
    }
  };

  /**
   * Recibir el email de colaborador para realizar peticion de agregado
   * @param {*} email
   */
  const agregarColaborador = async (email) => {
    console.log(email);
    const token = sessionStorage.getItem("token-user");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    try {
      const { data } = await clienteAxios.post(
        `/proyectos/colaboradores/${proyectoItem._id}`,
        email,
        config
      );
      console.log(data);
      alertaFn({
        msg: data.msg,
        error: false,
      });
      setColaborador({});
    } catch (error) {
      alertaFn({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const handleModalEliminarColaborador = (colaborador) => {
    setColaborador(colaborador);
    setModalEliminarColaborador(!modalEliminarColaborador);
  };

  const eliminarColaborador = async () => {
    const token = sessionStorage.getItem("token-user");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    try {
      const { data } = await clienteAxios.post(
        `/proyectos/eliminar-colaborador/${proyectoItem._id}`,
        { id: colaborador._id },
        config
      );

      const proyectoActualizado = { ...proyectoItem };
      proyectoActualizado.colaboradores =
        proyectoActualizado.colaboradores.filter(
          (colaboradorState) => colaboradorState._id !== colaborador._id
        );
      setProyectoItem(proyectoActualizado);
      alertaFn({
        msg: data.msg,
        error: false,
      });
      setColaborador({});
      setModalEliminarColaborador(!modalEliminarColaborador);
    } catch (error) {
      console.log(error);
    }
  };

  const completarTarea = async (id) => {
    const token = sessionStorage.getItem("token-user");
    if (!token) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    try {
      const { data } = await clienteAxios.post(
        `/tareas/estado/${id}`,
        {},
        config
      );
      //socket is
      socket.emit("actualizar-estado", data);

      setTarea({});
      setAlerta({});
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleBuscador = () => {
    setBuscador(!buscador);
  };

  //sockets
  const submitTareaProyectoSocket = (tarea) => {
    //actualizar el state de proyectoItem cuando se agrega un nueva tarea
    const proyectoActualizado = { ...proyectoItem };
    proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];
    setProyectoItem(proyectoActualizado);
  };

  const eliminarTareaProyectoSocket = (tarea) => {
    //actualizar el state proyectosItem para quitar la tarea eliminada
    const proyectoActualizado = { ...proyectoItem };
    proyectoActualizado.tareas = proyectoActualizado.tareas.filter(
      (tareaState) => tareaState._id !== tarea._id
    );
    setProyectoItem(proyectoActualizado);
  };

  const actualizarTareaProyectoSocket = (tarea) => {
    //actualizar el state de proyectoItem cuando se agrega un nueva tarea y reset alerta y modal
    const proyectoActualizado = { ...proyectoItem };
    proyectoActualizado.tareas = proyectoActualizado.tareas.map((tareaState) =>
      tareaState._id === tarea._id ? tarea : tareaState
    );
    setProyectoItem(proyectoActualizado);
  };

  const actualizarTareaEstadoProyectoSocket = (tarea) => {
    const proyectoActualizado = { ...proyectoItem };
    proyectoActualizado.tareas = proyectoActualizado.tareas.map((tareaState) =>
      tareaState._id === tarea._id ? tarea : tareaState
    );
    setProyectoItem(proyectoActualizado);
  };

  const cerrarSesionProyectos = () => {
    setProyectos([])
    setProyectoItem({})
    setAlerta({})
  }

  return (
    <ProyectosContext.Provider
      value={{
        proyectos, //, pag proyecto, header
        alertaFn,
        alerta,
        recibirDatosProyectos, //comp FormularioProyecto
        obtenerProyecto, //pag Proyecto, proyectoEditar
        proyectoItem, //pag Proyecto, proyectoEditar, comp formulario:edit,
        cargando, //pag Proyecto, proyectoEditar
        eliminarProyecto, //proyectoEditar
        modalFormularioTarea, // modalFormularioTarea proyectos
        handleModalTarea, // modalFormularioTarea proyectos
        recibirDatosTareas, // modalFormularioTarea proyectos
        handleModalEditarTarea, // comp tarea
        tarea, //comp modalFormularioTarea
        handleModalEliminarTarea, // comp modalEliminarTarea, tarea
        modalEliminarTarea, // modalEliminarTarea
        eliminarTarea, //comp modalEliminarTarea
        submitColaborador, //comp form colaborador
        colaborador,
        agregarColaborador, // comp NuevoColaborador
        handleModalEliminarColaborador,
        modalEliminarColaborador,
        eliminarColaborador, // comp Colaborador
        completarTarea, //comp tarea
        buscador,
        handleBuscador, //Header
        submitTareaProyectoSocket,
        eliminarTareaProyectoSocket,
        actualizarTareaProyectoSocket,
        actualizarTareaEstadoProyectoSocket,
        cerrarSesionProyectos
      }}
    >
      {children}
    </ProyectosContext.Provider>
  );
};

export { ProyectosProvider };
export default ProyectosContext;
