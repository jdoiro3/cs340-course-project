import * as db from './db-connector.mjs'
import express from 'express'
const app = express()
const PORT = 39182

app.use(express.json())

/**
 * Retrieves all the Customers in the database.
 * 
 * Sends back the Customers as an array of JSON objects.
 */
 app.get('/customers', (req, res) => {
    const query = 'SELECT * FROM Customers;'
    db.pool.query(query, (error, results, fields) => {
        res.status(200).json(results)
    })
})

/**
 * Retrieves all the Employees in the database.
 * 
 * Sends back the Employees as an array of JSON objects.
 */
 app.get('/employees', (req, res) => {
    const query = 'SELECT * FROM Employees;'
    db.pool.query(query, (error, results, fields) => {
        res.status(200).json(results)
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
})
