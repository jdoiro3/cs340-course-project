import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import { useNavigate } from 'react-router-dom'
import { Audio } from  'react-loader-spinner'
import { useEffect, useState } from 'react'

function HomePage() {

    const navigate = useNavigate()

    const [entityColumns, setEntityColumns] = useState([])

    async function getEntityColumns() {
        let resp = await fetch('/tables/data', { only_columns: true })
        let entityColumns = await resp.json()
        setEntityColumns(entityColumns)
    }

    useEffect(() => {
        getEntityColumns()
    }, [])

    if (entityColumns.length === 0) {
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
            <div className="container">
            <div className="table-container">
                <Row xs={1} md={4} className="g-4">
                    {entityColumns.map((e, i) => (
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
                                <Button onClick={() => navigate(`/${e.name}`)} variant="primary">View Table</Button>
                            </Card.Footer>
                        </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    )
    }
}

export default HomePage