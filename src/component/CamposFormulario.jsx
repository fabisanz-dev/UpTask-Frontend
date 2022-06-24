
const CamposFormulario = ({campo}) => {
  const {value, setValue, id, type} = campo;
  return (
	<label
        htmlFor={id}
        className="text-gray-700 uppercase text-bold text-sm"
      >
        nombre del proyecto
      </label>

      <input
        type={type}
        id={id}
        className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
        placeholder="Nombre del producto"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
  )
}

export default CamposFormulario