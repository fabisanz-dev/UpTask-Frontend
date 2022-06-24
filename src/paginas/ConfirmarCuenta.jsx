import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import Alerta from "../component/Alerta";

const ConfirmarCuenta = () => {
  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

  //get token
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const comprobarCuenta = async() => {
      try {
        const {data} = await clienteAxios.get(`/usuarios/confirmar/${id}`);
        setAlerta({
          msg: data.msg,
          error: false,
        });
        setCuentaConfirmada(true);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
        setCuentaConfirmada(false);
      }
    };
    comprobarCuenta();
  }, []);

  const { msg } = alerta;
  return (
    <>
      <h1 className="text-sky-600 font-blank text-6xl">
        Confirma tu cuenta y Comienza a crear tus{" "}
        <span className="text-slate-600">proyectos</span>
      </h1>

      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
        {msg && <Alerta alerta={alerta} />}

        {cuentaConfirmada && (
          <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            to="/"
          >
          Inicia Sesión
          </Link>
        )}
      </div>
    </>
  );
};

export default ConfirmarCuenta;
