import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ImgProfilePlaceholder from "../../../Backend/helpers/ImgProfilePlaceholder";
import useAuth from "../hooks/useAuth";
import useProyectos from "../hooks/useProyectos";
import Loading from "./Loading";

const Sidebar = () => {
  const { auth, uploadImg, imgUploaded, cargandoImg, mensajeImg } = useAuth(); 
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [imgTemp, setImgTemp] = useState("");
  const [msgTemp, setMsgTemp] = useState("");

  const { handleBuscador, cerrarSesionProyectos } = useProyectos()
  const { cerrarSesionAuth } = useAuth()
 
  const handleMenuProfile = () => {
    show ? setShow(false) : setShow(true);
  };

  //subir imagen
  useEffect(() => {
    if (!selectedFile) {
      setImgTemp(undefined);
      return;
    }
    const objectURL = URL.createObjectURL(selectedFile);
    setImgTemp(objectURL);

    uploadImg(auth.usuario._id, selectedFile);

    //revoke despues de desmontar
    return () => URL.revokeObjectURL(objectURL);
  }, [selectedFile]);
  const onFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  //img temp o subida
  const imgConfirm = `${imgUploaded ? imgUploaded : imgTemp}`;

  //cerrar sesion
  const handleCerrarSesion = () => {
    cerrarSesionProyectos()
    cerrarSesionAuth()
   }

   
  return (
    <aside className="md:w-1/3 lg:w-1/5 xl:w-1/6 px-5 py-2 border-r">
      <p className="text-xl font-bold">Hola: {auth.usuario.nombre}</p>
      <Link
        to="nuevo-proyecto"
        className="bg-sky-600 w-full p-3 text-white uppercase font-bold block mt-5 text-center rounded-lg"
      >
        Crear Proyecto
      </Link>
      <div className="flex justify-center mt-10" onClick={handleMenuProfile}>
        <div className="relative w-32 h-32 border overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 cursor-pointer">
        {
          cargandoImg ? (<span className="w-32 h-32 flex justify-center items-center"><Loading /></span> )
          : (selectedFile || imgUploaded ) ? (
            <img
              className="absolute w-32 h-32 text-gray-400"
              src={imgConfirm}
              alt='image-profile'
            />
          ) : (
            <ImgProfilePlaceholder />
          )
        }
        </div>
      </div>

      <div className="flex justify-center mt-1">
        <div
          className={`bg-white divide-y divide-gray-100 rounded shadow w-44
		dark:bg-gray-700 dark:divide-gray-600
		${show ? "block" : "hidden"} flex items-center flex-col
		`}
        >
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div>{auth.usuario.nombre}</div>
            <div className="font-medium truncate">{auth.usuario.email}</div>
          </div>
          <ul
            className="py-1 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownInformationButton"
          >
            <li>
            { !cargandoImg ?
              (
                <label
                htmlFor="dropzone-file"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                >
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={onFileChange}
                    placeholder="cambiar imagen"
                  />
                  Cambiar imagen
                </label>
              ) :
               (
                <label
                className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {mensajeImg ? 'Imagen Actualizada!✔️' : 'Actualizando imagen ...'}
                </label>
              ) }

            </li>
          </ul>
          <div className="py-1">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-slate-100 bg-red-600 rounded-lg hover:bg-red-500"
              onClick={handleCerrarSesion}
            >
              Cerrar sesion
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
