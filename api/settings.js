const pg = require('pg');

const config = {
    user: process.env.PG_USER || 'fxuser', //env var: PGUSER
    database: process.env.PG_DB || 'fx', //env var: PGDATABASE
    password: process.env.PASSWORD || 'secret', //env var: PGPASSWORD
    host: (process.env.DB_HOST || 'localhost'), // Server hosting the postgres database
    port: process.env.PORT || 5432, //env var: PGPORT
    max: process.env.MAX || 10, // max number of clients in the pool
    idleTimeoutMillis: process.env.IDLE_TIMEOUT || 30000, // how long a client is allowed to remain idle before being closed
};

const constants = {
    usuario: {
        existente: 'Email ou user name ja esta sendo utilizado por outro usuario',
        naoexistente: 'Email ou user name nao existe',
        usuarioOuPassword: 'Usuario ou senha esta invalido',
        criado: 'Usuario criado com sucesso',
        camposFaltando: 'Preencher o username e senha'
    },
    token: {
        sessaoInvalida: 'Sessao invalida, faça login novamente',
        tokenMessage: 'Token da requisição não é valido, faça login novamente',
        expire: 60000
    }
}

const initializeDb = () => {
    const pool = new pg.Pool(config);
    pool.connect((err, client, done) => {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        let query = client.query('CREATE TABLE IF NOT EXISTS users(ID serial NOT NULL PRIMARY KEY, info json, parentid integer)');

        query.then(response => done()).catch(reason => {
            console.log(reason)
            done()
        })
    });

    pool.on('error', (err, client) => {
        console.error('idle client error', err.message, err.stack)
    })
}

initializeDb()

module.exports = {
    config: config,
    pg: pg,
    constants: constants
}