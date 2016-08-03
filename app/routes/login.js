const jwt = require('jsonwebtoken');
const models = require('../models/index');

module.exports = (router) => {
    'use strict';

    // token decode
    router.use('/login', (req, res, next) => {
        if(req.method !== 'POST') { next(); }

        const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

        if(token) {
            try {
                const cert = req.app.get('publicKey');
                const decoded = jwt.verify(token, cert, {algorithm: ['HS256', 'RS256']}, (error, decoded) => {
                    if (error) {
                        console.error(error);
                        return res.status(400).send(error)
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
                return res.send(error, 400);
            }
        } else {
            return res.send('Access token invalid', 400);
        }
    });

    router.post('/login', (req, res, next) => {
        models.User.findOne({
            where: { id: res.auth_issue },
            attributes: ['id', 'name']
        })
        .then((user) => {
            return res.status(201).send(user);
        })
        .catch((error) => {
            console.error(error);
            return res.send(500, error);
        });
    })
};
