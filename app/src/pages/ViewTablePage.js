import { useState, React, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DatabaseTable from '../components/DatabaseTable'
import EditRow from '../components/EditRow'
import AddRow from '../components/AddRow'
import { Audio } from  'react-loader-spinner'
import { getCustomerOptions } from '../util/customers'

function ViewTablePage({ entityName, recordToDelete, setRecordToDelete }) {

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
    // used for sales edit row
    const [salesCustomers, setSaleCustomers] = useState([])
    const [customerOptions, setCustomerOptions] = useState([])

    async function loadCustomerOptions() {
        let customers = await getCustomerOptions()
        setCustomerOptions(customers)
    }

    async function loadEntity() {
        let resp = await fetch(`http://flip1.engr.oregonstate.edu:39182/${entityName}`, {mode: 'cors'})
        let entity = await resp.json()
        setEntity(entity)
    }

    useEffect(() => {
        setEntity(undefined)
        loadEntity()
    }, [entityName])

    useEffect(()=> {
        if (entityName === "Sales") {
            loadCustomerOptions()
        }
    }, [])

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
                        <DatabaseTable 
                            entity={entity} 
                            setEntity={setEntity}
                            onDelete={onDelete} 
                            handleEditShow={handleEditShow} 
                            handleAddShow={handleAddShow} 
                            setRecordToEdit={setRecordToEdit}
                            setSaleCustomers={setSaleCustomers}
                        ></DatabaseTable>
                        <EditRow 
                            entityName={entityName} 
                            recordToEdit={recordToEdit} 
                            salesCustomers={salesCustomers}
                            customerOptions={customerOptions}
                            showEdit={showEdit} 
                            handleEditClose={handleEditClose}
                        ></EditRow>
                        <AddRow 
                            entity={entity} 
                            showAdd={showAdd} 
                            handleAddClose={handleAddClose}
                            customerOptions={customerOptions}
                        ></AddRow>
                    </div>
                </div>
            </>
        )
    }
}

export default ViewTablePage;