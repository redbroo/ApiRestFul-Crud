var express = require('express');
var mysql = require('mysql');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());

//Parametros de conexion con mysql
var conexion = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'instrumentos'
});

//Probamos la conexion
conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log("Conexion exitosa");
    }
});


app.get('/', function(req, res){
    res.send('Ruta INICIO');
});


//Mostrar todos los articulos
app.get('/api/guitarras', (req,res)=>{
    conexion.query('SELECT * FROM guitarras', (error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});

//Monstrar un solo articulo
app.get('/api/guitarras/:id', (req,res)=>{
    conexion.query('SELECT * FROM guitarras WHERE id = ?',[req.params.id], (error,fila)=>{
        if(error){
            throw error;
        }else{
           res.send(fila);
           //res.send(fila[0].descripcion);
        }
    })
});

//Crear un articulo
app.post('/api/guitarras',(req,res)=>{
    let data = {descripcion:req.body.descripcion, precio:req.body.precio, stock:req.body.stock};
    let sql = "INSERT INTO guitarras SET ?";
    conexion.query(sql, data, function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});


//Editar un articulo
app.put('/api/guitarras/:id', (req, res)=>{
    let id = req.params.id;
    let descripcion = req.body.descripcion;
    let precio = req.body.precio;
    let stock = req.body.stock;
    let sql = "UPDATE guitarras SET descripcion =?, precio = ?, stock = ? WHERE id = ? ";
    conexion.query(sql, [descripcion, precio, stock, id], function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

//Eiminar Articulo
app.delete('/api/guitarras/:id', (req,res)=>{
    conexion.query('DELETE FROM guitarras WHERE id = ?', [req.params.id], function(error, filas){
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    });
});



const puerto = process.env.PUERTO || 7000;

app.listen(puerto, function(){
    console.log("Servidor Ok:"+puerto);
});
