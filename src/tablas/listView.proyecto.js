export class ListView {
    constructor() {
        this.list = [];
    }

    setObjeto(objeto) {
        this.list.push(objeto);
    }

    getAObjetos() {
        return this.list;
    }

    searchObjeto(codigo) {
        let inicio = 0;
        let fin = this.list.length - 1;

        while (inicio <= fin) {
            const mitad = Math.floor((inicio + fin) / 2);
            const objeto = this.list[mitad];

            if (objeto.codigo === codigo) return this.list.indexOf(objeto);

            if (objeto.codigo < codigo) {
                inicio = mitad + 1;
            } else {
                fin = mitad - 1;
            }
        }

        return -1;
    }

    deleteObjeto(codigoObjeto) {
        const objeto = this.searchObjeto(codigoObjeto)
        if (objeto === -1) return null;

        this.list.splice(objeto)

        return this.list;
    }
}
