const jwt = require('jsonwebtoken');
const models = require('../models/index');
const moment = require('moment');
const fs = require('fs');

module.exports = (router) => {
    'use strict';

    // authentication
    router.use('/authentication', (req, res, next) => {
        if(req.method !== 'POST') { next(); }

        models.User.findOne({
            where: {
                name: req.body.name
            }
        })
        .then((user) => {
            if(!user) {
                return res.send(401, 'Unauthorized user not exist');
            }

            if(user.password != req.body.password) {
                return res.send(401, 'Unauthorized password invalid');
            }

            const iat = (new Date()).getTime();
            const exp = moment().add(24, 'hours').valueOf();
            const cert = req.app.get('privateKey');
            const passphrase = req.app.get('passphrase');
            const token = jwt.sign({
                issue: user.id,
                exp: exp,
                iat: iat,
            }, {key: cert, passphrase: passphrase}, { algorithm: 'RS256' });

            res.auth_token = token;
            next();
        })
        .catch((error) => {
            console.error(error);
            return res.send(401, 'Unauthorized');
        });
    });

    router.post('/authentication', (req, res, next) => {
        const response = {
            token : res.auth_token,
            message: 'Authentication successfully finished.'
        }
        return res.status(201).send(response);
    });
}
