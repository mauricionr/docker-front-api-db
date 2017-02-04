const router = require('express').Router()
const settings = require('../settings')
const user = require('../model/user')
const token = require('../model/token')
const verify = token.verify.bind(token);

router.delete('/', verify, (req, res) => {
    if (!req.query.id) {
        return res
            .status(400)
            .json({
                error: true,
                message: 'Parametro faltando'
            })
    }
    let pool = new settings.pg.Pool(settings.config)
    return pool
        .connect((err, client, done) => {
            if (err) {
                done();
                return res
                    .status(500)
                    .json({
                        eror: true,
                        message: err.message
                    });
            }
            return user
                .deleteUser(client, req.query.id)
                .then(response => {
                    done()
                    return res
                        .status(200)
                        .json({
                            success: true,
                            message: 'Usuario deletado com sucesso'
                        })
                })
                .catch(reason => {
                    done();
                    return res
                        .status(400)
                        .json({
                            error: true,
                            message: reason.message
                        })
                });
        })
})

router.get('/', verify, (req, res) => {
    if (!req.query.parentid) {
        return res.status(400).json({ error: true, message: 'Parametro faltando' })
    }
    let pool = new settings.pg.Pool(settings.config)
    return pool
        .connect((err, client, done) => {
            if (err) {
                done();
                return res
                    .status(500)
                    .json({
                        eror: true,
                        data: err.message
                    });
            }
            return user
                .getUsers(client, req.query.parentid)
                .then(response => {
                    done()
                    return res
                        .status(200)
                        .json(response.rows)
                })
                .catch(reason => {
                    done();
                    return res
                        .status(400)
                        .json({
                            error: true,
                            data: reason.message
                        })
                });
        })
})

module.exports = router;