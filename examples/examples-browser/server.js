const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const connection = require('./db'); // Importa la conexión a la base de datos

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const viewsDir = path.join(__dirname, 'views');
app.use(express.static(viewsDir));
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, '../../weights')));
app.use(express.static(path.join(__dirname, '../../dist')));

// NUEVO ENDPOINT: Obtener la foto de la base de datos usando la identificación
app.get('/foto/:identificacion', (req, res) => {
  const { identificacion } = req.params;

  const query = `
    SELECT FP.foto, FP.foto_thumb
    FROM persona P
    LEFT JOIN foto_persona FP ON P.id_persona = FP.id_persona AND FP.estado = 1
    WHERE P.identificacion = ? 
      AND P.eliminado = 0
  `;

  connection.query(query, [identificacion], (error, results) => {
    if (error) {
      console.error('Error al realizar la consulta:', error);  // Asegúrate de registrar el error
      res.status(500).send('Error en el servidor');
      return;
    }

    if (results.length > 0) {
      const fotoPath = results[0].foto;
      const fotoUrl = `https://sgsst.co/${fotoPath}`;
      res.json({ fotoUrl });
    } else {
      res.status(404).send('Persona no encontrada');
    }
  });
});

// Proxy para las imágenes externas
app.get('/proxy-image', async (req, res) => {
  const imageUrl = req.query.url;

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const contentType = response.headers.get('content-type');
    res.set('Content-Type', contentType);
    const buffer = await response.buffer();
    res.send(buffer);
  } catch (error) {
    console.error('Error al obtener la imagen:', error);
    res.status(500).send('Error al obtener la imagen');
  }
});

app.get('/', (req, res) => res.redirect('/face_detection'));
app.get('/face_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'faceRecognition.html')));

app.listen(4000, () => console.log('Listening on port 4000!'));


/*function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
        {},
        {
          url,
          isBuffer: true,
          timeout,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
          }
        },
        returnBuffer ? { encoding: null } : {}
    );

    get(options, function(err, res) {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}*/
