import FormularioProyecto from "../component/FormularioProyecto";
import useProyectos from "../hooks/useProyectos";

const NuevoProyecto = () => {
  return (
    <>
      <h1 className="text-4xl font-black">
        <div className="mt-10 flex justify-center">
          <FormularioProyecto />
        </div>
      </h1>
    </>
  );
};

export default NuevoProyecto;
