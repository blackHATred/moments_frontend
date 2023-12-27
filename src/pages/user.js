import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Container, Placeholder, Row, Stack} from "react-bootstrap";
import {UserContext} from "../userContext";
import {useNavigate, useParams} from "react-router-dom";
import UserMoments from "../containers/userMoments";
import {userRatingSvg, userRegDateSvg, userSubscribersSvg, userSubscribesSvg, userSubSvg, userUnsubSvg} from "../svgs";


function User() {
    const navigate = useNavigate();
    const {user_id} = useParams(); // это айди пользователя, чью страницу мы открываем
    const [userAvatar, setUserAvatar] = useState("");
    const {user, userId} = useContext(UserContext);
    const [userInfo, setUserInfo] = useState({
        id: 0,
        email: "",
        nickname: "",
        rating: 0,
        reg_date: 0,
        followers: 0,
        subscriptions: 0,
        subscribed: false
    });
    const [loading, setLoading] = useState(true);


    async function getUserInfo(id = user_id) {
        setUserAvatar(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/user/avatar?` + new URLSearchParams({user_id: id}));
        const res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/user/user_info?` + new URLSearchParams({
            token: user,
            user_id: id
        }), {
            method: "GET",
            headers: {'Accept': 'application/json'}
        });
        if (!res.ok)
            navigate("/not_found");
        const res_json = await res.json();
        setUserInfo(res_json);
    }

    async function subscribe(id = user_id) {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/subscription/subscribe?` + new URLSearchParams({
            token: user,
            author_id: id
        }), {
            method: "POST",
            headers: {'Accept': 'application/json'}
        });
        if (res.ok)
            setUserInfo({...userInfo, subscribed: true});
        setLoading(false);
    }

    async function unsubscribe(id = user_id) {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/subscription/unsubscribe?` + new URLSearchParams({
            token: user,
            author_id: id
        }), {
            method: "POST",
            headers: {'Accept': 'application/json'}
        });
        if (res.ok)
            setUserInfo({...userInfo, subscribed: false});
        setLoading(false);
    }

    useEffect(() => {
        if (user_id === userId)
            navigate("/me");
        getUserInfo(user_id).then(() => {
        });
        setLoading(false);
    }, []);

    return (
        <Container style={{marginTop: "12px", marginBottom: "12px"}}>
            <Row className="gy-2 justify-content-center">
                <Col md={10}>
                    <Row className="g-0 shadow-sm" style={{
                        background: "var(--bs-white)",
                        borderRadius: "16px",
                        boxShadow: "0px 0px 6px var(--bs-border-color-translucent)",
                        padding: "16px"
                    }}>
                        <Col md={4} xl={3} className="d-flex justify-content-center align-items-center"
                             style={{aspectRatio: "1/1"}}>
                            <img src={userAvatar} className="rounded-circle"
                                 style={{aspectRatio: "1/1", objectFit: "cover", width: "100%"}} alt="Аватарка"/>
                        </Col>
                        <Col className="d-flex flex-column justify-content-center" style={{padding: "16px"}}>
                            <h1>@{userInfo.nickname}</h1>
                            <p>
                                {userRegDateSvg}
                                &nbsp;Зарегистрирован: {(new Date(userInfo.reg_date)).toLocaleString()}
                                <br/>
                                {userRatingSvg}
                                &nbsp;Рейтинг: {userInfo.rating}
                                <br/>
                                {userSubscribesSvg}
                                &nbsp;Подписок: {userInfo.subscriptions}
                                <br/>
                                {userSubscribersSvg}
                                &nbsp;Подписчиков: {userInfo.followers}
                            </p>
                            <Stack direction={"horizontal"} gap={2}>
                                {loading &&
                                    <Placeholder.Button>
                                        {userSubSvg}
                                        &nbsp;Подписаться
                                    </Placeholder.Button>
                                }
                                {!loading && !userInfo.subscribed &&
                                    <Button onClick={async () => {
                                        await subscribe();
                                    }}>
                                        {userSubSvg}
                                        &nbsp;Подписаться
                                    </Button>
                                }
                                {!loading && userInfo.subscribed &&
                                    <Button variant={"light"} onClick={async () => {
                                        await unsubscribe();
                                    }}>
                                        {userUnsubSvg}
                                        &nbsp;Отписаться
                                    </Button>
                                }
                            </Stack>
                        </Col>
                    </Row>
                </Col>
                <UserMoments userId={user_id}/>
            </Row>
        </Container>
    );
}

export default User;