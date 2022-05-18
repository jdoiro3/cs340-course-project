import { useState, useEffect, React } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select'

function AddRow({ entity, showAdd, handleAddClose, loadEntity, customerOptions }) {

    let initialRecord = {}
    entity.columns.forEach(c => initialRecord[c] = "")

    const [record, setRecord] = useState(initialRecord)

    async function onSubmit(event) {
        event.preventDefault()

        let values = Object.assign({}, record)
        delete values.id

        // Object.keys(values).forEach(k => values[k] = formatValue(values[k]))
        // if (entityName === "Sales") {
        //     values.saleCustomers = selectedOptions
        // }

        let resp = await fetch(`http://flip1.engr.oregonstate.edu:39182/${entity.name}`, {
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (resp.status === 201) {
            loadEntity()
            handleAddClose()
            setRecord(initialRecord)
        } else {
            alert(`Failed to add record. ${resp}`)
            // loadEntity()
            // handleAddClose()
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
                <Button variant="primary" type="submit" form="add-form">
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddRow