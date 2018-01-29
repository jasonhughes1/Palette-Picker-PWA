process.env.NODE_ENV = 'test';
const chaiHttp = require('chai-http');
const server = require('../server');
const chai = require('chai');

const should = chai.should();

const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);

chai.use(chaiHttp);


describe('Everything', () => {
  before((done) => {
    database.migrate.latest()
   .then(() => {
     return database.seed.run();
   })
   .then(() => {
     done();
   });
  });

  beforeEach((done) => {
    database.seed.run()
   .then(() => {
     done();
   });
  });

describe('Client Routes', () => {

  it('Should return the homepage with text', () => {
  return chai.request(server)
  .get('/')
  .then(response => {
    response.should.have.status(200);
    response.should.be.html;
  })
  .catch(error => {
    throw error;
      })
    });
  })
  it('Should return a 404 for a route that does not exist', () => {
    return chai.request(server)
    .get('/sad')
    .then(response => {
      response.should.have.status(404);
    })
    .catch(err => {
      throw err;
    });
  });
  describe('API Routes', () => {

describe('POST /api/v1/projects', () => {
  it('should post a new project', () => {
    return chai.request(server)
    .post('/api/v1/projects')
    .send({
      projectName: 'Project 1',
      id: '1'
    })
    .then(response => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('id');
      response.body.id.should.equal(1);
    })
    .catch(err => {
      throw err;
    });
  });

  describe('GET api/v1/projects', () => {
it('should return all the projects', () => {
  return chai.request(server)
  .get('/api/v1/projects')
  .then(response => {
    response.should.have.status(200);
    response.should.be.json;
    response.body.should.be.a('object');
    response.res.should.be.a('object');
  })
  .catch(err => {
    throw err;
    });
  });
});

  it('should return 422 when a required param is missing', () => {
    return chai.request(server)
      .post('/api/v1/projects')
      .send({
        project: {
        }
      })
      .then(response => {
      })
      .catch(error => {
        error.should.have.status(422);
      });
  });
});

describe('DELETE /api/v1/palettes/:id', () => {
  it('should delete a palette', () => {
    return chai.request(server)
      .delete('/api/v1/palettes/1')
      .then(response => {
        response.should.have.status(204);
      })
      .catch(error => {
        throw error;
      });
    });

  it('should return an error if a palette is not found with the id', () => {
    return chai.request(server)
      .delete('/api/v1/palettes/1')
      .then(response => {
      })
      .catch(error => {
        error.should.have.status(422);
      })
    })
  })
});
})
