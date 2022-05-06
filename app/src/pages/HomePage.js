import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import { useNavigate } from 'react-router-dom'

function HomePage({ entities }) {

    const navigate = useNavigate()

    return (
        <div className="container">
            <div className="table-container">
                <Row xs={1} md={4} className="g-4">
                    {entities.map((e, i) => (
                        <Col key={i}>
                        <Card key={e}>
                            <Card.Header>{e.name}</Card.Header>
                            <Card.Body>
                                <ListGroup>
                                    {e.columns.map((c, i) => {
                                        return <ListGroup.Item key={c}>{c}</ListGroup.Item>
                                    })}
                                </ListGroup>
                            </Card.Body>
                            <Card.Footer>
                                <Button onClick={() => navigate(`/${e.name.toLowerCase()}`)} variant="primary">View Table</Button>
                            </Card.Footer>
                        </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    )
}

export default HomePage