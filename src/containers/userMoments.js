import React, {useEffect, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import MomentContainer from "./moment";
import Comments from "./comments";

function UserMoments({userId}) {

    const [lastMoment, setLastMoment] = useState(0);
    const [moments] = useState([]);
    const [endReached, setEndReached] = useState(false);

    async function getMoments() {
        let res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/moment/user_moments?` + new URLSearchParams({
            user_id: userId,
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
        <>
            {moments.map(elem => (
                <Row key={elem} className="gy-2 justify-content-center">
                    <MomentContainer momentId={elem}></MomentContainer>
                    <Comments momentId={elem}></Comments>
                </Row>
            ))}
            <Col xs={8} className="text-center">
                {endReached && lastMoment === 0 && <h2>Кажется, здесь моментов нет</h2>}
                {!endReached && <Button variant="light" onClick={async () => {
                    await getMoments();
                }}>Показать больше</Button>}
            </Col>
        </>
    );

}

export default UserMoments;