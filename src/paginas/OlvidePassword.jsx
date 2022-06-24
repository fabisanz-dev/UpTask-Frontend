import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../component/Alerta'
import clienteAxios from '../config/clienteAxios'

const OlvidePassword = () => {
  const [email, setEmail] = useState('');
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(email === '' && email < 6){
      setAlerta({
        msg: 'El correo es olbigatorio',
        error: true
      });
      return
    }

    try {
      const {data} = await clienteAxios.post(`/usuarios/olvide-password`, {email});
      setAlerta({
        msg: data.msg,
        error: false
      })
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  

  const {msg} = alerta;

  return (
      <>
        <h1 className="text-sky-600 font-blank text-6xl">Recupera tu cuenta y administra tus <span className="text-slate-600">proyectos</span></h1>
        {msg && <Alerta alerta={alerta}/>}
        <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-10">
          <div className="my-5">
            <label htmlFor="email" 
              className="uppercase text-gray-600 block text-xl font-bold">Email:</label>
            <input id="email" type="email" placeholder="Email de Registro" 
              className="w-full mt-3 p-3 border rounded-xl gb-gray-50" 
              value={email}
              onChange={e=>setEmail(e.target.value)}
              />
          </div>
         
          <input type="submit" 
          value="Recuperar Contraseña" 
          className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" />
        </form>

        <nav className="lg:flex lg:justify-between">
          <Link 
            className="block text-center my-5 text-slate-500 uppercase text-sm" 
            to="/">
          ¿Ya tienes cuenta? Inicia Sesión</Link>
          <Link 
            className="block text-center my-5 text-slate-500 uppercase text-sm" 
            to="/registrar">
          ¿No tienes cuenta? Registrate</Link>
        </nav>
    </>
  )
}

export default OlvidePassword