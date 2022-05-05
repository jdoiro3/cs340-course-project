import React from 'react'
import { Link } from 'react-router-dom'
import DatabaseTable from '../components/DatabaseTable'
import { useNavigate } from 'react-router-dom'
import './ViewTablePage.css'

function ViewTablePage({ entity, setRecordToEdit, recordToDelete, setRecordToDelete }) {

    const navigate = useNavigate()

    const onEdit = async (recordToEdit) => {
        setRecordToEdit(recordToEdit)
        navigate("/edit-exercise")
    }

    return (
        <>
            <h2>{entity.name} Table</h2>
            <div className="container">
                <div className="table-container">
                    <DatabaseTable entity={entity} onEdit={onEdit}></DatabaseTable>
                    <Link to="/add-exercise">Add a record</Link>
                </div>
            </div>
        </>
    );
}

export default ViewTablePage;