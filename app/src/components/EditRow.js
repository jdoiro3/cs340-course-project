import { useState, useEffect, React } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select'
import { formatValue } from '../util'

function EditRow({ entityName, recordToEdit, showEdit, handleEditClose, salesCustomers, customerOptions, loadEntity }) {

    const [record, setRecord] = useState(recordToEdit)
    const [selectedOptions, setSelectedOptions] = useState(entityName == "Sales" ? salesCustomers.map(c => c.id): [])

    // on each render/change of recordToEdit set the record state variable
    useEffect(() => { 
        setRecord(recordToEdit)
    }, [recordToEdit])

    function handleSelectChange(selected) {
        selected = selected.map(obj => obj.value)
        setSelectedOptions(selected)
    }

    async function onSubmit(event) {
        event.preventDefault()
        let values = Object.assign({}, record)
        delete values.id
        Object.keys(values).forEach(k => values[k] = formatValue(values[k]))
        if (entityName === "Sales") {
            values.saleCustomers = selectedOptions
        }
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
            console.log(values)
        } else {
            alert(`Failed to update ${record.id}. ${resp}`)
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
                                onChange={handleSelectChange}
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