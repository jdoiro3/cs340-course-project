// Citation:
// Adapted from Activity 2 - Connect webapp to database (Individual)
// https://canvas.oregonstate.edu/courses/1870053/assignments/8817233?module_item_id=22035978
// Retrieved on 4 April 2022

// Get an instance of mysql we can use in the app
import mysql from 'mysql'

// Create a 'connection pool' using the provided credentials
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_derussoj',
    password: 'w0EL6rNP75D7E#wl0',
    database: 'cs340_derussoj'
})

// Export it for use in our application
export { pool }
