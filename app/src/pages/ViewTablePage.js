import { useState, React, useEffect } from 'react'
import DatabaseTable from '../components/DatabaseTable'
import { EditRow } from '../components/EditRow'
import AddRow from '../components/AddRow'
import { Audio } from  'react-loader-spinner'
import Button from 'react-bootstrap/Button'


function ViewTablePage({ entityName }) {

    const [recordToEdit, setRecordToEdit] = useState({})
    const [entity, setEntity] = useState()
    // used for the edit modal/form
    const [showEdit, setEditShow] = useState(false)
    const handleEditClose = () => setEditShow(false)
    const handleEditShow = () => setEditShow(true)
    // used for the add modal/form
    const [showAdd, setAddShow] = useState(false)
    const handleAddClose = () => setAddShow(false)
    const handleAddShow = () => setAddShow(true)
    // used for setting a sales customers for EditRow and Row
    // Row sets the saleCustomers which is used within the EditRow component
    const [saleCustomers, setSaleCustomers] = useState([])

    async function loadEntity() {
        let resp = await fetch(`http://flip1.engr.oregonstate.edu:39182/${entityName}`, {mode: 'cors'})
        let entity = await resp.json()
        setEntity(entity)
    }

    useEffect(() => {
        async function loadEntity() {
            let resp = await fetch(`http://flip1.engr.oregonstate.edu:39182/${entityName}`, {mode: 'cors'})
            let entity = await resp.json()
            setEntity(entity)
        }
        setEntity(undefined)
        loadEntity()
    }, [entityName])

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
                <h2>{entityName}</h2>
                <div className="container">
                    <div className="table-container">
                        <DatabaseTable 
                            entity={entity} 
                            setEntity={setEntity}
                            loadEntity={loadEntity} 
                            handleEditShow={handleEditShow} 
                            setRecordToEdit={setRecordToEdit}
                            setSaleCustomers={setSaleCustomers}
                        ></DatabaseTable>
                        <div className="container">
                            <div className="add-edit-buttons">
                                <Button variant="primary" onClick={() => handleAddShow()}>Add {entity.name} Record</Button>
                                {
                                    entityName === "Customers" &&
                                    <Button onClick={loadEntity} variant="primary">Clear Filters</Button>
                                }
                            </div>
                        </div>
                        <EditRow 
                            entityName={entityName} 
                            recordToEdit={recordToEdit} 
                            showEdit={showEdit} 
                            handleEditClose={handleEditClose}
                            loadEntity={loadEntity}
                            saleCustomers={saleCustomers}
                        ></EditRow>
                        <AddRow 
                            entity={entity} 
                            showAdd={showAdd} 
                            handleAddClose={handleAddClose}
                            loadEntity={loadEntity}
                        ></AddRow>
                    </div>
                </div>
            </>
        )
    }
}

export default ViewTablePage;