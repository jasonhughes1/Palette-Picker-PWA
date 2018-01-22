const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.locals.title = 'Palette Picker';

app.locals.palettes = [
  {id: 'a1', palette: ['color1', 'color2', 'color3', 'color4', 'color5'] },
  {id: 'b1', palette: ['color1', 'color2', 'color3', 'color4', 'color5'] }
]

app.use(express.static(__dirname + '/public'));


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});


app.get('/api/v1/palettes', (request, response) => {
  const palettes = app.locals.palettes;

  response.status(200).json({ palettes })
});

app.post('/api/v1/palettes', (request, response) => {
  const id = Date.now();
  const { palette } = request.body;

  app.locals.palettes.push(message);

  response.status(201).json({id: message});
})
