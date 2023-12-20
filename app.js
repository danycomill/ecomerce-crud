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

// Renderizar la página principal con la lista de productos
app.get('/', (req, res) => {
    res.render('index', { products });
});



// Renderizar la página para agregar un nuevo producto con imagen
app.get('/products/new', (req, res) => {
    res.render('new');
});


// Crear un nuevo producto con imagen
app.post('/products', upload.single('productImage'), (req, res) => {
    const { title, description, price } = req.body;
    const image = req.file; // El archivo subido
    const id = products.length + 1;
    const newProduct = { id, title, description, price: parseFloat(price), image: image.filename };
    products.push(newProduct);
    res.redirect('/');
});


// Renderizar la página para editar un producto
app.get('/products/:id/edit', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(product => product.id === productId);
    if (!product) {
        res.redirect('/');
    } else {
        res.render('edit', { product });
    }
});


// Actualizar un producto
app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { title, description, price } = req.body;
    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex !== -1) {
        products[productIndex] = { id: productId, title, description, price: parseFloat(price), image: products[productIndex].image };
    }
    res.redirect('/');
});


// Renderizar la página para ver un producto específico
app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(product => product.id === productId);
    if (!product) {
        res.redirect('/');
    } else {
        res.render('productDetail', { product });
    }
})



// Eliminar un producto
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    products = products.filter(product => product.id !== productId);
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
