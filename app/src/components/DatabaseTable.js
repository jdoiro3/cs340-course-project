import Row from './Row'
import Table from 'react-bootstrap/Table'
import './DatabaseTable.css'


function DatabaseTable({ 
    entity, setEntity, loadEntity, handleEditShow, setRecordToEdit, 
    setSaleCustomers, hasCrud, hasFilter
}) {
    
    return (
        <div>
            <Table className="table" striped bordered hover>
                <thead>
                    <tr>
                        {entity.columns.map((col, i) => <th key={i}>{col}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {entity.data.map((r, i) =>
                        <Row 
                            entityName={entity.name} 
                            columns={entity.columns} 
                            entityInstance={r} key={i} 
                            handleEditShow={handleEditShow} 
                            setRecordToEdit={setRecordToEdit} 
                            loadEntity={loadEntity} 
                            setSaleCustomers={setSaleCustomers}
                            hasEditDelete={hasCrud}
                        />
                        )}
                </tbody>
            </Table>
        </div>
    )
}

export default DatabaseTable;