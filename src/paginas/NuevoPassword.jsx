import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import Alerta from "../component/Alerta";


const NuevoPassword = () => {
  const params = useParams();
  const { token } = params;
  const [alerta, setAlerta] = useState({});
  const [tokenValido, setTokenValido] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordUpdate, setPasswordUpdate] = useState(false);

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        const {data} = await clienteAxios.get(`/usuarios/olvide-password/${token}`);
        console.log(data);
        setTokenValido(true);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        });
      }
    };
    comprobarToken();
  }, []);

  const { msg } = alerta;

  //enviar nueva contraseña
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(password.length < 6){
      setAlerta({
        msg: 'La contraseña debe tener minimo: 6 carácteres',
        error: true
      });
      return
    }
    try {
      const { data } = await clienteAxios.post(`/usuarios/olvide-password/${token}`, {password});
      setAlerta({
        msg: data.msg,
        error: false
      });
      setPasswordUpdate(true);
      setTokenValido(false);
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  return (
    <>
      <h1 className="text-sky-600 font-blank text-6xl">
        Recupera tu contraseña y Comienza a crear tus {""}
        <span className="text-slate-600">proyectos</span>
      </h1>
      {msg && <Alerta alerta={alerta}/>}
      {tokenValido && (
        <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-10">
          <div className="my-5">
            <label
              htmlFor="password"
              className="uppercase text-gray-600 block text-xl font-bold"
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              placeholder="Contraseña de Registro"
              className="w-full mt-3 p-3 border rounded-xl gb-gray-50"
              value={password}
              onChange={e=>{setPassword(e.target.value)}}
            />
          </div>

          <input
            type="submit"
            value="Confirmar nueva Contraseña"
            className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
        </form>
      )}
      {passwordUpdate && (
        <Link 
        className="block text-center my-5 text-slate-500 uppercase text-sm" 
        to="/">
        Iniciar Sesión</Link>
      )}
    </>
  );
};

export default NuevoPassword;
