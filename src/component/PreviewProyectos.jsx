import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PreviewProyectos = ({ proyecto }) => {
  const { _id, nombre, cliente, creador } = proyecto;
  const { auth } = useAuth();
  return (
    <div className="border-b p-5 flex justify-between flex-col md:flex-row">
      <div className="flex items-center gap-2">
        <p className="flex-1">
          {nombre}
          <span className="text-sm text-gray-500 uppercase"> {cliente}</span>
        </p>

        {auth.usuario._id !== creador && <p className="p-1 text-xs rounded-lg text-white bg-green-700 font-bold uppercase">
        Colaborador</p>}
      </div>

      <Link
        to={`${_id}`}
        className="text-sm font-bold text-gray-600 hover:text-gray-800"
      >
        Ver Proyecto
      </Link>
    </div>
  );
};

export default PreviewProyectos;
