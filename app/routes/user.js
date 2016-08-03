const jwt = require('jsonwebtoken');
const models = require('../models/index');

module.exports = (router) => {
    'use strict';

    router.use('/user', (req, res, next) => {
        if(req.method == 'GET' || req.method == 'DELETE') {
            const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
            if(token) {
                try {
                    const decoded = jwt.verify(token, cert, {algorithm: ['HS256', 'RS256']}, (error, decoded) => {
                        if (error) {
                            console.error(error);
                            return res.status(400).send(error);
                        } else {
                            if (decoded.exp <= Date.now()) {
                                return res.status(400).send('Access token has expired');
                            }

                            res.auth_issue = decoded.issue;
                            next();
                        }
                    });
                } catch(error) {
                    console.error(error);
                    return res.status(400).send(error);
                }
            } else {
                return res.status(400).send('Access token invalid');
            }

            next();
        }

        if(req.method == 'POST') {

            models.User.findOne({ where: { name: req.body.name } })
            .then((user) => {
                if(user) {
                    return res.status(500).send('User is exist');
                }
                next();
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).send(error);
            });
        }
    });

    router.get('/user', (req, res, next) => {
        let where, attributes;
        if(res.auth_issue) {
            where = {id: res.auth_issue};
            attributes = ['id', 'name', 'password'];
        } else {
            where = {name: req.query.name};
            attributes = ['id', 'name'];
        }

        models.User.findOne({
            where: where,
            attributes: attributes
        })
        .then((user) => {
            res.status(201).json(user);
        })
    });

    router.post('/user', (req, res, next) => {
        models.User.create({
            name: req.body.name,
            password: req.body.password
        }).then((user) => {
            res.status(201).json(user);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send(error);
        });
    });
}
