export const formatDate=(date) =>{
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const actualizarCamposConsultas = (asignarEstados, estados, nombreCampos) => {
    if (asignarEstados.length !== nombreCampos.length) return;

    for (let i = 0; i < asignarEstados.length; i++) {
        if (parseInt(estados[nombreCampos[i]]))
            asignarEstados[i](`$ ${estados[nombreCampos[i]]}`);
        else
            asignarEstados[i](`${estados[nombreCampos[i]]}`);
    }
}

export const fecha2 = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };