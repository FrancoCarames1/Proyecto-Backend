const Lista = require('./src/clase.js');

const express = require('express');
const app = express();
const PORT = 8080;

app.listen(PORT, () =>{
    console.log("servidor http://localhost:8080/")
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const router = express.Router();
app.use('/api', router);
app.get('/', (req, res) => {
    res.send("HOLA")
});

//Validar
async function validarUser(req, res, next){
    if(admin = true){
        next()
    }else{
        next("No tiene los permisos para esto")
    }
}

//Productos
let libros = new Lista('./libros.json');

//GET de productos
router.get("/productos", async (req, res) =>{
    let mostrar = await libros.getAll()
    res.send(mostrar)
});

//GET producto por Id
router.get("/:id", async (req, res) =>{

    const {id} = req.params;

    let mostrar = await libros.getById(parseInt(id))
    res.send(mostrar);
})

//PUT de productos
router.put("/productos/:id",validarUser, async (req, res) =>{

    const {id} = req.params;

    const {body} = req;

    const preCambio = await libros.getById(parseInt(id));

    const postCambio = await libros.updateById(parseInt(id), body);

    if (preCambio) {

        res.send({ postCambio });
    
    } else {
    
        res.send('El producto no fue encontrado, verificar si existe.')
    }
})

//POST de productos
router.post('/productos',validarUser, async (req, res) => {

    const { body } = req;

    let objeto = {...body, fecha: Date.now() }

    let mostrar = await libros.saveItem(objeto);

    res.send(mostrar)
});

//DELETE de productos por id
router.delete("/productos/:id",validarUser ,async(req, res) =>{

    const {id} = req.params;

    await libros.deleteById(parseInt(id))

    res.send('Borrado');

})

//Carrito
const ListaCarro = require('./src/clase.js');
let carrito = new ListaCarro('./carrito.json');

//POST carrito
router.post('/carrito', async (req, res) => {

    const { body } = req;

    let objeto = {...body, fecha: Date.now() }

    let mostrar = await carrito.saveItem(objeto);

    res.send(mostrar)
});

//DELETE carrito por id
router.delete("/carrito/:id", async(req, res) =>{

    const {id} = req.params;

    await carrito.deleteById(parseInt(id))

    res.send('Borrado');
})

router.get("/carrito/:id/productos", async(req, res) =>{

    const {id} = req.params;

    let mostrar = await carrito.getProductor(parseInt(id))

    res.send(mostrar)
})

router.post("/carrito/:id/productos", async(req, res) =>{

    const {id} = req.params;

    const { body } = req;

    let productosDelCarro = await carrito.saveProducto(id, body)

    res.send(productosDelCarro);
})

router.delete("/carrito/:id/productos/:idProducto", async(req, res) =>{

    const {id} = req.params;

    const {idProducto} = req.params;

    await carrito.deleteProducto(id,idProducto)

    res.send("Borrado");
})

//

app.get('/server', (req, res) => {
    res.send({server: 'Express'})
});