import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useProyectos from "../hooks/useProyectos";
import Alerta from "./Alerta";


const FormularioProyecto = () => {
  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [cliente, setCliente] = useState("");
  const { alertaFn, alerta, recibirDatosProyectos, proyectoItem } = useProyectos();
  const params = useParams();

  useEffect(() => {
    if(params.id){
      setId(params.id);
      setNombre(proyectoItem.nombre);
      setDescripcion(proyectoItem.descripcion);
      setFechaEntrega(proyectoItem.fechaEntrega?.split('T')[0]);
      setCliente(proyectoItem.cliente);
    }else{
      console.log('creando...')
    }
  }, [params]);

  const handleSubmit = async(e) => {
	e.preventDefault();
    console.log([id, nombre, descripcion, fechaEntrega, cliente])
 
	if([nombre, descripcion, fechaEntrega, cliente].includes('')){
		alertaFn({
			msg: 'Estos campos son obligatorios',
			error: true
		});
	}
	//Enviar los datos del formulario proyecto para su creacion o actualizacion
	await recibirDatosProyectos({id, nombre, descripcion, fechaEntrega, cliente});
	setNombre('');
	setDescripcion('');
	setFechaEntrega('');
	setCliente('');
  }
  const {msg} = alerta;

  return (
    <form className="bg-white py-10 px-5 rounded-lg shadow md:mb-0"
		onSubmit={handleSubmit}
	>
	  {msg && <Alerta alerta={alerta}/>}
      <label
        htmlFor="nombre"
        className="text-gray-700 uppercase text-bold text-sm"
      >
        nombre del proyecto
      </label>
      <input
        type="text"
        id="nombre"
        className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
        placeholder="Nombre del producto"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <label
        htmlFor="descripcion"
        className="text-gray-700 uppercase text-bold text-sm"
      >
        Descripcion del proyecto
      </label>
      <textarea
        type="text"
        id="descripcion"
        className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
        placeholder="Descripcion del producto"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <label
        htmlFor="fecha-entrega"
        className="text-gray-700 uppercase text-bold text-sm"
      >
        nombre del proyecto
      </label>
      <input
        type="date"
        id="fecha-entrega"
        className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
        value={fechaEntrega}
        onChange={(e) => setFechaEntrega(e.target.value)}
      />

      <label
        htmlFor="cliente"
        className="text-gray-700 uppercase text-bold text-sm"
      >
        nombre del cliente
      </label>
      <input
        type="text"
        id="cliente"
        className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
        placeholder="Cliente del producto"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />

      <input type="submit" value={id ? 'Actualizar proyecto' : 'Guardar proyecto'}
	className="bg-sky-600 w-full  mt-5 p-3 uppercase font-bold text-white rounded cursor-pointer
	hover:bg-sky-700 transition-colors
	"
	
	  />
    </form>
  );
};

export default FormularioProyecto;
