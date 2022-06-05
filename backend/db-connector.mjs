// Citation:
// Adapted from Activity 2 - Connect webapp to database (Individual)
// https://canvas.oregonstate.edu/courses/1870053/assignments/8817233?module_item_id=22035978
// Retrieved on 4 April 2022

// Get an instance of mysql we can use in the app
import mysql from 'mysql'
import util from 'util'
import fs from 'fs'
import argv from 'yargs-parser'

const args = argv(process.argv.slice(2))

if (args.env === 'dev') {
    var connSettings = {
        "connectionLimit": 10,
        "host": "localhost",
        "user": args.user,
        "password": args.password,
        "database": args.database,
        "multipleStatements": true
    }
} else {
    var connSettings = JSON.parse(fs.readFileSync('connSettings.json', 'utf8'))
}

// Create a 'connection pool' using the provided credentials
let pool = mysql.createPool(connSettings)

// promisify the query method
pool.query = util.promisify(pool.query).bind(pool)

// Export it for use in our application
export { pool }
