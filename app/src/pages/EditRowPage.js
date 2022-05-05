import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default function EditExercisePage({ exerciseToEdit }) {

    const [name, setName] = useState(exerciseToEdit.name)
    const [unit, setUnit] = useState(exerciseToEdit.unit)
    const [date, setDate] = useState(exerciseToEdit.date)
    const [reps, setReps] = useState(exerciseToEdit.reps)
    const [weight, setWeight] = useState(exerciseToEdit.weight)
    const navigate = useNavigate();

    async function editExercise() {
        const exercise = { name, unit, date, reps, weight }
        const resp = await fetch(`/exercises/${exerciseToEdit._id}`, {
            method: 'PUT',
            body: JSON.stringify(exercise),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (resp.status === 200) {
            alert("Successfully edited the exercise!")
        } else {
            alert(`Failed to edit the exercise, status code = ${resp.status}`)
        }
        navigate("/")
    }

    return (
        <div>
            <h1>Edit Exercise</h1>
            <div className="container">
                <Form className="Form">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Bench Press" 
                            value={name}
                            onChange={e => setName(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Unit</Form.Label>
                        <Form.Select aria-label="Default select example" value={unit} onChange={e => setUnit(e.target.value)}>
                            <option value="lbs">lbs</option>
                            <option value="kgs">kgs</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Date</Form.Label>
                        <Form.Control 
                            type="date"
                            placeholder="MM-DD-YYYY"
                            value={date}
                            onChange={e => setDate(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Reps</Form.Label>
                        <Form.Control 
                            type="number"
                            placeholder="0"
                            value={reps}
                            onChange={e => setReps(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Weight</Form.Label>
                        <Form.Control 
                            type="number"
                            placeholder="0"
                            value={weight}
                            onChange={e => setWeight(e.target.value)} 
                        />
                    </Form.Group>
                    <Button onClick={() => editExercise()} type="button" variant="primary">
                        Save
                    </Button>
                </Form>
            </div>
        </div>
    )
}