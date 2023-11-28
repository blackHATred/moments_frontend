import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from "../userContext";
import {useNavigate} from "react-router-dom";
import {
    Button,
    Card,
    CardBody,
    CardSubtitle,
    CardTitle,
    Container,
    FloatingLabel,
    Form,
    Placeholder
} from "react-bootstrap";


function Login() {
    let {user, centrifugo} = useContext(UserContext);
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        login: "",
        password: ""
    });
    const [loginError, setLoginError] = useState({
        loginError: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // если пользователь уже авторизован, то перебрасываем его на фид
        if (user !== null && user !== undefined)
            navigate("/feed");
    });


    function auth(login, password){
        setLoading(true);
        fetch(`${process.env.REACT_APP_BACKEND_HOST}/user/login?`+ new URLSearchParams({login: login, password: password}), {method: "POST", headers: {'Accept': 'application/json'}})
            .then(response => {
                if (response.ok)
                    return response.json();
            })
            .then(data => {
                user = data.token;
                // переадресуем на главную страницу, чтобы там получить токен центрифуги и перекинуться на фид
                navigate("/");
            })
            .catch(error => {
                setLoginError({loginError: "Пользователь с такими данными не найден"});
                setLoading(false);
            })
    }

    return (
        <>
            <Container
                className={"d-flex flex-column justify-content-center align-items-center"}
                style={{minHeight: "100vh"}}>
                <Card className={"shadow-sm"} style={{maxWidth: "20em", minWidth: "20em"}}>
                    <CardBody className={"text-center"}>
                        <CardTitle>Авторизация</CardTitle>
                        <CardSubtitle>Добро пожаловать!</CardSubtitle>
                        <Form>
                            <Form.Text className={"text-danger"}>{loginError.loginError}</Form.Text>
                            <FloatingLabel label={"Логин"}>
                                <Form.Control onChange={(e) => {e.target.value = e.target.value.trim(); loginData.login = e.target.value;}} type={"text"} placeholder={"Логин"} style={{marginTop: "8px", marginBottom: "8px"}}></Form.Control>
                            </FloatingLabel>
                            <FloatingLabel label={"Пароль"}>
                                <Form.Control onChange={(e) => {e.target.value = e.target.value.trim(); loginData.password = e.target.value;}} type={"password"} placeholder={"Пароль"} style={{marginTop: "8px", marginBottom: "8px"}}></Form.Control>
                            </FloatingLabel>
                            {loading ?
                                <Placeholder.Button variant={"primary"}>Войти</Placeholder.Button>
                                :
                                <Button variant="primary" onClick={() => {
                                    auth(loginData.login, loginData.password);
                                }}>Войти</Button>
                            }
                        </Form>
                        <Button variant={"link"} onClick={() => {navigate("/register")}}>Нет аккаунта?</Button>
                    </CardBody>
                </Card>
            </Container>
        </>
    );
}

export default Login;