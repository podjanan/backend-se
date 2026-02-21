const db = require('../config/db')

exports.createUser = (data)=>{

return db.query
    (
        `INSERT INTO users (full_name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING *`,
        [data.fullName,data.email,data.password,data.role]
    )
}

exports.findByEmail = (email)=>{
    return db.query('SELECT * FROM users WHERE email=$1',[email])
}

exports.activateUser = (email)=>{
    return db.query("UPDATE users SET status='active' WHERE email=$1",[email])
}
