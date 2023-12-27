import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import MomentContainer from "../containers/moment";
import Comments from "../containers/comments";

function Search() {
    const {searchString} = useParams();
    const [moments] = useState([]);
    const [lastMoment, setLastMoment] = useState(0);
    const [possibleUser, setPossibleUser] = useState(-1);
    const [endReached, setEndReached] = useState(false);

    async function search() {
        let res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/moment/search?` + new URLSearchParams({
            phrase: searchString,
            last_moment: lastMoment
        }), {
            method: "GET",
            headers: {'Accept': 'application/json'}
        });
        if (res.ok) {
            res = await res.json();
            if (res["user"] !== null)
                setPossibleUser(res["user"]);
            if (res["moments"].length < 10)
                setEndReached(true);
            if (res["moments"].length > 0) {
                setLastMoment(res[res.length - 1]);
                moments.push(...res["moments"]);
            }

        }
    }

    useEffect(() => {
        search().then(() => {
        });
    }, []);


    return (
        <Container style={{marginTop: "12px", marginBottom: "12px"}}>
            <Row className="gy-2 justify-content-center">
                <Col md={6}>
                    <h1 className="text-center">Результаты поиска</h1>
                </Col>
            </Row>
            <Row className="gy-2 justify-content-center">
                <Col md={6}>
                    {endReached && lastMoment === 0 && <h5 className="text-center text-muted">Ничего не найдено</h5>}
                    {possibleUser !== -1 &&
                        <h5 className="text-center text-muted">Возможно, вы искали <Link to={`/user/${possibleUser}`}>этого
                            пользователя</Link>?</h5>}
                </Col>
            </Row>
            <Row className="gy-2 justify-content-center">
                {moments.map(elem => (
                    <>
                        <MomentContainer key={elem} momentId={elem}></MomentContainer>
                        <Comments key={elem} momentId={elem}></Comments>
                    </>
                ))}
                {!endReached && <Button variant="light" onClick={async () => {
                    await search();
                }}>Показать больше</Button>}
            </Row>
        </Container>
    );
}

export default Search;