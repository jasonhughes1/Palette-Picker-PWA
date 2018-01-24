const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.locals.title = 'Palette Picker';


app.use(express.static(__dirname + '/public'));


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

app.get('/', (request, response) => {
  return response.send('palettepicker')
})


app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      return response.status(200).json({ projects });
    })
    .catch(error => {
      return repsonse.status(500).json({ error })
    })
});


app.post('/api/v1/palettes', (request, response) => {
  const id = Date.now();
  const { palette } = request.body;

  app.locals.palettes.push(message);

  response.status(201).json({id: message});
})
