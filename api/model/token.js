const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const settings = require('../settings')
const superSecrete = "superSecrete";
const key = 'Bearer '

module.exports = {
    verify(req, res, next) {
        let token = req.headers.authorization || ''
        token = token.split(key)[1]
        if (token) {
            let hashToken = this.hash();
            jwt.verify(token, hashToken, (err, decoded) => {
                if (err) {
                    return res
                        .status(401)
                        .send(settings.constants.sessaoInvalida);
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res
                .status(401)
                .send(settings.constants.token.tokenMessage);
        }
    },
    hash(key, key2) {
        return crypto
            .createHash('sha256', key || superSecrete)
            .update(key2 || superSecrete)
            .digest('base64');
    }
}