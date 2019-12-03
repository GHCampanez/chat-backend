const request = require('supertest')


describe('Verify users', () => {

    var server

    beforeAll(() => {
        server = require('../app')
    })

    afterAll(async (done) => {
        await server.close(done) 
    })

    it('It should return a user', async (done) => {
        const res = await request(server)
            .post('/user/verify')
            .send({
                name: 'teste',
                password: 'teste',
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('user')
        done()
    })

    it('It should return a message that user already exists', async (done) => {
        const res = await request(server)
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



