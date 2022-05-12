import Row from './Row'
import Table from 'react-bootstrap/Table'
import './DatabaseTable.css'
import { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

function TableFilter({ columns, entityName, setData }) {

    const [filterCol, setFilterCol] = useState(columns[0])
    const [searchVal, setSearchVal] = useState("")

    async function onSubmit(event) {
        event.preventDefault()
        console.log("searching")
        let resp = await fetch(
            `http://flip1.engr.oregonstate.edu:39182/${entityName}`, 
            { filterBy: filterCol, search: searchVal, mode: 'cors'}
            )
        let entity = await resp.json()
        setData(entity.data)
    }

    return (
        <Form onSubmit={(e) => onSubmit(e)} className="tableFilter">
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
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    />
                <Button type="submit" variant="outline-success">Search</Button>
            </div>
        </Form>
    )

}

function DatabaseTable({ entity, onDelete, setSaleCustomers, handleEditShow, setRecordToEdit }) {

    const [tableData, setData] = useState(entity.data)
    
    return (
        <div>
            {
            entity.name === "Customers" && 
            <TableFilter 
                entityName={entity.name} 
                columns={entity.columns} 
                setData={setData}
            ></TableFilter>
            }
            <Table className="table" striped bordered hover>
                <thead>
                    <tr>
                        {entity.columns.map((col, i) => <th key={i}>{col}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((r, i) =>
                        <Row 
                            entityName={entity.name} 
                            columns={entity.columns} 
                            setSaleCustomers={setSaleCustomers} 
                            entityInstance={r} key={i} 
                            handleEditShow={handleEditShow} 
                            setRecordToEdit={setRecordToEdit} 
                            onDelete={onDelete} 
                        />
                        )}
                </tbody>
            </Table>
        </div>
    )
}

export default DatabaseTable;