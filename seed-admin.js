const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seed() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3006,
    user: 'root',
    password: '12345678',
    database: 'idnpackage_backend'
  });

  const hash = await bcrypt.hash('123456', 10);

  // Check if admin exists
  const [rows] = await connection.execute('SELECT * FROM user WHERE email = "admin@local.com"');
  if (rows.length === 0) {
    await connection.execute(
      'INSERT INTO user (name, email, password, role, tokenVersion) VALUES (?, ?, ?, ?, ?)',
      ['Admin Lokal', 'admin@local.com', hash, 'admin', 1]
    );
    console.log("✅ Admin user 'admin@local.com' created! Password: '123456'");
  } else {
    // Reset password
    await connection.execute(
      'UPDATE user SET password = ? WHERE email = "admin@local.com"',
      [hash]
    );
    console.log("✅ Admin user 'admin@local.com' password reset to '123456'");
  }
  
  await connection.end();
}

seed().catch(console.error);
