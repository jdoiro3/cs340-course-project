'use strict'

import * as db from './db-connector.mjs'
import express from 'express'
import { executeQuery } from './util.mjs'
import fs from 'fs'

// constants

const app = express()
const PORT = 39182

app.use(express.json())

app.get(`/initialize`, async (req, res) => {
    fs.readFile('initialize.sql', 'utf8', async (err, sql) => {
        if (err) res.send(err);
        let result = await executeQuery(db.pool, sql)
        res.status(200).type('json').json(result)
    })
})

app.get(`/:table`, async (req, res) => {
    let records = await executeQuery(db.pool, `SELECT * FROM ${req.params.table};`)
    let columns = await executeQuery(
        db.pool, 
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${req.params.table}';`
        )
    columns.forEach((c, i) => columns[i] = c.COLUMN_NAME)
    let entity = {name: req.params.table, columns: columns, data: records}
    res.status(200).type('json').json(entity)
})

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
