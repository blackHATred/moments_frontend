import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Container, Row, Stack} from "react-bootstrap";
import {UserContext} from "../userContext";


function Notifications() {
    const {user} = useContext(UserContext);
    const [notifications] = useState([]);
    const [lastNotification, setLastNotification] = useState(0);
    const [endReached, setEndReached] = useState(false);

    async function getNotifications(last_read = lastNotification) {
        let res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/notification/read?` + new URLSearchParams({
            token: user,
            last_read: last_read
        }), {
            method: "GET",
            headers: {'Accept': 'application/json'}
        });
        if (res.ok) {
            res = await res.json();
            if (res.length < 10)
                setEndReached(true);
            if (res.length > 0) {
                setLastNotification(res[res.length - 1][0]);
                notifications.push(...res);
            }
        }
    }

    useEffect(() => {
        getNotifications().then(r => {
        });
    }, []);

    return (
        <Container style={{marginTop: "12px", marginBottom: "12px"}}>
            <Row className="gy-2 justify-content-center">
                {
                    notifications.length === 0 ?
                        <Col md={6} className="d-flex justify-content-center align-items-center"
                             style={{minHeight: "80vh"}}>
                            <h1 className="text-center">Уведомлений нет</h1>
                        </Col>
                        :
                        <Col md={6} className="justify-content-center align-items-center">
                            <h1 className="text-center" style={{marginBottom: "16px"}}>Уведомления</h1>
                            <Stack gap={3}>
                                {notifications.length === 0 && <h1 className="text-center">Уведомлений нет</h1>}
                                {notifications.map(elem => (
                                    <>
                                        <hr style={{marginBottom: "0", marginTop: "0"}}/>
                                        <span key={elem[0]} dangerouslySetInnerHTML={{__html: elem[1]}}/>
                                    </>
                                ))}
                                {!endReached &&
                                    <Button variant="light" onClick={async () => {
                                        await getNotifications();
                                    }}>Показать больше</Button>
                                }
                            </Stack>
                        </Col>
                }
            </Row>
        </Container>
    );
}

export default Notifications;