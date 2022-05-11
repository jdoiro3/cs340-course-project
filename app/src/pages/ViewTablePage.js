import { useState, React, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DatabaseTable from '../components/DatabaseTable'
import EditRow from '../components/EditRow'
import AddRow from '../components/AddRow'
import { Audio } from  'react-loader-spinner'

function ViewTablePage({ entityName, recordToDelete, setRecordToDelete }) {

    const [recordToEdit, setRecordToEdit] = useState({})
    // used for the edit modal/form
    const [showEdit, setEditShow] = useState(false)
    const handleEditClose = () => setEditShow(false)
    const handleEditShow = () => setEditShow(true)
    // used for the add modal/form
    const [showAdd, setAddShow] = useState(false)
    const handleAddClose = () => setAddShow(false)
    const handleAddShow = () => setAddShow(true)

    const [entity, setEntity] = useState()

    async function loadEntity() {
        let resp = await fetch(`${entityName}`)
        console.log(resp.text())
        let entity = await resp.json()
        setEntity(entity)
    }

    useEffect(() => {
        setEntity(undefined)
        loadEntity()
    }, [entityName])

    async function deleteRecord(record) {
        // deletes a record from the table
    }

    const onDelete = async (record) => {
        deleteRecord(record)
        loadEntity()
    }

    if (entity === undefined) {
        return (
            <div className="container">
                <Audio
                    height="100"
                    width="100"
                    color='grey'
                    ariaLabel='loading'
                />
            </div>
        )
    } else {
        return (
            <>
                <h2>{entityName} Table</h2>
                <div className="container">
                    <div className="table-container">
                        <DatabaseTable entity={entity} onDelete={onDelete} handleEditShow={handleEditShow} handleAddShow={handleAddShow} setRecordToEdit={setRecordToEdit}></DatabaseTable>
                        <EditRow entity={entity} recordToEdit={recordToEdit} showEdit={showEdit} handleEditClose={handleEditClose}></EditRow>
                        <AddRow entity={entity} showAdd={showAdd} handleAddClose={handleAddClose}></AddRow>
                    </div>
                </div>
            </>
        )
    }
}

export default ViewTablePage;