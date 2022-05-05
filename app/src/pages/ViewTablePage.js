import { useState, React } from 'react'
import { Link } from 'react-router-dom'
import DatabaseTable from '../components/DatabaseTable'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import './ViewTablePage.css'

function ViewTablePage({ entity, recordToEdit, setRecordToEdit, recordToDelete, setRecordToDelete }) {

    const navigate = useNavigate()

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <h2>{entity.name} Table</h2>
            <div className="container">
                <div className="table-container">
                    <DatabaseTable entity={entity} handleShow={handleShow} setRecordToEdit={setRecordToEdit}></DatabaseTable>
                    <Link to={`/add/${entity.name}`}>Add {entity.name}</Link>
                    <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit {entity.name} Entity</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Editing {recordToEdit.id}
                            {JSON.stringify(recordToEdit)}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleClose}>
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