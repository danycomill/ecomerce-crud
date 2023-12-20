const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const multer = require('multer');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); // Servir archivos estáticos desde la carpeta 'uploads'
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Configurar Multer para gestionar la carga de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Directorio donde se almacenarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre de archivo único
    }
});
const upload = multer({ storage: storage });

// Datos de ejemplo (pueden ser almacenados en una base de datos)
let products = [
    // ... (productos de ejemplo)
];





//Metodos:


///////////////////////////////////////////////////////////////////////
//////Renderizar la página principal con la lista de productos/////////
///////////////////////////////////////////////////////////////////////

// Esta ruta maneja las solicitudes GET a la ruta raíz ('/'). Al recibir esta solicitud, renderiza la vista 'index' y pasa el arreglo de productos como datos a esa vista.
app.get('/', (req, res) => {
    res.render('index', { products });
});




///////////////////////////////////////////////////////////////////////
//// Renderizar la página para agregar un nuevo producto con imagen////
///////////////////////////////////////////////////////////////////////

// Aquí, al acceder a '/products/new' con una solicitud GET, se renderiza la vista 'new', la cual probablemente sea un formulario para agregar un nuevo producto.
app.get('/products/new', (req, res) => {
    res.render('new');
});





///////////////////////////////////////////////////////////////////////
///////////////////Crear un nuevo producto con imagen//////////////////
///////////////////////////////////////////////////////////////////////

// Esta ruta maneja las solicitudes POST a '/products'. Aquí se espera que se envíen datos de un nuevo producto, incluida una imagen ('productImage'). Se obtienen los detalles del producto del cuerpo de la solicitud, se guarda la imagen en el servidor, se crea un nuevo objeto de producto con esos detalles y se agrega al arreglo products. Finalmente, redirecciona a la página principal.
app.post('/products', upload.single('productImage'), (req, res) => {
    const { title, description, price } = req.body;
    const image = req.file; // El archivo subido
    const id = products.length + 1;
    const newProduct = { id, title, description, price: parseFloat(price), image: image.filename };
    products.push(newProduct);
    res.redirect('/');
});



///////////////////////////////////////////////////////////////////////
//////////////Renderizar la página para editar un producto/////////////
///////////////////////////////////////////////////////////////////////

// Al acceder a '/products/:id/edit' con una solicitud GET, se busca un producto específico por su ID para editar. Si se encuentra el producto, se renderiza la vista 'edit' con los detalles de ese producto. En caso contrario, se redirige a la página principal.
app.get('/products/:id/edit', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(product => product.id === productId);
    if (!product) {
        res.redirect('/');
    } else {
        res.render('edit', { product });
    }
});






///////////////////////////////////////////////////////////////////////
/////////////////////////Actualizar un producto////////////////////////
///////////////////////////////////////////////////////////////////////

// Esta ruta maneja solicitudes PUT a '/products/:id' para actualizar un producto. Se espera que se envíen datos actualizados del producto, como el título, descripción y precio. Busca el producto por su ID, actualiza los detalles y redirige a la página principal.
app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { title, description, price } = req.body;
    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex !== -1) {
        products[productIndex] = { id: productId, title, description, price: parseFloat(price), image: products[productIndex].image };
    }
    res.redirect('/');
});






///////////////////////////////////////////////////////////////////////
/////Renderizar la página para ver un producto específico//////////////
///////////////////////////////////////////////////////////////////////


// Al acceder a '/products/:id' con una solicitud GET, se busca un producto específico por su ID para mostrar sus detalles. Si se encuentra el producto, se renderiza la vista 'productDetail' con los detalles de ese producto. En caso contrario, se redirige a la página principal.
app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(product => product.id === productId);
    if (!product) {
        res.redirect('/');
    } else {
        res.render('productDetail', { product });
    }
})


///////////////////////////////////////////////////////////////////////
/////////////////////////Eliminar un producto//////////////////////////
///////////////////////////////////////////////////////////////////////

// Esta ruta maneja solicitudes DELETE a '/products/:id'. Elimina un producto específico del arreglo products basándose en su ID y luego redirige a la página principal.
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    products = products.filter(product => product.id !== productId);
    res.redirect('/');
});



// Servidor
app.listen(3000, () => {
    console.log('Servidor funcionando en el puerto 3000');
});
