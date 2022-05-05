import Row from './Row'
import { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Dropdown from 'react-bootstrap/Dropdown'
import './DatabaseTable.css'

function DatabaseTable({ entity, onEdit }) {

    const [records, setRecords] = useState([])

    async function loadRecords() {
        // get records from table
        setRecords(entity.data)
    }

    async function deleteAll() {
        // delete all records
        loadRecords()
    }

    async function deleteRecord(record) {
        // deletes a record from the table
    }

    const onDelete = async (record) => {
        deleteRecord(record)
        loadRecords()
    }

    useEffect(() => {
        loadRecords()
    })
    
    return (
        <div>
            <Dropdown className="table-dropdown">
                <Dropdown.Toggle variant="success" id="Dropdown-basic">
                    Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="/add-exercise">Add {entity.name}</Dropdown.Item>
                    <Dropdown.Item href="/add-exercise">Update {entity.name}</Dropdown.Item>
                    <Dropdown.Item href="/add-exercise">Delete {entity.name}</Dropdown.Item>
                    <Dropdown.Item onClick={() => deleteAll()}>Delete All</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Table className="table" striped bordered hover>
                <thead>
                    <tr>
                        {entity.columns.map((col, i) => <th key={i}>{col}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {records.map((r, i) => <Row columns={entity.columns} entityInstance={r} key={i} onEdit={onEdit} onDelete={onDelete} />)}
                </tbody>
            </Table>
        </div>
    )
}

export default DatabaseTable;