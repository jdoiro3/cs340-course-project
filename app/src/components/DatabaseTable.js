import Row from './Row'
import { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import './DatabaseTable.css'

function TableFilter({ columns }) {

    const [filterCol, setFilterCol] = useState(columns[0])

    return (
        <Form className="tableFilter">
            <Form.Group className="mb-3" >
                <Form.Label>Filter On</Form.Label>
                <Form.Select aria-label="Column to Filter on" value={filterCol} onChange={e => setFilterCol(e.target.value)}>
                    {columns.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </Form.Select>
            </Form.Group>
            <div className="filterSearch">
                <FormControl
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    />
                <Button variant="outline-success">Search</Button>
            </div>
        </Form>
    )

}

function DatabaseTable({ entity, onDelete, handleEditShow, handleAddShow, setRecordToEdit }) {
    
    return (
        <div>
            {entity.name === "Customers" && <TableFilter columns={entity.columns}></TableFilter>} 
            <Table className="table" striped bordered hover>
                <thead>
                    <tr>
                        {entity.columns.map((col, i) => <th key={i}>{col}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {entity.data.map((r, i) => <Row columns={entity.columns} entityInstance={r} key={i} handleEditShow={handleEditShow} setRecordToEdit={setRecordToEdit} onDelete={onDelete} />)}
                </tbody>
            </Table>
            <Button variant="primary" onClick={() => handleAddShow()}>Add {entity.name}</Button>
        </div>
    )
}

export default DatabaseTable;