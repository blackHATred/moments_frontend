import {useParams} from "react-router-dom";
import {Container, Row} from "react-bootstrap";
import MomentContainer from "../containers/moment";
import Comments from "../containers/comments";


function Moment() {
    const {momentId} = useParams();

    return (
        <Container style={{marginTop: "12px", marginBottom: "12px"}}>
            <Row className="gy-2 justify-content-center">
                <MomentContainer momentId={momentId}></MomentContainer>
                <Comments momentId={momentId}></Comments>
            </Row>
        </Container>
    )
}

export default Moment;
