'use strict'

import * as db from './db-connector.mjs'
import express from 'express'
import cors from 'cors'
import { executeQuery } from './util.mjs'
import fs from 'fs'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Database Admin API',
      version: '1.0.0',
    },
  },
  apis: ['./controller.mjs']
}

// constants

const app = express()
const PORT = 39182
const jsonParser = bodyParser.json()

// middleware

app.use(express.json())
app.use(cors())

// endpoints

// creates api docs and swagger UI for testing
const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @swagger
 * /initialize:
 *   get:
 *     description: Initializes the database with starter data
 *     responses:
 *       200:
 *         description: Returns SQL output as JSON object
 */
app.get(`/initialize`, async (req, res) => {
    fs.readFile('initialize.sql', 'utf8', async (err, sql) => {
        if (err) res.send(err);
        let result = await executeQuery(db.pool, sql)
        res.status(200).type('json').json(result)
    })
})

/**
 * @swagger
 * /tables:
 *   get:
 *     description: Get table names
 *     responses:
 *       200:
 *         description: Returns an array of tables in the database
 */
app.get('/tables', async (req, res) => {
    let tables = await executeQuery(db.pool, 'SHOW TABLES;')
    tables.forEach((t, i) => tables[i] = t.Tables_in_cs340_doironj)
    res.status(200).type('json').json(tables)
})


/**
 * @swagger
 * /{table}:
 *   get:
 *     description: Retrieve a database table.
 *     parameters:
 *       - in: path
 *         name: table
 *         required: true
 *         description: Table name in the database
 *         schema:
 *           type: string
 *       - in: query
 *         name: filterBy
 *         type: string
 *         description: Column to filter the table by
 *       - in: query
 *         name: search
 *         type: string
 *         description: Value to filter the column by
 *     responses:
 *       200:
 *         description: Returns JSON Object representing table
 */
app.get(`/:table`, async (req, res) => {
    let data
    if (req.query.filterBy !== undefined && req.query.search !== undefined) {
        data = await executeQuery(
            db.pool,
            `SELECT * FROM ${req.params.table} WHERE ${req.query.filterBy} = '${req.query.search}';`
            )
    } else {
        data = await executeQuery(db.pool, `SELECT * FROM ${req.params.table};`)
    }
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
        if (req.query.only_columns) {
            entities.push({name: table, columns})
        } else {
            let data = await executeQuery(db.pool, `SELECT * FROM ${table};`)
            entities.push({name: table, columns, data})
        }
    }
    res.status(200).type('json').json(entities)
})

/**
 * @swagger
 * /{table}/{_id}:
 *   post:
 *     description: Insert a new record into a table.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     parameters:
 *       - in: path
 *         name: table
 *         required: true
 *         description: Table name in the database
 *         type: string
 *       - in: path
 *         name: _id
 *         type: integer
 *         description: Column to filter the table by
 *     responses:
 *       200:
 *         description: Returns string
 */
app.post(`/:table/:_id`, jsonParser, async (req, res) => {
    let table = req.params.table
    let _id = req.params._id
    let valuesObj = req.body
    let columns = Object.keys(valuesObj).map(c => String(c)).join(",")
    let values = Object.values(valuesObj).map(v => {
        if (typeof(v) === 'number') {
            return String(v)
        } else {
            return `'${String(v)}'`
        }
    }).join(",")
    let sqlStmt = `INSERT INTO ${table} (${columns}) VALUES (${values});`
    res.json({_id, sql: sqlStmt})
    // insert new record into table
})

/**
 * @swagger
 * /{table}/{_id}:
 *   put:
 *     description: Update a record into a table.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     parameters:
 *       - in: path
 *         name: table
 *         required: true
 *         description: Table name in the database
 *         type: string
 *       - in: path
 *         name: _id
 *         type: integer
 *         description: Column to filter the table by
 *     responses:
 *       200:
 *         description: Returns string
 */
app.put(`/:table/:_id`, jsonParser, async (req, res) => {
    let table = req.params.table
    let _id = req.params._id
    let valuesObj = req.body
    let set = Object.keys(valuesObj).map(c => {
        let v = valuesObj[c]
        if (typeof(v) === 'number') {
            v = String(v)
        } else {
            v = `'${String(v)}'`
        }
        return `${c} = ${v}`
    }).join(",")
    let sqlStmt = `UPDATE ${table} SET ${set} WHERE id = ${_id};`
    res.json({_id, table, sql: sqlStmt})
    // insert new record into table
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
