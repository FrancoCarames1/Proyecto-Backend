const fs = require("fs");
class Lista {
    constructor(nombreDeArchivo) {
        this.nombreDeArchivo = nombreDeArchivo;
        this.data = []
    }
    async getAll() {
        try {
            let info = await fs.promises.readFile(this.nombreDeArchivo, "UTF-8");
            if (info){
                this.data =  JSON.parse(info);
                return (this.data)
            }
        } catch (error) {
            return
        }
    }
    async getById(numero) {
        let array = await this.getAll();
        let itemBuscado = array.find((x) => x.id === numero);
        if (itemBuscado === undefined) {
            console.log("Error, no hay ningún item con ese id");
        } else {
            return itemBuscado;
        }
    }
    async deleteById(numero) {
        let array = await this.getAll();
        let posicionItemBuscado = array.findIndex((x) => x.id === numero);
        if (posicionItemBuscado === -1) {
            console.log("Error, no existe un item con ese id");
        } else {
            array.splice(posicionItemBuscado, 1);
            let pasarloAJSON = JSON.stringify(array);
            await this.saveLista(pasarloAJSON);
        }
    }
    async deleteAll() {
        try {
            await fs.promises.writeFile(this.nombreDeArchivo, "[]");
            console.log("Borrado");
        } catch (error) {
            console.log("Error");
        }
    }
    async saveItem(objeto) {
        let array = await this.getAll();
        if (array) {
            let idMax = 0;
            array.forEach((e) => {
                if (e.id > idMax) {
                    idMax = e.id;
                }
            });
            objeto.id = idMax + 1;
            array.push(objeto);
            let pasarloAJSON = JSON.stringify(array,null, 2);
            await this.saveLista(pasarloAJSON);
        }
    }
    async updateById(id, itemNuevo) {
        let array = await this.getAll();

        let posicionItem = array.findIndex((item) => item.id === id);

        if (posicionItem === -1){
            return ("No se encontró item")
        }else{

            array[posicionItem].title = itemNuevo.title;
            array[posicionItem].mainCharacter = itemNuevo.mainCharacter;

            let pasarloAJSON = JSON.stringify(array);

            await this.saveLista(pasarloAJSON)

            return (array[posicionItem])
        }
    }
    async saveLista(items){
        try {
            await fs.promises.writeFile(this.nombreDeArchivo, items);
        }
        catch (error) {
            console.log(error)
        }
    }
}
module.exports = Lista