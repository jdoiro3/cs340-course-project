import { BsPencilSquare } from 'react-icons/bs'
import { MdDeleteOutline } from 'react-icons/md'
import Button from 'react-bootstrap/Button'
import { formatValue, getSaleCustomers } from '../util'

function Row({ setSaleCustomers, entityName, entityInstance, columns, handleEditShow, loadEntity, setRecordToEdit }) {

    async function onEdit(entityInstance) {
        setRecordToEdit(entityInstance)
        if (entityName === "Sales") {
            let customers = await getSaleCustomers(entityInstance.id)
            setSaleCustomers(customers)
        }
        handleEditShow()
    }

    async function onDelete(entityInstance) {
        let confirmed = window.confirm(`Are you sure you want to delete ${entityInstance.id}?`)
        if (!confirmed) {
            alert("Not deleted")
            return
        } else {
            let resp = await fetch(`http://flip1.engr.oregonstate.edu:39182/${entityName}/${entityInstance.id}`, {
                mode: 'cors',
                method: 'DELETE'
            })
            if (resp.status === 200) {
                loadEntity()
            } else {
                alert(`Failed to delete ${entityInstance.id}`)
            }
        }
    }

    
    return (
        <tr key={entityInstance.id}>
            {columns.map((col, i) => <td key={i}>{formatValue(entityInstance[col])}</td>)}
            <td>
                <Button variant="primary" onClick={() => onEdit(entityInstance)} ><BsPencilSquare /></Button>
            </td>
            <td>
                <Button variant="danger" onClick={() => onDelete(entityInstance)} ><MdDeleteOutline /></Button>
            </td>
        </tr>
    )
}

export default Row