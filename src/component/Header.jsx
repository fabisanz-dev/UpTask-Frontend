import { Link } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import Busqueda from "./Busqueda"


const Header = () => {
 const { handleBuscador } = useProyectos()
 
  return (
	<header className="px-4 py-5 bg-white border-b">
		<div className="md:flex md:justify-between">
			<div>
				<h2 className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0">
					Uptask</h2>
			</div>
			
			<div className="flex flex-col md:flex-row items-center gap-4">
			<button type="button" className="font-bold uppercase" onClick={handleBuscador}>Buscar Proyecto</button>


				<Link to=""
				className="font-bold uppercase"
				>
					Proyectos
				</Link>

				<Busqueda />
			</div>
		</div>
	</header>
  )
}

export default Header