const express = require('express'); //add express library to my application
const bodyParser = require('body-parser'); //add body parser library to my application in order to parse the body of an HTTP request
const app = express(); //create an instance of the application
const environment = process.env.NODE_ENV || 'development'; //tells the computer how to compile the application via node or development
const configuration = require('./knexfile')[environment]; //the computer can read the knexfile by looking into the environment which is parsed using node
const database = require('knex')(configuration); //call the function, call it immediately and we're passing configuration as an argument
app.set('port', process.env.PORT || 3000); //whatever is in the environment variable PORT, or 3000 if there's nothing there.
app.use(bodyParser.json()); //declares that I want to use json in my body
app.use(bodyParser.urlencoded({extended: true})); //apply the middleware

app.locals.title = 'Palette Picker'; //the local title of the application will be palettepicker

app.use(express.static(__dirname + '/public')); //serves up all static files; such as html css and js

app.listen(app.get('port'), () => { //setting up the application to listen to the port
});

app.get('/', (request, response) => { //send palettepicker to the root of my application
  return response.send('palettepicker')
})

app.get('/api/v1/projects', (request, response) => { //get all data posted in the sql database under the url api/v1/projects
  database('projects').select() //from the database select all projects
    .then(projects => {
      return response.status(200).json({ projects }); //if there are projects to recieve from the database return status code 200
    })
    .catch(error => {
      return repsonse.status(500).json({ error }) //if something went wrong from the server side get request, inform user with status code 500
    })
});

app.post('/api/v1/projects', (request, response) => { //post projects to the database under url api/v1/projects
  const projects = request.body; //set request.body to a variable which stores projects
//as an object
  for(let requiredParameter of ['projectName']) { //make sure that every project posted to the database requires a name
    if(!projects[requiredParameter]) { //if that checks to see if all required parameters have been satisfied
      return response.status(422).json({ //if all required parameters have not been satisfied, return a status of 422 to throw an error informing you which required parameter is missing.
        error: `You are missing the required parameter ${requiredParameter}`
        })
      }
    }

  database('projects').insert(projects, 'id') //insert a project id for each project being put into the projects database
    .then(projects => {
      return response.status(201).json({ id: projects[0] }) //status code 201 is thrown upon successful implementation of id to projects
    })
    .catch(error => {
      return response.status(500).json({ error }) //status code 500 is thown upon unsuccessful implementation of id to projects
    })
  })

  app.post('/api/v1/projects/:projectID/palette', (request, response) => {

    const { projectID } = request.params;
    console.log(request.params);
    const palette = Object.assign({}, request.body.palette, {projects_id: projectID});
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

  app.delete('/api/v1/projects/palettes/:id', (request, response) => {
    const id = request.params;
    database('palette').where(id).del()
      .then(pal => {
        if(!pal) {
          response.status(422).json({error: 'No pallete exists'});
        } else {
          response.sendStatus(204);
        }
      })
      .catch(error => response.status(500).json({ error }))
  });

  app.delete('/api/v1/projects/:id', (request, response) => {
    const id = request.params;
    database('projects').where(id).del()
      .then(projects => {
        if(!projects) {
          response.status(422).json({error: 'No project exists'});
        } else {
          response.sendStatus(204);
        }
      })
      .catch(error => response.status(500).json({ error }))
  });

  module.exports = app;
