import { BsPencilSquare } from 'react-icons/bs'
import { MdDeleteOutline } from 'react-icons/md'
import Button from 'react-bootstrap/Button'

function Row({ entityInstance, columns, handleShow, onDelete, setRecordToEdit }) {

    const onEdit = (entityInstance) => {
        setRecordToEdit(entityInstance)
        handleShow()
    }

    return (
        <tr key={entityInstance.id}>
            {columns.map((col, i) => <td key={i}>{entityInstance[col]}</td>)}
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