import {Col, Container, Row} from "react-bootstrap";

function Notfound() {

    return (
        <Container style={{marginTop: "12px", marginBottom: "12px"}}>
            <Row className="gy-2 justify-content-center">
                <Col md={6} className="d-flex justify-content-center align-items-center" style={{minHeight: "100vh"}}>
                    <h1 className="text-center">Не найдено</h1>
                </Col>
            </Row>
        </Container>
    );
}

export default Notfound;