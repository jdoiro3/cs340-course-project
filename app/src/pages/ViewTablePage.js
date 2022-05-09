import { useState, React } from 'react'
import { Link } from 'react-router-dom'
import DatabaseTable from '../components/DatabaseTable'
import EditRow from '../components/EditRow'
import AddRow from '../components/AddRow'
import { useNavigate } from 'react-router-dom'

function ViewTablePage({ entity, recordToDelete, setRecordToDelete }) {

    const [recordToEdit, setRecordToEdit] = useState([])

    // used for the edit modal/form
    const [showEdit, setEditShow] = useState(false)
    const handleEditClose = () => setEditShow(false)
    const handleEditShow = () => setEditShow(true)
    // used for the add modal/form
    const [showAdd, setAddShow] = useState(false)
    const handleAddClose = () => setAddShow(false)
    const handleAddShow = () => setAddShow(true)

    return (
        <>
            <h2>{entity.name} Table</h2>
            <div className="container">
                <div className="table-container">
                    <DatabaseTable entity={entity} handleEditShow={handleEditShow} handleAddShow={handleAddShow} setRecordToEdit={setRecordToEdit}></DatabaseTable>
                    <EditRow entityName={entity.name} recordToEdit={recordToEdit} showEdit={showEdit} handleEditClose={handleEditClose}></EditRow>
                    <AddRow entity={entity} showAdd={showAdd} handleAddClose={handleAddClose}></AddRow>
                </div>
            </div>
        </>
    );
}

export default ViewTablePage;