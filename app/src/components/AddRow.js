import { useState, useEffect, React } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

function AddRow({ entity, showAdd, handleAddClose }) {

    let initialRecord = {}
    entity.columns.forEach(c => initialRecord[c] = "")
    const [record, setRecord] = useState(initialRecord)
    // on each render/change of recordToEdit set the record state variable
    useEffect(() => { setRecord(initialRecord)}, [initialRecord] )

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