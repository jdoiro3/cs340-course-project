import Row from './Row'
import { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import './DatabaseTable.css'

function Filter({ columns }) {

    const [filterCol, setFilterCol] = useState()

    return (
        <Form className='w-50'>
            <Form.Group className="mb-3" >
                <Form.Label>Filter</Form.Label>
                <Form.Select aria-label="Column to Filter on" value={columns[0]} onChange={e => setFilterCol(e.target.value)}>
                    {columns.map((c, i) => <option value={c}>{c}</option>)}
                </Form.Select>
            </Form.Group>
            <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                />
            <Button variant="outline-success">Search</Button>
        </Form>
    )

}

function DatabaseTable({ entity, handleEditShow, handleAddShow, setRecordToEdit }) {

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
            {
                entity.name == "Customers" &&
                <Filter columns={entity.columns}></Filter>
            } 
            <Table className="table" striped bordered hover>
                <thead>
                    <tr>
                        {entity.columns.map((col, i) => <th key={i}>{col}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {records.map((r, i) => <Row columns={entity.columns} entityInstance={r} key={i} handleEditShow={handleEditShow} setRecordToEdit={setRecordToEdit} onDelete={onDelete} />)}
                </tbody>
            </Table>
            <Button variant="primary" onClick={() => handleAddShow()}>Add {entity.name}</Button>
        </div>
    )
}

export default DatabaseTable;