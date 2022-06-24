import { useState } from "react";
import useProyectos from "../hooks/useProyectos";
import Alerta from "./Alerta";

const FormularioColaborador = () => {
  const [email, setEmail] = useState('');
  const { alertaFn, alerta, submitColaborador } = useProyectos();

  const handleSubmit = e => {
	e.preventDefault();
	if(email === '') {
		alertaFn({
			msg: 'email es requerido',
			error: true
		});
		return
	}
	submitColaborador(email);
  }
  const {msg} = alerta;
  return (
    <form onSubmit={handleSubmit} className="bg-white py-10 px-5 md:w-10/12 rounded-lg shadow w-full">
		{msg && <Alerta alerta={alerta}/>}
      <div className="mb-5">
        <label
          htmlFor="emailColaborador"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Email
        </label>
        <input
          type="email"
          id="emailColaborador"
          placeholder="Email del colaborador(a)"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>

	  <input
        type="submit"
        value='Buscar'
        className="bg-sky-600 hover:bg-sky-800 w-full p-3 text-white uppercase font-bold cursor-pointer 
		transition-colors rounded text-sm"
       />


    </form>
  );
};

export default FormularioColaborador;
