import { useState, useEffect, React } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select'
import { formatValue } from '../util'

function AddRow({ entity, showAdd, handleAddClose, loadEntity, customerOptions }) {

    let initialRecord = {}
    entity.columns.forEach(c => initialRecord[c] = "")

    const [record, setRecord] = useState(initialRecord)
    const [selectedOptions, setSelectedOptions] = useState([])

    function handleSelectChange(selected) {
        selected = selected.map(obj => obj.value)
        setSelectedOptions(selected)
    }

    async function onSubmit(event) {
        event.preventDefault()
        let values = Object.assign({}, record)
        // IDs are handled by the DB
        delete values.id
        // format the values to be inserted into the database
        Object.keys(values).forEach(k => values[k] = formatValue(values[k]))
        // we need to also pass customers the user selected that belong to the sale
        if (entity.name === "Sales") {
            values.saleCustomers = selectedOptions
        }
        let resp = await fetch(`http://flip1.engr.oregonstate.edu:39182/${entity.name}`, {
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (resp.status === 200) {
            loadEntity()
            handleAddClose()
        } else {
            alert(`Failed to add record. ${resp}`)
            handleAddClose()
        }
    }

    return (
        <Modal show={showAdd} onHide={handleAddClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add {entity.name} Record</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="add-form" onSubmit={(e) => onSubmit(e)}>
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
                                onChange={handleSelectChange}
                            />
                        </Form.Group>
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleAddClose}>
                    Close
                </Button>
                <Button variant="primary" type="submit" form="add-form">
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddRow