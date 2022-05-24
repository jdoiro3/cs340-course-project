import { useState, useEffect, React } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import { SaleForm, VehicleForm, EmployeeForm } from './AddEditComponents'
import { formatValue } from '../util'


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
        // update the record
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
                <EmployeeForm 
                    title="Edit Employee Record"
                    setRecord={setRecord} 
                    onSubmit={onSubmit} 
                    record={record} 
                    showForm={showEdit} 
                    handleFormClose={handleEditClose}
                ></EmployeeForm>
            )
        case 'Sales':
            return (
                <SaleForm
                    title="Edit Sale Record"
                    setRecord={setRecord} 
                    onSubmit={onSubmit} 
                    record={record} 
                    showForm={showEdit} 
                    handleFormClose={handleEditClose}
                    saleCustomers={saleCustomers}
                ></SaleForm>
            )
        case 'Vehicles':
            return (
                <VehicleForm
                    title="Edit Vehicle Record"
                    setRecord={setRecord} 
                    onSubmit={onSubmit} 
                    record={record} 
                    showForm={showEdit} 
                    handleFormClose={handleEditClose}
                ></VehicleForm>
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