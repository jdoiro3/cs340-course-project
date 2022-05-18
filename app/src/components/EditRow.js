import { useState, useEffect, React } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select'
import entities from '../temp-data'
import { formatValue, getSaleOptions, getCustomerSales } from '../util'

function EditRow({ entityName, recordToEdit, showEdit, handleEditClose, salesCustomers, customerOptions, loadEntity }) {

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
        const resp = await fetch(`http://flip1.engr.oregonstate.edu:39182/${entityName}/${record.id}`, {
            mode: 'cors',
            method: 'PUT',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if(resp.status === 200){
            alert(`Successfully edited ${record.id}!`)
            loadEntity()
            handleEditClose()
        } else {
            alert(`Failed to add movie, status code = ${resp.status}`)
            loadEntity()
            handleEditClose()
        }
    }

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
                <Button variant="primary" type="submit" form="edit-form">
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditRow