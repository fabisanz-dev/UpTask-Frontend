
/**
 * Formatear la fecha ej: 25 mayo 2022
 * @param {*} fecha 
 * @returns 
 */
export const formatearFecha = fecha => {

	const nuevaFecha = new Date(fecha.split('T')[0].split('-'));
	const opciones = {
		weekdays: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}

	return nuevaFecha.toLocaleDateString('es-ES', opciones);
}