import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from "../userContext";
import {useNavigate} from "react-router-dom";
import {Button, Card, CardBody, CardTitle, Container, FloatingLabel, Form, Placeholder} from "react-bootstrap";


function Register() {
    let {user} = useContext(UserContext);
    const navigate = useNavigate();
    const [registerData] = useState({
        nickname: "",
        email: "",
        password: "",
        repeat_password: ""
    });
    const [registerError, setRegisterError] = useState({
        registerError: ""
    });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        // если пользователь уже авторизован, то перебрасываем его на фид
        if (user !== undefined)
            navigate("/");
    });

    function auth(nickname, email, password, repeat_password) {
        setLoading(true);
        if (password !== repeat_password) {
            setRegisterError({registerError: "Введённые пароли не совпадают"});
            setLoading(false);
            return;
        }
        fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/user/register?` + new URLSearchParams({
            nickname: nickname,
            email: email,
            password: password
        }), {method: "POST", headers: {'Accept': 'application/json'}})
            .then(async response => {
                if (response.ok)
                    // переадресуем на страницу входа
                    navigate("/login");
                if (response.statusCode !== 200) {
                    setRegisterError({registerError: (await response.json())["detail"]});
                    setLoading(false);
                }
            })
    }

    return (
        <>
            <Container
                className={"d-flex flex-column justify-content-center align-items-center"}
                style={{minHeight: "100vh"}}>
                <Card className={"shadow-sm"} style={{maxWidth: "20em", minWidth: "20em"}}>
                    <CardBody className={"text-center"}>
                        <CardTitle>Регистрация</CardTitle>
                        <Form>
                            <Form.Text className={"text-danger"}>{registerError.registerError}</Form.Text>
                            <FloatingLabel label={"Никнейм"}>
                                <Form.Control onChange={(e) => {
                                    registerData.nickname = e.target.value.trim();
                                }} type={"text"} placeholder={"Никнейм"}
                                              style={{marginTop: "8px", marginBottom: "8px"}}></Form.Control>
                            </FloatingLabel>
                            <FloatingLabel label={"Почта"}>
                                <Form.Control onChange={(e) => {
                                    registerData.email = e.target.value.trim();
                                }} type={"email"} placeholder={"Почта"}
                                              style={{marginTop: "8px", marginBottom: "8px"}}></Form.Control>
                            </FloatingLabel>
                            <FloatingLabel label={"Пароль"}>
                                <Form.Control onChange={(e) => {
                                    registerData.password = e.target.value.trim();
                                }} type={"password"} placeholder={"Пароль"}
                                              style={{marginTop: "8px", marginBottom: "8px"}}></Form.Control>
                            </FloatingLabel>
                            <FloatingLabel label={"Пароль ещё раз"}>
                                <Form.Control onChange={(e) => {
                                    registerData.repeat_password = e.target.value.trim();
                                }} type={"password"} placeholder={"Пароль"}
                                              style={{marginTop: "8px", marginBottom: "8px"}}></Form.Control>
                            </FloatingLabel>
                            {loading ?
                                <Placeholder.Button variant={"primary"}>Регистрация</Placeholder.Button>
                                :
                                <Button variant="primary" onClick={() => {
                                    auth(registerData.nickname, registerData.email, registerData.password, registerData.repeat_password);
                                }}>Регистрация</Button>
                            }
                        </Form>
                        <Button variant={"link"} onClick={() => {
                            navigate("/login");
                        }}>Уже есть аккаунт?</Button>
                    </CardBody>
                </Card>
            </Container>
        </>
    );
}

export default Register;