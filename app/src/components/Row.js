import { BsPencilSquare } from 'react-icons/bs'
import { MdDeleteOutline } from 'react-icons/md'
import Button from 'react-bootstrap/Button'

function Row({ entityInstance, onEdit, onDelete }) {

    return (
        <tr>
            {entityInstance.values.map((v, i) => <td>{v}</td>)}
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