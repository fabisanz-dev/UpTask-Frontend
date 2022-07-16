import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
	const [auth, setAuth] = useState({});
	const [cargando, setCargando] = useState(true);
	const [imgUploaded, setImgUploaded] = useState("");
	const [cargandoImg, setCargandoImg] = useState(false);


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
				setImgUploaded(data.usuario.imagen);
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

	/**
	 * 
	 * @param {*} userId 
	 * @returns 
	 */
	const uploadImg = async(userId, file) => {
		const formData = new FormData();
        formData.append('file', file);

		const token = sessionStorage.getItem('token-user');
		if(!token){
			setCargandoImg(false);
			return
		}

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token
			}
		}

		try {
			const { data } = await clienteAxios.put(`usuarios/perfil`, formData, config);
			setCargandoImg(true);
			setImgUploaded(data.imagen);
		} catch (error) {
			console.log('img-profile', error)
		}
		setTimeout(() => {
			setCargandoImg(false);
		}, 2000);
		

	}

	return (
		<AuthContext.Provider
			value={{	
				auth,
				setAuth, 
				cargando,
				cerrarSesionAuth,
				uploadImg,
				imgUploaded,
				cargandoImg
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