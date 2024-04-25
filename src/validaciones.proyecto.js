
export const validarCamposObligatorios = (nombre, stockMaximo, stockMinimo, categoriaId) => {
    if (!nombre || !stockMaximo || !stockMinimo || !categoriaId) {
        return false; // Al menos uno de los campos obligatorios está vacío
    }
    return true; // Todos los campos obligatorios tienen un valor
};

export const validarFormatoNumerico = (precioCompra, precioVenta, saldoExistencias, stockMaximo, stockMinimo) => {
    // Implementa aquí la lógica para validar el formato numérico de los campos
    // Puedes usar expresiones regulares u otras técnicas según tus necesidades
};
