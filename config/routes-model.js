const db = require("../database/dbConfig.js")

module.exports = {
    find,
    findBy,
    add,
    findById
};

function find() {
    return db("users").select("id", "username");
}

function findBy(username) {
    return db('users')
        .where(username)
        .then(user => {
            if (user.length) {
                return user[0]
            } else {
                return null
            }
        })
}

function add(user) {
    return db('users')
        .insert(user, 'id')
        // .then(ids => {
        //     const [id] = ids;
        //     return findById(id);
        // });
}

function findById(id) {
    return db("users")
        .select("id", "username")
        .where({ id })
        .first();
}