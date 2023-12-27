import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Container, Form, Modal, Placeholder, Row, Stack, Tab, Tabs} from "react-bootstrap";
import {UserContext} from "../userContext";
import {useNavigate} from "react-router-dom";
import UserMoments from "../containers/userMoments";
import {
    userEditProfileSvg,
    userPostMomentSvg,
    userRatingSvg,
    userRegDateSvg,
    userSubscribersSvg,
    userSubscribesSvg
} from "../svgs";


function Me() {
    const navigate = useNavigate();
    const {user, setUser, setUserId, userId, userAvatarLink, setUserAvatarLink} = useContext(UserContext);
    const [userInfo, setUserInfo] = useState({
        id: 0,
        email: "",
        nickname: "",
        rating: 0,
        reg_date: 0,
        followers: 0,
        subscriptions: 0
    });
    const [showNewPublication, setShowNewPublication] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    // навряд ли пользователю потребуется делать несколько вещей одновременно, поэтому loading будет один для всех кнопок в целях упрощения :)
    const [loading, setLoading] = useState(false);
    const [userInfoUpdate, setUserInfoUpdate] = useState({
        errorMessage: '',
        email: '',
        nickname: ''
    });
    const [userPasswordUpdate, setUserPasswordUpdate] = useState({
        errorMessage: '',
        currentPassword: '',
        newPassword: '',
        newPasswordRepeat: '',
    });
    const [userAvatarUpdate, setUserAvatarUpdate] = useState({
        errorMessage: '',
        file: null
    });
    const [momentPub, setMomentPub] = useState({
        errorMessage: '',
        title: '',
        description: '',
        file: null
    });

    async function getMeUser() {
        // получить информацию о себе
        setUserAvatarLink(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/user/avatar?` + new URLSearchParams({user_id: userId}));
        const res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/user/my_info?` + new URLSearchParams({token: user}), {
            method: "GET",
            headers: {'Accept': 'application/json'}
        });
        const res_json = await res.json();
        setUserInfo(res_json);
        setUserInfoUpdate({errorMessage: '', email: res_json.email, nickname: res_json.nickname});
    }

    async function updateUserInfo() {
        // обновить информацию о себе
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/user/update_info?` + new URLSearchParams({
            token: user,
            email: userInfoUpdate.email,
            nickname: userInfoUpdate.nickname
        }), {
            method: "PUT",
            headers: {'Accept': 'application/json'}
        });
        const res_json = await res.json();
        if (res.status !== 200)
            setUserInfoUpdate({...userInfoUpdate, errorMessage: res_json["detail"]});
        else {
            setUserInfoUpdate({...userInfoUpdate, errorMessage: ''});
            setUserInfo({...userInfo, email: res_json["new_email"], nickname: res_json["new_nickname"]})
        }
        setLoading(false);
    }

    async function updateUserPassword() {
        // обновить пароль
        if (userPasswordUpdate.newPassword.length < 1 && userPasswordUpdate.currentPassword.length < 1 && userPasswordUpdate.newPasswordRepeat.length < 1)
            return;
        setLoading(true);
        if (userPasswordUpdate.newPassword !== userPasswordUpdate.newPasswordRepeat) {
            setUserPasswordUpdate({...userPasswordUpdate, errorMessage: "Повторно введённый пароль не совпадает"});
        } else {
            const res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/user/update_password?` + new URLSearchParams({
                token: user,
                current_password: userPasswordUpdate.currentPassword,
                new_password: userPasswordUpdate.newPassword
            }), {
                method: "PUT",
                headers: {'Accept': 'application/json'}
            });
            const res_json = await res.json();
            if (res.status !== 200) {
                setUserPasswordUpdate({...userPasswordUpdate, errorMessage: res_json["detail"]});
            } else {
                setUser(null);
                setUserId(null);
                navigate("/login"); // сбросили пароль - нужно заново входить :)
            }
        }
        setLoading(false);
    }

    async function handleAvatarChange(event) {
        // хэндлер для добавления файла аватарки
        let fileInput = event.target;
        let file = fileInput.files[0];
        setUserAvatarUpdate({file: file, errorMessage: ''});
    }

    async function updateUserAvatar() {
        // обновить свою аватарку
        setLoading(true);
        let formData = new FormData();
        formData.append("file", userAvatarUpdate.file);
        const res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/user/update_avatar?` + new URLSearchParams({token: user}), {
            method: "PUT",
            headers: {'Accept': 'application/json'},
            body: formData
        });
        const res_json = await res.json();
        if (res.status !== 200) {
            setUserAvatarUpdate({...userAvatarUpdate, errorMessage: res_json["detail"]});
        } else {
            setUserAvatarUpdate({...userAvatarUpdate, errorMessage: ''});
        }
        await getMeUser();
        setLoading(false);
    }

    async function handlePostChange(event) {
        // хэндлер для добавления файла аватарки
        let fileInput = event.target;
        let file = fileInput.files[0];
        setMomentPub({...momentPub, file: file});
    }

    async function pubPost() {
        // опубликовать момент
        if (momentPub.title.length < 1 && momentPub.description.length < 1 && momentPub.file == null)
            return;
        setLoading(true);
        let formData = new FormData();
        formData.append("file", momentPub.file);
        const res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/moment/create?` + new URLSearchParams({
            token: user,
            title: momentPub.title,
            description: momentPub.description
        }), {
            method: "POST",
            headers: {'Accept': 'application/json'},
            body: formData
        });
        const res_json = await res.json();
        if (res.status !== 200) {
            setUserAvatarUpdate({...momentPub, errorMessage: res_json["detail"]});
        } else {
            setUserAvatarUpdate({errorMessage: '', title: '', description: '', file: null});
            // т.к. лента с моментами пользователя не обновится после этого действия, а отобразить новый пост нужно, то стоит перезагрузить страницу
            navigate(0);
        }
    }

    useEffect(() => {
        getMeUser().then(r => {
        });
    }, []);

    return (
        <>
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
                                <img src={userAvatarLink} className="rounded-circle"
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
                                    <Button onClick={() => {
                                        setShowNewPublication(true);
                                    }}>
                                        {userPostMomentSvg}
                                        &nbsp;Опубликовать момент
                                    </Button>
                                    <Button variant={"light"} onClick={() => {
                                        setShowEdit(true);
                                    }}>
                                        {userEditProfileSvg}
                                        &nbsp;Редактировать профиль
                                    </Button>
                                </Stack>
                                <Modal show={showNewPublication} onHide={() => {
                                    setShowNewPublication(false);
                                }}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Опубликовать Момент</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form className={"text-center"} onSubmit={e => {
                                            e.preventDefault();
                                        }}>
                                            <Form.FloatingLabel label={"Название момента"}>
                                                <Form.Control type="text"
                                                              style={{marginTop: "8px", marginBottom: "8px"}}
                                                              onChange={(e) => {
                                                                  momentPub.title = e.target.value.trim();
                                                              }} placeholder="Название момента"></Form.Control>
                                            </Form.FloatingLabel>
                                            <Form.FloatingLabel label={"Описание момента"}>
                                                <Form.Control as="textarea" type="text"
                                                              style={{marginTop: "8px", marginBottom: "8px"}}
                                                              onChange={(e) => {
                                                                  momentPub.description = e.target.value.trim();
                                                              }} placeholder="Описание момента"></Form.Control>
                                            </Form.FloatingLabel>
                                            <Form.Control
                                                style={{marginTop: "8px", marginBottom: "8px"}}
                                                type="file"
                                                required
                                                accept="image/*"
                                                name="file"
                                                onChange={handlePostChange}
                                            />
                                            {momentPub.errorMessage && <Form.Text
                                                className={"text-danger"}>{momentPub.errorMessage}</Form.Text>}
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="light" onClick={() => {
                                            setShowNewPublication(false);
                                        }}>
                                            Отмена
                                        </Button>
                                        {
                                            loading ?
                                                <Placeholder.Button
                                                    variant={"primary"}>Опубликовать</Placeholder.Button>
                                                :
                                                <Button onClick={pubPost}>Опубликовать</Button>
                                        }
                                    </Modal.Footer>
                                </Modal>
                                <Modal show={showEdit} onHide={() => {
                                    setShowEdit(false);
                                }}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Редактирование личных данных</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Tabs variant={"pills"} fill defaultActiveKey={"1"}>
                                            <Tab eventKey={"1"} title={"Личные данные"} style={{marginTop: "8px"}}>
                                                <Form className={"text-center"} onSubmit={e => {
                                                    e.preventDefault();
                                                }}>
                                                    <h4>Личные данные</h4>
                                                    {userInfoUpdate.errorMessage && <Form.Text
                                                        className={"text-danger"}>{userInfoUpdate.errorMessage}</Form.Text>}
                                                    <Form.FloatingLabel label={"Почта"}>
                                                        <Form.Control type={"email"}
                                                                      style={{marginTop: "8px", marginBottom: "8px"}}
                                                                      onChange={(e) => {
                                                                          userInfoUpdate.email = e.target.value.trim();
                                                                      }} placeholder={"Почта"}
                                                                      defaultValue={userInfo.email}></Form.Control>
                                                    </Form.FloatingLabel>
                                                    <Form.FloatingLabel label={"Никнейм"}>
                                                        <Form.Control type={"text"}
                                                                      style={{marginTop: "8px", marginBottom: "8px"}}
                                                                      onChange={(e) => {
                                                                          userInfoUpdate.nickname = e.target.value.trim();
                                                                      }} placeholder={"Никнейм"}
                                                                      defaultValue={userInfo.nickname}></Form.Control>
                                                    </Form.FloatingLabel>
                                                    {
                                                        loading ?
                                                            <Placeholder.Button
                                                                variant={"primary"}>Сохранить</Placeholder.Button>
                                                            :
                                                            <Button onClick={updateUserInfo}>Сохранить</Button>
                                                    }
                                                </Form>
                                            </Tab>
                                            <Tab eventKey={"2"} title={"Безопасность"} style={{marginTop: "8px"}}>
                                                <Form className={"text-center"} onSubmit={e => {
                                                    e.preventDefault();
                                                }}>
                                                    <h4>Обновление пароля</h4>
                                                    {userPasswordUpdate.errorMessage && <Form.Text
                                                        className={"text-danger"}>{userPasswordUpdate.errorMessage}</Form.Text>}
                                                    <Form.FloatingLabel label={"Текущий пароль"}>
                                                        <Form.Control type={"password"}
                                                                      style={{marginTop: "8px", marginBottom: "8px"}}
                                                                      onChange={(e) => {
                                                                          userPasswordUpdate.currentPassword = e.target.value.trim();
                                                                      }} placeholder={"Текущий пароль"}></Form.Control>
                                                    </Form.FloatingLabel>
                                                    <Form.FloatingLabel label={"Новый пароль"}>
                                                        <Form.Control type={"password"}
                                                                      style={{marginTop: "8px", marginBottom: "8px"}}
                                                                      onChange={(e) => {
                                                                          userPasswordUpdate.newPassword = e.target.value.trim();
                                                                      }} placeholder={"Новый пароль"}></Form.Control>
                                                    </Form.FloatingLabel>
                                                    <Form.FloatingLabel label={"Новый пароль ещё раз"}>
                                                        <Form.Control type={"password"}
                                                                      style={{marginTop: "8px", marginBottom: "8px"}}
                                                                      onChange={(e) => {
                                                                          userPasswordUpdate.newPasswordRepeat = e.target.value.trim();
                                                                      }} placeholder={"Новый пароль"}></Form.Control>
                                                    </Form.FloatingLabel>
                                                    {
                                                        loading ?
                                                            <Placeholder.Button
                                                                variant={"primary"}>Обновить</Placeholder.Button>
                                                            :
                                                            <Button onClick={updateUserPassword}>Обновить</Button>
                                                    }
                                                </Form>
                                            </Tab>
                                            <Tab eventKey={"3"} title={"Аватар профиля"} style={{marginTop: "8px"}}>
                                                <Form className={"text-center"} onSubmit={e => {
                                                    e.preventDefault();
                                                }}>
                                                    <h4>Загрузить новый аватар</h4>
                                                    {userAvatarUpdate.errorMessage && <Form.Text
                                                        className={"text-danger"}>{userAvatarUpdate.errorMessage}</Form.Text>}
                                                    <Form.Control
                                                        style={{marginTop: "8px", marginBottom: "8px"}}
                                                        type="file"
                                                        required
                                                        accept="image/*"
                                                        name="file"
                                                        onChange={handleAvatarChange}
                                                    />
                                                    {
                                                        loading ?
                                                            <Placeholder.Button
                                                                variant={"primary"}>Сохранить</Placeholder.Button>
                                                            :
                                                            <Button onClick={updateUserAvatar}>Сохранить</Button>
                                                    }
                                                </Form>
                                            </Tab>
                                        </Tabs>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="light" onClick={() => {
                                            setShowEdit(false);
                                        }}>
                                            Отмена
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </Col>
                        </Row>
                    </Col>
                    <UserMoments userId={userId}/>
                </Row>
            </Container>
        </>
    );
}

export default Me;