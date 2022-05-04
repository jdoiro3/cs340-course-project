import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import "./AddExercisePage.css"

export default function AddExercisePage() {

    const [name, setName] = useState('')
    const [unit, setUnit] = useState('lbs')
    const [date, setDate] = useState('')
    const [reps, setReps] = useState('')
    const [weight, setWeight] = useState('')
    const navigate = useNavigate();

    async function addExercise() {
        const newExercise = { name, unit, date, reps, weight }
        const resp = await fetch('/exercises', {
            method: 'POST',
            body: JSON.stringify(newExercise),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if(resp.status === 201){
            alert("Successfully added exercise!")
        } else {
            alert(`Failed to add movie, status code = ${resp.status}`)
        }
        navigate("/")
    }

    return (
        <div>
            <h1>Add Exercise</h1>
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
                    <Button onClick={() => addExercise()} type="button" variant="primary">
                        Add
                    </Button>
                </Form>
            </div>
        </div>
    )
}