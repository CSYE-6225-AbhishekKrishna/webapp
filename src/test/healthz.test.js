// const request = require('supertest');
// const app = require('../app'); // Import your Express app

// describe('Integration Test: /healthz Endpoint', () => {
//   it('should return status code 200', async () => {
//     const response = await request(app).use('/healthz');
//     expect(response.status).toBe(200);
//   });
// });

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Adjust the path as needed

chai.use(chaiHttp);
const expect = chai.expect;

describe('Healthz Endpoint', () => {
    it('should return a 200 status', async () => {
        const response = await chai.request(app).get('/healt');
        expect(response.status).to.equal(200);
    });
});
