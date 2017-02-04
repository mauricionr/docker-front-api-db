module.exports = {
    findUserByEmailOrUserName(client, email, userName) {
        return client.query(`SELECT * FROM users WHERE info->>'email' = $1 OR info->>'name' = $2`, [email, userName])
    },
    addUser(client, user, parentID) {
        if (parentID) {
            return client.query('INSERT INTO users (info, parentid) VALUES ($1, $2)', [user, parentID])
        } else {
            return client.query('INSERT INTO users (info) VALUES ($1)', [user])
        }
    },
    updateInfo(client, info, id) {
        return client.query(`UPDATE users SET info=($2) WHERE id=($1)`, [id, info])
    },
    getUsers(client, parentID) {
        return client.query('SELECT * FROM users WHERE parentid=($1) OR id=($1)', [parentID])
    },
    deleteUser(client, id) {
        return client.query('DELETE FROM users WHERE id = ($1)', [id])
    }
}
