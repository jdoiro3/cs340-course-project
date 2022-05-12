import { useState, useEffect, React } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select'
import { getCustomerOptions, getSaleCustomers } from '../util/customers'
import { getSaleOptions, getCustomerSales } from '../util/sales'
import entities from '../util/temp-data'

function EditRow({ entityName, recordToEdit, showEdit, handleEditClose, salesCustomers, customerOptions }) {

    const [record, setRecord] = useState(recordToEdit)

    // on each render/change of recordToEdit set the record state variable
    useEffect(() => { 
        setRecord(recordToEdit)
    }, [recordToEdit])

    return (
        <Modal show={showEdit} onHide={handleEditClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit {entityName} Entity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {Object.keys(record).map(k => {
                        if (k !== 'id') {
                            return (
                                <Form.Group key={k} className="mb-3">
                                    <Form.Label>{k}</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={record[k] === null ? "": record[k]}
                                        onChange={e => {
                                            let newRecord = {...record}
                                            newRecord[k] = e.target.value
                                            setRecord(newRecord)
                                        }} 
                                        autoFocus
                                    />
                                </Form.Group>
                        )}
                    })}
                    {
                        entityName === "Sales" &&
                        <Form.Group key={Object.keys(record).length + 1} className="mb-3">
                            <Form.Label>Customers</Form.Label>
                            <Select
                                defaultValue={() => salesCustomers}
                                isMulti
                                name="colors"
                                options={customerOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        </Form.Group>
                    }
                    {
                        entityName === "Customers" &&
                        <Form.Group key={Object.keys(record).length + 1} className="mb-3">
                            <Form.Label>Sales</Form.Label>
                            <Select
                                defaultValue={() => getCustomerSales(entities, recordToEdit.id)}
                                isMulti
                                name="colors"
                                options={getSaleOptions(entities)}
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        </Form.Group>
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleEditClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleEditClose}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditRow