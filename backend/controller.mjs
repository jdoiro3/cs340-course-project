'use strict'

import * as db from './db-connector.mjs'
import express from 'express'
import { executeQuery } from './util.mjs'
import fs from 'fs'
import bodyParser from 'body-parser'

// constants

const app = express()
const PORT = 39182
const jsonParser = bodyParser.json()

app.use(express.json())

app.get(`/initialize`, async (req, res) => {
    fs.readFile('initialize.sql', 'utf8', async (err, sql) => {
        if (err) res.send(err);
        let result = await executeQuery(db.pool, sql)
        res.status(200).type('json').json(result)
    })
})

app.get('/tables', async (req, res) => {
    let tables = await executeQuery(db.pool, 'SHOW TABLES;')
    tables.forEach((t, i) => tables[i] = t.Tables_in_cs340_doironj)
    res.status(200).type('json').json(tables)
})

app.get(`/:table`, async (req, res) => {
    let data = await executeQuery(db.pool, `SELECT * FROM ${req.params.table};`)
    let columns = await executeQuery(
        db.pool, 
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${req.params.table}';`
        )
    columns.forEach((c, i) => columns[i] = c.COLUMN_NAME)
    let entity = {name: req.params.table, columns, data}
    res.status(200).type('json').json(entity)
})

app.get('/tables/data', async (req, res) => {
    let tables = await executeQuery(db.pool, 'SHOW TABLES;')
    tables.forEach((t, i) => tables[i] = t.Tables_in_cs340_doironj)
    let entities = []
    for (let table of tables) {
        let columns = await executeQuery(
            db.pool, 
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${table}';`
            )
        columns.forEach((c, i) => columns[i] = c.COLUMN_NAME)
        if (req.params.only_columns) {
            entities.push({name: table, columns})
        } else {
            let data = await executeQuery(db.pool, `SELECT * FROM ${table};`)
            entities.push({name: table, columns, data})
        }
    }
    res.status(200).type('json').json(entities)
})

app.post(`/:table/:_id`, jsonParser, async (req, res) => {
    let table = req.params.table
    let _id = req.params._id
    let values = req.body // {column: value}
    // insert new record into table
})

app.put(`/:table`, jsonParser, async (req, res) => {
    let table = req.params.table
    let _id = req.params._id
    let values = req.body // {column: value}
    // update record in table
})

app.delete(`/:table/:_id`, async (req, res) => {
    // delete a table record
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
