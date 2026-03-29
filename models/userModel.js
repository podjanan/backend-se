const db = require('../config/db')

exports.createUser = (data)=>{
    return db.query(
        `INSERT INTO users (full_name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING *`,
        [data.fullName, data.email, data.password, data.role]
    )
}

exports.findByEmail = (email)=>{
    return db.query('SELECT * FROM users WHERE email=$1', [email])
}

exports.activateUser = (email)=>{
    return db.query("UPDATE users SET status='active' WHERE email=$1", [email])
}

exports.updatePassword = (email, hashedPassword)=>{
    return db.query(
        'UPDATE users SET password=$1 WHERE email=$2',
        [hashedPassword, email]
    )
}

// ── เพิ่มใหม่สำหรับ profile ──────────────────────────────────────

exports.getById = async (id) => {
    const result = await db.query(
        `SELECT id, full_name, email, password, avatar_url, role, status FROM users WHERE id = $1`,
        [id]
    );
    return result.rows[0] || null;
};

exports.updateProfile = async (id, { full_name, avatar_url }) => {
    const result = await db.query(
        `UPDATE users SET
            full_name = COALESCE($1, full_name),
            avatar_url = COALESCE($2, avatar_url)
         WHERE id = $3
         RETURNING id, full_name, email, avatar_url`,
        [full_name || null, avatar_url || null, id]
    );
    return result.rows[0] || null;
};