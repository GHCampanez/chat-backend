const request = require('supertest')
const app = require('../app')


describe('Verify users', () => {
    it('It should return a user', async (done) => {
        const res = await request(app)
            .post('/user/verify')
            .send({
                name: 'teste',
                password: 'teste',
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('user')
        done()
    })
})

describe('Verify users', () => {
    it('It should return a message that user already exists', async (done) => {
        const res = await request(app)
            .post('/user/register')
            .send({
                name: 'teste',
                password: 'teste',
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('error')
        done()
    })
})

describe('Test secured endpoints', () => {

    var token
    beforeAll((done) => {
        request(app)
            .post('/user/verify')
            .send({
                name: 'teste',
                password: 'teste',
            })
            .end((err, response) => {
                token = response.body.token; // save the token!
                done()
            });
    });


    it('should get a valid token for list users', async (done) => {

        const res = await request(app)
            .get('/chat/users')
            .set('Authorization', 'Bearer ' + token)

        expect(res.statusCode).toEqual(200)
        done()

    })
})