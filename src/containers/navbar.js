import React, {useContext, useEffect, useState} from 'react';
import {
    Badge,
    Button,
    Container,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItemText,
    DropdownMenu,
    DropdownToggle,
    Form,
    Image,
    InputGroup,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarToggle,
    NavItem,
    NavLink
} from "react-bootstrap";
import {Outlet, useNavigate} from "react-router-dom";
import {UserContext} from "../userContext";
import {Centrifuge} from 'centrifuge';
import {logoSvg, newNotificationsSvg, noNotificationsSvg, searchSvg} from "../svgs";


function NavbarContainer() {
    const {user, userId, userAvatarLink, setUserAvatarLink} = useContext(UserContext);
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [lastNotifications, setLastNotifications] = useState([]);
    const [readNotifications, setReadNotifications] = useState(true); // изначально будем считать, что уведомления прочитаны
    const centrifuge = new Centrifuge(`ws://${process.env.REACT_APP_CENTRIFUGO_HOST}/connection/websocket`, {data: {token: user}});
    let sub = centrifuge.getSubscription(`personal_notifications:${userId}`);
    if (sub == null) {
        sub = centrifuge.newSubscription(`personal_notifications:${userId}`);
    }

    async function updateAvatar() {
        if (userId !== null && userId !== undefined) {
            // обновляем аватарку
            setUserAvatarLink(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/user/avatar?` + new URLSearchParams({user_id: userId}));
        }
    }

    useEffect(() => {
        // обновляем только аватарку, не затрагивая остальной навбар
        updateAvatar().then(r => {
        });
    }, [userAvatarLink])

    useEffect(() => {
        console.log("Navbar mount");
        (async () => {
            if (userId !== null && userId !== undefined) {
                // обновляем аватарку
                updateAvatar().then(r => {
                });
                // подключаемся к центрифуге
                sub.on('publication', ctx => {
                    console.log("new notification");
                    lastNotifications.push(ctx.data.data);
                    setLastNotifications(lastNotifications.slice(-5)); // не держим более 5 уведов
                    // новый увед - показываем это
                    setReadNotifications(false);
                });
                sub.on('subscribed', async () => {
                    console.log("subscribed");
                })
                centrifuge.on('connected', ctx => {
                    console.log("Cent connected");
                    console.log(ctx);
                    for (const notify of ctx.data) {
                        lastNotifications.push(notify);
                        setLastNotifications(lastNotifications.slice(-5)); // не держим более 5 уведов
                        // новый увед, который получили за время отсутствия на сайте - показываем его
                        setReadNotifications(false);
                    }
                    sub.subscribe();
                });
                centrifuge.connect();
            }
        })();
    }, [userId]);

    async function readCentNotifications() {
        if (!readNotifications) {
            setReadNotifications(true);
            await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/notification/set_read?` + new URLSearchParams({token: user}), {
                method: "POST",
                headers: {'Accept': 'application/json'}
            });
        }
    }

    return (
        <>
            <Navbar expand={"md"} bg={"body"} className={"shadow-sm"} style={{padding: 0}}>
                <Container>
                    <NavbarBrand href={"#"} onClick={() => navigate("/")}>
                        {logoSvg}
                        <span style={{
                            fontFamily: "LOGOFONT, serif",
                            fontSize: "2.5em",
                            marginBottom: "100em"
                        }}>&nbsp;Moments</span>
                    </NavbarBrand>
                    <NavbarToggle aria-controls="navcol"/>
                    <NavbarCollapse id="navcol">
                        <Nav className={"mx-auto"}>
                            <NavItem>
                                <InputGroup>
                                    <Form.Control
                                        style={{
                                            width: "16em",
                                            borderBottomLeftRadius: "1em",
                                            borderTopLeftRadius: "1em"
                                        }}
                                        className={"bg-body-tertiary shadow-none"} placeholder={"Поиск..."}
                                        autoComplete={"off"} onChange={(e) => {
                                        setSearchText(e.target.value.trim())
                                    }}/>
                                    <Button variant={"outline-primary"} className={"shadow-none"} style={{
                                        borderStyle: "dashed",
                                        borderColor: "var(--bs-dark-border-subtle)",
                                        borderBottomRightRadius: "1em",
                                        borderTopRightRadius: "1em"
                                    }} onClick={() => {
                                        if (searchText.trim().length > 0) navigate(`/search/${searchText}`);
                                    }}>
                                        {searchSvg}
                                    </Button>
                                </InputGroup>
                            </NavItem>
                        </Nav>
                        <Nav>
                            <NavItem className={"d-flex align-items-center"}>
                                <Dropdown onClick={readCentNotifications}>
                                    <DropdownToggle variant={""} className={"shadow-none"}>
                                        <Badge pill={true} bg={readNotifications ? "white" : "primary"}
                                               text={readNotifications ? "primary" : "light"}>
                                            {readNotifications ? noNotificationsSvg : newNotificationsSvg}
                                        </Badge>
                                    </DropdownToggle>
                                    <DropdownMenu className={"text-center shadow-sm shadow-none"}
                                                  style={{maxWidth: "32em", minWidth: "16em"}} align={"end"}>
                                        {lastNotifications.length === 0 ?
                                            <DropdownHeader>Уведомлений нет</DropdownHeader>
                                            :
                                            lastNotifications.toReversed().map((item, index) => <DropdownItemText
                                                key={index} style={{fontSize: "1em"}}
                                                dangerouslySetInnerHTML={{__html: item}}></DropdownItemText>)
                                        }
                                        <DropdownDivider/>
                                        <DropdownItemText><Button variant={"link"} onClick={() => {
                                            navigate("/notifications");
                                        }}>Все уведомления</Button></DropdownItemText>
                                    </DropdownMenu>
                                </Dropdown>
                            </NavItem>
                            <NavItem>
                                <NavLink href={"#"} onClick={() => navigate("/me")}>
                                    <Image fluid={true} roundedCircle={true}
                                           style={{objectFit: "cover", aspectRatio: "1/1"}} width={48} height={48}
                                           src={userAvatarLink}></Image>
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </NavbarCollapse>
                </Container>
            </Navbar>
            <Outlet/>
        </>
    );
}

export default NavbarContainer;