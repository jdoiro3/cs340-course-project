import { useState, React } from 'react'
import { Link } from 'react-router-dom'
import DatabaseTable from '../components/DatabaseTable'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import './ViewTablePage.css'

function ViewTablePage({ entity, recordToEdit, setRecordToEdit, recordToDelete, setRecordToDelete }) {

    const navigate = useNavigate()

    const [showEdit, setEditShow] = useState(false)
    const handleEditClose = () => setEditShow(false)
    const handleEditShow = () => setEditShow(true)

    const [showAdd, setAddShow] = useState(false)
    const handleAddClose = () => setAddShow(false)
    const handleAddShow = () => setAddShow(true)

    return (
        <>
            <h2>{entity.name} Table</h2>
            <div className="container">
                <div className="table-container">
                    <DatabaseTable entity={entity} handleEditShow={handleEditShow} handleAddShow={handleAddShow} setRecordToEdit={setRecordToEdit}></DatabaseTable>
                    <Modal show={showEdit} onHide={handleEditClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit {entity.name} Entity</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                {Object.keys(recordToEdit).map(k =>
                                    <Form.Group key={k} className="mb-3">
                                        <Form.Label>{k}</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={recordToEdit[k]}
                                            onChange={e => console.log(e)} 
                                            autoFocus
                                        />
                                    </Form.Group>
                                )}
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
                    <Modal show={showAdd} onHide={handleAddClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Add {entity.name} Entity</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                {entity.columns.map((c, i) =>
                                    <Form.Group key={c} className="mb-3">
                                        <Form.Label>{c}</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value=""
                                            onChange={e => console.log(e)} 
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
                </div>
            </div>
        </>
    );
}

export default ViewTablePage;