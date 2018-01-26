const express = require('express'); //add express library to my application
const bodyParser = require('body-parser'); //add body parser library to my application in order to parse the body of an HTTP request
const app = express(); //create an instance of the application
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration); //call the function, call it immediately and we're passing configuration as an arguement

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); //apply the middleware

app.locals.title = 'Palette Picker';


app.use(express.static(__dirname + '/public'));


app.listen(app.get('port'), () => { //setting up the application to listen
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
    console.log(request.params);
    const { projectID } = request.params;
    const palette = Object.assign({}, request.body.palette, {projects_id: projectID});
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

  app.get('/api/v1/projects/:projectID/palette', (request, response) => {
    const { projectID } = request.params;
    database('palette').where('projects_id', projectID).select()
      .then(palette => {
        if(palette.length) {
          return response.status(200).json({ palette })
      } else {
        return response.status(404).json({
          error: `Did not find palette for project with id ${projectID}`
        })
      }
    })
      .catch(error => {
        return response.status(500).json({ error })
      })
  })
  app.get('/api/v1/projects/palettes', (request, response) => {
    const { projectID } = request.params;
    database('palette').select()
      .then(palette => {
        if(palette.length) {
          return response.status(200).json({ palette })
      } else {
        return response.status(404).json({
          error: 'Did not find palette for project with id'
        })
      }
    })
      .catch(error => {
        return response.status(500).json({ error })
      })
  })
