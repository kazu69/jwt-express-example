const request = require('supertest');
const should = require('should');
const app = require('../app/index.js');
const models = require('../app/models/index');

describe('GET /', () => {
    it('respond with html', (done) => {
        request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .expect((res) => {
                res.body = 'hello world';
            })
            .expect(200, done)
    })
});

describe('POST /user', () => {
    it('create user', (done) => {
        request(app)
            .post('/user')
            .send({name: 'hoge', password: 'hugahoge'})
            .expect('Content-Type', /json/)
            .expect(201)
            .expect((res) => {
                res.body.name.should.equal('hoge');
                res.body.password.should.equal('hugahoge');
            })
            .end((err, res) => {
                models.User.destroy({
                    where: {
                        id: res.body.id
                    }
                });

                done();
            });
    })
});

describe('POST /authentication', () => {
    it('create jwt', (done) => {
        const data = {
            name: 'hoge',
            password: 'hugahuga'
        };

        let user;

        models.User.create(data)
        .then((u) => {
            user = u
        });

        request(app)
            .post('/authentication')
            .send(data)
            .expect('Content-Type', /json/)
            .expect(201)
            .expect((res) => {
                res.body.should.exist('token')
                res.body.message.should.equal('Authentication successfully finished.');
            })
            .end((err, res) => {
                models.User.destroy({
                    where: {
                        id: user.id
                    }
                });
                done();
            });
    });
});

describe('POST /login', () => {
    it('return user data', (done) => {
        const data = {
            name: 'hoge',
            password: 'hugahuga'
        };
        let user, token;

        models.User.create(data)
        .then((u) => {
            user = u
        });

        request(app)
            .post('/authentication')
            .send(data)
            .end((err, res) => {
                token = res.body.token;

                request(app)
                    .post('/login')
                    .send({ access_token: token })
                    .expect('Content-Type', /json/)
                    .expect(201)
                    .expect((res) => {
                        res.body.name.should.equal('hoge');
                        res.body.password.should.equal('hugahoge');
                    })
                    .end((err, res) => {
                        models.User.destroy({
                            where: {
                                id: user.id
                            }
                        });
                        done();
                    });
            });
    });
});
