const request = require('supertest')


describe('Test secured endpoints', () => {

    var server

    beforeAll(() => {
        delete require.cache[require.resolve('../app')]
        server = require('../app')
    })


    afterAll(async (done) => {
        await server.close(done)
    })

    var token
    var messages = []

    beforeAll((done) => {
        request(server)
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

        const res = await request(server)
            .get('/chat/users')
            .set('Authorization', 'Bearer ' + token)

        expect(res.statusCode).toEqual(200)
        done()

    })

    it('should get an invalid token for list users', async (done) => {

        const res = await request(server)
            .get('/chat/users')
            .set('Authorization', 'Bearer potato')

        expect(res.statusCode).toEqual(401)
        done()

    })

    it('should get a conversation by name teste', async (done) => {

        const res = await request(server)
            .get(`/chat/conversation?chat=teste`)
            .set('Authorization', 'Bearer ' + token)

        messages = res.body.messages
        expect(res.statusCode).toEqual(200)
        done()

    })

    it('should post a new message to conversation by name teste', async (done) => {

        const res = await request(server)
            .post(`/chat/conversation?chat=teste`)
            .send({
                chatName: 'teste',
                messages: [...messages, { user: 'teste', message: 'New message teste' }]
            })
            .set('Authorization', 'Bearer ' + token)


        expect(res.statusCode).toEqual(200)
        done()

    })

    it('should post a new message to conversation by name teste with an invalid token', async (done) => {

        const res = await request(server)
            .post(`/chat/conversation?chat=teste`)
            .send({
                chatName: 'teste',
                messages: [...messages, { user: 'teste', message: 'New message teste' }]
            })
            .set('Authorization', 'Bearer potato')


        expect(res.statusCode).toEqual(401)
        done()

    })


    it('should get a conversation and check the content message', async (done) => {

        const res = await request(server)
            .get(`/chat/conversation?chat=teste`)
            .set('Authorization', 'Bearer ' + token)

        messages = res.body.messages
        //Check the last message is the same as the older test 
        expect(messages[messages.length - 1].message).toEqual('New message teste')
        done()

    })





})


