import { useState, useEffect, React } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select'
import { formatValue, getCustomerOptions } from '../util'


export function ForeignKeyDropdown({ columnName, foreignEntity, foreignEntityValues, setRecord, record, nullable }) {

    useEffect(() => {
        if (nullable) {
            foreignEntityValues.push({label: "Null", value: "NULL"})
        }
    }, [ foreignEntityValues, nullable])

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


export function SaleEdit({ setRecord, onSubmit, record, showEdit, handleEditClose, saleCustomers }) {

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

    useEffect(() => {
        setCustomersSelected(saleCustomers.map(c => c.value))
    }, [saleCustomers])

    useEffect(() => {
        let newRecord = {...record}
        newRecord.saleCustomers = customersSelected
        setRecord(newRecord)
    }, [customersSelected, record, setRecord])

    return (
        <Modal show={showEdit} onHide={handleEditClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Sale Record</Modal.Title>
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
                <Button variant="secondary" onClick={handleEditClose}>
                    Close
                </Button>
                <Button variant="primary" type="submit" form="edit-form">
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}


export function EmployeeEdit({ setRecord, onSubmit, record, showEdit, handleEditClose }) {

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
        <Modal show={showEdit} onHide={handleEditClose} centered>
            {console.log(locations)}
            <Modal.Header closeButton>
                <Modal.Title>Edit Employee Record</Modal.Title>
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
                <Button variant="secondary" onClick={handleEditClose}>
                    Close
                </Button>
                <Button variant="primary" type="submit" form="edit-form">
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}


export function VehicleEdit({ setRecord, onSubmit, record, showEdit, handleEditClose }) {

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
        <Modal show={showEdit} onHide={handleEditClose} centered>
            {console.log(locations)}
            <Modal.Header closeButton>
                <Modal.Title>Edit Vehicle Record</Modal.Title>
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
                <Button variant="secondary" onClick={handleEditClose}>
                    Close
                </Button>
                <Button variant="primary" type="submit" form="edit-form">
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}



export function EditRow({ saleCustomers, entityName, recordToEdit, showEdit, handleEditClose, loadEntity }) {

    const [record, setRecord] = useState(recordToEdit)

    // on each render/change of recordToEdit set the record state variable
    useEffect(() => { 
        setRecord(recordToEdit)
    }, [recordToEdit])

    async function onSubmit(event) {
        event.preventDefault()
        let values = Object.assign({}, record)
        delete values.id
        Object.keys(values).forEach(k => values[k] = formatValue(values[k]))
        // update the 
        let resp = await fetch(`http://flip1.engr.oregonstate.edu:39182/${entityName}/${record.id}`, {
            mode: 'cors',
            method: 'PUT',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if(resp.status === 200){
            loadEntity()
            handleEditClose()
        } else {
            alert(`Failed to update ${record.id}. ${resp}`)
            loadEntity()
            handleEditClose()
        }
    }

    switch (entityName) {
        case 'Employees':
            return (
                <EmployeeEdit 
                    setRecord={setRecord} 
                    onSubmit={onSubmit} 
                    record={record} 
                    showEdit={showEdit} 
                    handleEditClose={handleEditClose}
                ></EmployeeEdit>
            )
        case 'Sales':
            return (
                <SaleEdit 
                    setRecord={setRecord} 
                    onSubmit={onSubmit} 
                    record={record} 
                    showEdit={showEdit} 
                    handleEditClose={handleEditClose}
                    saleCustomers={saleCustomers}
                ></SaleEdit>
            )
        case 'Vehicles':
            return (
                <VehicleEdit 
                    setRecord={setRecord} 
                    onSubmit={onSubmit} 
                    record={record} 
                    showEdit={showEdit} 
                    handleEditClose={handleEditClose}
                ></VehicleEdit>
            )  
        default:
            return (
                <Modal show={showEdit} onHide={handleEditClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {entityName} Record</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="edit-form" onSubmit={(e) => onSubmit(e)}>
                            {Object.keys(record).map(k => {
                                if (k !== 'id') {
                                    return (
                                        <Form.Group key={k} className="mb-3">
                                            <Form.Label>{k}</Form.Label>
                                            <Form.Control 
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
                                } else {
                                    return null
                                }
                            })}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleEditClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit" form="edit-form">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            )
        }
}