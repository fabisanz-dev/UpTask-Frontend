import useAuth from "./useAuth";
import useProyectos from "./useProyectos";

const useAdmin = () => {
	const { proyectoItem } = useProyectos();
	const { auth } = useAuth();

	return proyectoItem.creador === auth.usuario._id;
}

export default useAdmin