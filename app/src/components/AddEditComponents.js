import { useEffect, useState, React } from 'react'
import Form from 'react-bootstrap/Form'
import Select from 'react-select'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { formatValue, getCustomerOptions } from '../util'

export function ForeignKeyDropdown({ columnName, foreignEntity, foreignEntityValues, setRecord, record, nullable }) {

    useEffect(() => {
        const hasNull = foreignEntityValues.some(v => {
            if (v.label === "Null") { return true }
            return false
        })
        if (nullable && !hasNull) {
            foreignEntityValues.push({label: "Null", value: "NULL"})
        }
    }, [ foreignEntityValues, nullable ])

    return (
        <Form.Group key={columnName} className="mb-3">
            <Form.Label>{foreignEntity}</Form.Label>
            <Select
                defaultValue={() => foreignEntityValues.filter(v => v.id === record[columnName])}
                name="colors"
                options={foreignEntityValues}
                className="basic-single"
                classNamePrefix="select"
                onChange={selected => {
                    let newRecord = {...record}
                    newRecord[columnName] = selected.value
                    setRecord(newRecord)
                }}
            />
        </Form.Group>
    )
}


export function SaleForm({ title, setRecord, onSubmit, record, showForm, handleFormClose, saleCustomers }) {

    const [locations, setLocations] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [employees, setEmployees] = useState([])
    const [customerOptions, setCustomerOptions] = useState([])
    const [customersSelected, setCustomersSelected] = useState([])

    function handleCustomerschange(selected) {
        selected = selected.map(obj => obj.value)
        setCustomersSelected(selected)
    }

    useEffect(() => {
        async function loadCustomerOptions() {
            let customers = await getCustomerOptions()
            setCustomerOptions(customers)
        }
        async function getForeignKeyData(entity, labelFunc, setFunc) {
            let resp = await fetch(`http://flip1.engr.oregonstate.edu:39182/${entity}`, {mode: 'cors'})
            let data = (await resp.json()).data
            data.forEach(rec => {
                rec.value = rec.id
                rec.label = labelFunc(rec)
            })
            setFunc(data)
        }
        getForeignKeyData("Locations", loc => `${loc.street} ${loc.city}, ${loc.state}`, setLocations)
        getForeignKeyData("Vehicles", v => v.vin, setVehicles)
        getForeignKeyData("Employees", e => `${e.first_name} ${e.last_name}`, setEmployees)
        loadCustomerOptions()
    }, [])
    // saleCustomers changes when an edit/add button is clicked and we need to update
    // this components customers selected to reflect either a new sale we're editing or a sale we're adding
    useEffect(() => {
        setCustomersSelected(saleCustomers.map(c => c.value))
    }, [saleCustomers])

    useEffect(() => {
        let newRecord = {...record}
        newRecord.saleCustomers = customersSelected
        setRecord(newRecord)
    }, [customersSelected])

    return (
        <Modal show={showForm} onHide={handleFormClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="edit-form" onSubmit={(e) => onSubmit(e)}>
                    {Object.keys(record).map(k => {
                        switch (k) {
                            case 'id': case 'saleCustomers':
                                return null
                            case 'location_id':
                                return (
                                    <ForeignKeyDropdown 
                                        key={k}
                                        columnName={k} 
                                        foreignEntity="Location" 
                                        foreignEntityValues={locations}
                                        setRecord={setRecord}
                                        record={record}
                                    ></ForeignKeyDropdown>
                                )
                            case 'vehicle_id':
                                return (
                                    <ForeignKeyDropdown 
                                        key={k}
                                        columnName={k}
                                        foreignEntity="Vehicle" 
                                        foreignEntityValues={vehicles}
                                        setRecord={setRecord}
                                        record={record}
                                    ></ForeignKeyDropdown>
                                )
                            case 'employee_id':
                                return (
                                    <ForeignKeyDropdown 
                                        key={k}
                                        columnName={k}
                                        foreignEntity="Employee" 
                                        foreignEntityValues={employees}
                                        setRecord={setRecord}
                                        record={record}
                                    ></ForeignKeyDropdown>
                                )
                            default:
                                return (
                                    <Form.Group key={k} className="mb-3">
                                        <Form.Label>{k}</Form.Label>
                                        <Form.Control 
                                            // assumes date columns contain the value 'date' in the column name
                                            type={k.includes("date") ? "date": "text"}
                                            value={record[k] === null ? "": formatValue(record[k])}
                                            onChange={e => {
                                                let newRecord = {...record}
                                                newRecord[k] = e.target.value
                                                setRecord(newRecord)
                                            }} 
                                            autoFocus
                                        />
                                    </Form.Group>
                                )
                        }
                    })}
                    <Form.Group key={Object.keys(record).length + 1} className="mb-3">
                        <Form.Label>Customers</Form.Label>
                        <Select
                            defaultValue={() => saleCustomers}
                            isMulti
                            name="colors"
                            options={customerOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleCustomerschange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleFormClose}>
                    Close
                </Button>
                <Button variant="primary" type="submit" form="edit-form">
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}


export function EmployeeForm({ title, setRecord, onSubmit, record, showForm, handleFormClose }) {

    const [locations, setLocations] = useState([])

    useEffect(() => {
        async function getLocations() {
            let resp = await fetch(`http://flip1.engr.oregonstate.edu:39182/Locations`, {mode: 'cors'})
            let locations = (await resp.json()).data
            locations.forEach(loc => {
                loc.value = loc.id
                loc.label = `${loc.street} ${loc.city}, ${loc.state}`
            })
            setLocations(locations)
        }
        getLocations()
    }, [])

    return (
        <Modal show={showForm} onHide={handleFormClose} centered>
            {console.log(locations)}
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="edit-form" onSubmit={(e) => onSubmit(e)}>
                    {Object.keys(record).map(k => {
                        switch (k) {
                            case 'id':
                                return null
                            case 'location_id':
                                return (
                                    <ForeignKeyDropdown 
                                        key={k}
                                        columnName="location_id" 
                                        foreignEntity="Location" 
                                        foreignEntityValues={locations}
                                        setRecord={setRecord}
                                        record={record}
                                    ></ForeignKeyDropdown>
                                )
                            default:
                                return (
                                    <Form.Group key={k} className="mb-3">
                                        <Form.Label>{k}</Form.Label>
                                        <Form.Control 
                                            // assumes date columns contain the value 'date' in the column name
                                            type={k.includes("date") ? "date": "text"}
                                            value={record[k] === null ? "": formatValue(record[k])}
                                            onChange={e => {
                                                let newRecord = {...record}
                                                newRecord[k] = e.target.value
                                                setRecord(newRecord)
                                            }} 
                                            autoFocus
                                        />
                                    </Form.Group>
                                )
                        }
                    })}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleFormClose}>
                    Close
                </Button>
                <Button variant="primary" type="submit" form="edit-form">
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}


export function VehicleForm({ title, setRecord, onSubmit, record, showForm, handleFormClose }) {

    const [locations, setLocations] = useState([])
    const [models, setModels] = useState([])

    useEffect(() => {
        async function getForeignKeyData(entity, labelFunc, setFunc) {
            let resp = await fetch(`http://flip1.engr.oregonstate.edu:39182/${entity}`, {mode: 'cors'})
            let data = (await resp.json()).data
            data.forEach(rec => {
                rec.value = rec.id
                rec.label = labelFunc(rec)
            })
            setFunc(data)
        }
        getForeignKeyData("Locations", loc => `${loc.street} ${loc.city}, ${loc.state}`, setLocations)
        getForeignKeyData("Models", model => `${model.model_year} ${model.manufacturer} ${model.model}, ${model.generation} gen`, setModels)
    }, [])

    return (
        <Modal show={showForm} onHide={handleFormClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="edit-form" onSubmit={(e) => onSubmit(e)}>
                    {Object.keys(record).map(k => {
                        switch (k) {
                            case 'id':
                                return null
                            case 'location_id':
                                return (
                                    <ForeignKeyDropdown 
                                        key={k}
                                        columnName={k} 
                                        foreignEntity="Location" 
                                        foreignEntityValues={locations}
                                        setRecord={setRecord}
                                        record={record}
                                        nullable={true}
                                    ></ForeignKeyDropdown>
                                )
                            case 'model_id':
                                return (
                                    <ForeignKeyDropdown 
                                        key={k}
                                        columnName={k} 
                                        foreignEntity="Model" 
                                        foreignEntityValues={models}
                                        setRecord={setRecord}
                                        record={record}
                                    ></ForeignKeyDropdown>
                                )
                            default:
                                return (
                                    <Form.Group key={k} className="mb-3">
                                        <Form.Label>{k}</Form.Label>
                                        <Form.Control 
                                            // assumes date columns contain the value 'date' in the column name
                                            type={k.includes("date") ? "date": "text"}
                                            value={record[k] === null ? "": formatValue(record[k])}
                                            onChange={e => {
                                                let newRecord = {...record}
                                                newRecord[k] = e.target.value
                                                setRecord(newRecord)
                                            }} 
                                            autoFocus
                                        />
                                    </Form.Group>
                                )
                        }
                    })}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleFormClose}>
                    Close
                </Button>
                <Button variant="primary" type="submit" form="edit-form">
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}