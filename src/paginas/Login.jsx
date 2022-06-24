import {useState, useEffect} from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Alerta from '../component/Alerta'
import clienteAxios from '../config/clienteAxios'
import useAuth from '../hooks/useAuth'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState('');

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  
 
  const handleSubmit = async(e) => {
    e.preventDefault();
    if([email, password].includes('')){
      setAlerta({
        msg: 'Los campos son obligatorios.',
        error: true
      });
    }
    try {
      const {data} = await clienteAxios.post('/usuarios/login', {email, password});
      sessionStorage.setItem('token-user', data.token);
      setAuth(data);
      navigate('/proyectos');
      window.location.reload();
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
        <h1 className="text-sky-600 font-blank text-6xl">Inicia sesion y administra tus <span className="text-slate-600">proyectos</span></h1>
        
        {msg && <Alerta alerta={alerta}/>}
       
        
        <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-10">
          <div className="my-5">
            <label htmlFor="email" 
              className="uppercase text-gray-600 block text-xl font-bold">Email:</label>
            <input id="email" type="email" placeholder="Email de Registro" 
              value={email} onChange={e=>setEmail(e.target.value)}
              className="w-full mt-3 p-3 border rounded-xl gb-gray-50" />
          </div>
          <div className="my-5">
            <label htmlFor="password" 
              className="uppercase text-gray-600 block text-xl font-bold">Contraseña:</label>
            <input id="password" type="password" placeholder="Password de Registro" 
              value={password} onChange={e=>setPassword(e.target.value)}
              className="w-full mt-3 p-3 border rounded-xl gb-gray-50" />
          </div>

          <input type="submit" 
          value="Iniciar Sesion" 
          className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" />
        </form>

        <nav className="lg:flex lg:justify-between">
          <Link 
            className="block text-center my-5 text-slate-500 uppercase text-sm" 
            to="/registrar">
          ¿No tienes cuenta? Registrate</Link>
          <Link 
            className="block text-center my-5 text-slate-500 uppercase text-sm" 
            to="/olvide-password">
          Olvide mi password</Link>
        </nav>
    </>
  )
}

export default Login