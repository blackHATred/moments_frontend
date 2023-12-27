import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import MomentContainer from "../containers/moment";
import Comments from "../containers/comments";
import {UserContext} from "../userContext";


const Feed = () => {
    const {user} = useContext(UserContext);
    const [lastMoment, setLastMoment] = useState(0);
    const [moments] = useState([]);
    const [endReached, setEndReached] = useState(false);

    async function getMoments() {
        let res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/moment/feed?` + new URLSearchParams({
            token: user,
            last_moment: lastMoment
        }), {
            method: "GET",
            headers: {'Accept': 'application/json'}
        });
        if (res.ok) {
            res = await res.json();
            if (res["moments"].length < 10)
                setEndReached(true);
            if (res["moments"].length > 0) {
                setLastMoment(res["moments"][res.length - 1]);
                moments.push(...res["moments"])
            }
        } else {
            setEndReached(true);
        }
    }

    useEffect(() => {
        getMoments().then(() => {
        });
    }, []);

    return (
        <Container style={{marginTop: "12px", marginBottom: "12px"}}>
            <Row className="gy-2 justify-content-center">
                {moments.map(elem => (
                    <Row key={elem} className="gy-2 justify-content-center">
                        <MomentContainer momentId={elem}></MomentContainer>
                        <Comments momentId={elem}></Comments>
                    </Row>
                ))}
                <Col xs={8} className="text-center">
                    {endReached && <h2>Кажется, это всё. Подпишитесь на кого-то, чтобы видеть больше моментов</h2>}
                    {!endReached && <Button variant="light" onClick={async () => {
                        await getMoments();
                    }}>Показать больше</Button>}
                </Col>
            </Row>
        </Container>
    );
}

export default Feed;