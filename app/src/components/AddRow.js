import { useState, useEffect, React } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select'
import { getCustomerOptions } from '../util/customers'
import { getSaleOptions } from '../util/sales'

function AddRow({ entity, showAdd, handleAddClose, customerOptions }) {

    let initialRecord = {}
    entity.columns.forEach(c => initialRecord[c] = "")

    const [record, setRecord] = useState(initialRecord)
    // on each render/change of recordToEdit set the record state variable
    useEffect(() => { setRecord(record)}, [record] )

    return (
        <Modal show={showAdd} onHide={handleAddClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add {entity.name} Entity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {Object.keys(record).map(k =>
                        <Form.Group key={k} className="mb-3">
                            <Form.Label>{k}</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={record[k]}
                                onChange={e => {
                                    let newRecord = {...record}
                                    newRecord[k] = e.target.value
                                    setRecord(newRecord)
                                }} 
                                autoFocus
                            />
                        </Form.Group>
                    )}
                    {
                        entity.name === "Sales" &&
                        <Form.Group key={Object.keys(record).length + 1} className="mb-3">
                            <Form.Label>Customers</Form.Label>
                            <Select
                                defaultValue={[]}
                                isMulti
                                name="colors"
                                options={customerOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        </Form.Group>
                    }
                    {
                        entity.name === "Customers" &&
                        <Form.Group key={Object.keys(record).length + 1} className="mb-3">
                            <Form.Label>Sales</Form.Label>
                            <Select
                                defaultValue={[]}
                                isMulti
                                name="colors"
                                options={[] /*getSaleOptions(entities)*/}
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        </Form.Group>
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleAddClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleAddClose}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddRow