import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
	const [auth, setAuth] = useState({});
	const [cargando, setCargando] = useState(true);

	const navigate = useNavigate();

	useEffect(() =>{
		const autenticarUsuario = async() => {
			const token = sessionStorage.getItem('token-user');
			if(!token){
				setCargando(false);
				return
			}

			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token
				}
			}
			
			try {
				const { data } = await clienteAxios.get('usuarios/perfil', config);	
				setCargando(true);
				setAuth(data);
				//redirigir a proyectos
				
				//navigate('/proyectos');
			} catch (error) {
				setAuth({});
			}
			setCargando(false);
		}
		autenticarUsuario();
		
	}, []);

	const cerrarSesionAuth = () => {
		setAuth({})
	}

	return (
		<AuthContext.Provider
			value={{	
				auth,
				setAuth, 
				cargando,
				cerrarSesionAuth
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export {
	AuthProvider
}
export default AuthContext;