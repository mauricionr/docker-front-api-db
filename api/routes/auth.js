const router = require('express').Router()
const settings = require('../settings')
const user = require('../model/user')
const jwt = require('jsonwebtoken');
const token = require('../model/token')

const jwtOptions = { expiresIn: settings.constants.token.expire }

router.post('/singup', (req, res, next) => {
    let data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        active: false,
        confirmed: false
    };
    console.log(data)
    if (!data.name || !data.email || !data.password) {
        return res
            .status(400)
            .json({
                error: true,
                message: settings.constants.usuario.camposFaltando
            })
    }

    let pool = new settings.pg.Pool(settings.config)

    return pool
        .connect((reason, client, done) => {
            if (reason) {
                done();
                return res
                    .status(500)
                    .json({
                        eror: true,
                        data: reason.message
                    });
            }
            return user
                .findUserByEmailOrUserName(client, data.email, data.name)
                .then(response => {
                    if (response.rows.length) {
                        res
                            .status(400)
                            .json({
                                created: false,
                                message: settings.constants.usuario.existente
                            })
                    } else {

                        let hash = token.hash()
                        data.password = token.hash(data.password, data.password)
                        data.token = jwt.sign(data, hash, jwtOptions)

                        return user
                            .addUser(client, data, req.body.parentID)
                            .then((response) => {
                                done();
                                return res
                                    .status(200)
                                    .json({
                                        created: true,
                                        message: settings.constants.usuario.criado
                                    });
                            })
                            .catch(reason => {
                                done();
                                return res
                                    .status(500)
                                    .json({
                                        error: true,
                                        message: reason.message
                                    })
                            });
                    }
                })
        });
});

router.post('/login', (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return res
            .status(400)
            .json({
                error: true,
                message: settings.constants.usuario.camposFaltando
            })
    }
    let pool = new settings.pg.Pool(settings.config)
    return pool
        .connect((reason, client, done) => {
            if (reason) {
                done();
                return res
                    .status(500)
                    .json({
                        error: true,
                        message: reason.message
                    });
            }
            return user
                .findUserByEmailOrUserName(client, req.body.username, req.body.username)
                .then(response => {
                    if (!response.rows.length) {
                        return res
                            .status(400)
                            .json({
                                success: false,
                                message: settings.constants.usuario.naoexistente
                            })
                    }

                    let currentUser = response.rows[0];
                    req.body.password = token.hash(req.body.password, req.body.password)

                    if (currentUser.info.password !== req.body.password) {
                        return res
                            .status(400)
                            .json({
                                susscces: false,
                                message: settings.constants.usuario.usuarioOuPassword
                            })
                    }

                    currentUser.info.token = '';
                    currentUser.info.token = jwt.sign(currentUser, token.hash(), jwtOptions)

                    user
                        .updateInfo(client, currentUser.info, currentUser.id)
                        .then(response => {
                            done()
                            return res
                                .status(200)
                                .json({
                                    success: true, user: currentUser
                                })
                        })
                        .catch(reason => {
                            done();
                            return res
                                .status(500)
                                .json({
                                    error: true,
                                    data: reason.message
                                })
                        });
                })
                .catch(reason => {
                    done();
                    return res
                        .status(500)
                        .json({
                            error: true,
                            message: reason.message
                        })
                });
        })
})

module.exports = router;