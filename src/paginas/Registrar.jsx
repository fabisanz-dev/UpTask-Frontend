import { Link } from 'react-router-dom'
import { useState } from 'react'
import Alerta from '../component/Alerta'
import clienteAxios from '../config/clienteAxios'

const Registrar = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');

  const [alerta, setAlerta] = useState({});

  const handleSubmit = async(e) => {
    e.preventDefault();
    if([nombre, email, password, repetirPassword].includes('')){
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      });
      return
    }
    //validar pws
    if(password !== repetirPassword){
      setAlerta({
        msg: 'Las contraseñas no coinciden',
        error: true
      });
      return
    }
    if(password.length < 6){
      setAlerta({
        msg: 'La contraseña debe tener minimo: 6 carácteres',
        error: true
      });
      return
    }
    setAlerta({});
    //enviar datos a la api
    console.log('procesando', import.meta.env.VITE_API_URL)
    try {
      const {data} = await clienteAxios.post('/usuarios', {
        nombre, email, password
      });
      setAlerta({
        msg: data.msg,
        error: false
      })
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      });
    }
  }



  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-blank text-6xl">Crea tu cuenta y administra tus <span className="text-slate-600">proyectos</span></h1>
      
      {msg && <Alerta alerta={alerta}/>}

      <form action="" className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label htmlFor="nombre" 
            className="uppercase text-gray-600 block text-xl font-bold">Nombre:</label>
          <input id="nombre" type="text" placeholder="Nombre de Usuario" 
            className="w-full mt-3 p-3 border rounded-xl gb-gray-50" 
            value={nombre}
            onChange={e=>setNombre(e.target.value)}
            />
        </div>
        <div className="my-5">
          <label htmlFor="email" 
            className="uppercase text-gray-600 block text-xl font-bold">Email:</label>
          <input id="email" type="email" placeholder="Email de Registro" 
            className="w-full mt-3 p-3 border rounded-xl gb-gray-50"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            />
        </div>
        <div className="my-5">
          <label htmlFor="password" 
            className="uppercase text-gray-600 block text-xl font-bold">Password:</label>
          <input id="password" type="password" placeholder="Contraseña de Registro" 
            className="w-full mt-3 p-3 border rounded-xl gb-gray-50" 
            value={password}
            onChange={e=>setPassword(e.target.value)}
            />
        </div>
        <div className="my-5">
          <label htmlFor="repetir-password" 
            className="uppercase text-gray-600 block text-xl font-bold">Repetir password:</label>
          <input id="repetir-password" type="password" placeholder="Repetir Contraseña" 
            className="w-full mt-3 p-3 border rounded-xl gb-gray-50" 
            value={repetirPassword}
            onChange={e=>setRepetirPassword(e.target.value)}
            />
        </div>

        <input type="submit" 
        value="Iniciar Sesion" 
        className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link 
          className="block text-center my-5 text-slate-500 uppercase text-sm" 
          to="/">
        ¿Ya tienes cuenta? Inicia Sesión</Link>
        <Link 
          className="block text-center my-5 text-slate-500 uppercase text-sm" 
          to="/olvide-password">
        Olvide mi password</Link>
      </nav>
  </>
  )
}

export default Registrar