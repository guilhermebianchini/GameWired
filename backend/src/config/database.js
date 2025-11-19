import mssql from "mssql"

const sqlConfig = {
  user: 'sa',
  password: 'hash597648',
  server: 'DESKTOP-GUILHER\\SQLEXPRESS',
  database: 'userData',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
}

export async function connect() {
  try {
    const conn = await mssql.connect(sqlConfig)
    console.log("Conectado ao SQL Server!")
    return conn
  } catch (err) {
    console.error("Erro na conexão com SQL:", err)
    throw err
  }
}

connect()

export default connect