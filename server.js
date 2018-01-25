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

app.post('/api/v1/projects', (request, response) => {
  const projects = request.body;

  for(let requiredParameter of ['projectName']) {
    if(!projects[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the required parameter ${requiredParameter}`
        })
      }
    }

  database('projects').insert(projects, 'id')
    .then(projects => {
      return response.status(201).json({ id: projects[0] })
    })
    .catch(error => {
      return response.status(500).json({ error })
    })
  })

  app.post('/api/v1/projects/:projectID/palette', (request, response) => {
    const { projectID } = request.params;
    const palette = Object.assign({}, request.body, {projects_id: projectID});
    console.log(palette);
    for (let requiredParameter of ['projectName', 'paletteName', 'color1', 'color2', 'color3', 'color4', 'color5']) {
      if(!palette[requiredParameter]) {
        return response.status(422).json({
          error: `You are missing the required parameter ${requiredParameter}`
        })
      }
    }

    database('palette').insert(palette, 'id')
      .then(palette => {
        return response.status(201).json({ id: palette[0] })
      })
      .catch(error => {
        return response.status(500).json({ error })
      })
    })
  // const saveProject = () => {
  //
  // }
