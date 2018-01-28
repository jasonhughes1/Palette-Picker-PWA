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
})
