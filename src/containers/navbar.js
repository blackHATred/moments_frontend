import React, {useContext, useEffect, useState} from 'react';
import {
    Badge,
    Button,
    Container, Dropdown, DropdownButton, DropdownHeader, DropdownItem, DropdownItemText, DropdownMenu, Form,
    InputGroup,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarToggle, NavDropdown,
    NavItem
} from "react-bootstrap";
import {useNavigate} from "react-router-dom";


function NBar(){
    const navigate = useNavigate();

    // здесь будет какой-то код для работы с centrifugo

    return (
        <Navbar expand={"md"} bg={"body"} className={"shadow-sm"}>
            <Container>
                <NavbarBrand onClick={()=>{navigate("/feed");}}>
                    {/* заменить шрифт на фирменный */}
                    <svg style={{width: "1em", height: "1em", fontSize: "1.5em", marginBottom: "0.3em", strokeWidth: 2, stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <line x1="15" y1="8" x2="15.01" y2="8"></line>
                        <rect x="4" y="4" width="16" height="16" rx="3"></rect>
                        <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5"></path>
                        <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2"></path>
                    </svg>
                    <span style={{fontFamily: "sans-serif", fontSize: "1.5em"}}>&nbsp;Moments</span>
                </NavbarBrand>
                <NavbarToggle aria-controls="navcol" />
                <NavbarCollapse id="navcol">
                    <Nav className={"mx-auto"}>
                        <NavItem>
                            <InputGroup style={{}}>
                                <Form.Control style={{width: "16em", borderBottomLeftRadius: "1em", borderTopLeftRadius: "1em"}} className={"bg-body-tertiary"} placeholder={"Поиск..."} autocomplete={"off"}></Form.Control>
                                <Button variant={"outline-primary"} style={{borderStyle: "dashed", borderColor: "var(--bs-dark-border-subtle)", borderBottomRightRadius: "1em", borderTopRightRadius: "1em"}}>
                                    <svg style={{width: "1em", height: "1em", fill: "currentColor", fontSize: "1.5em"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <path d="M6.5 4.482c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018Z"></path>
                                        <path d="M13 6.5a6.471 6.471 0 0 1-1.258 3.844c.04.03.078.062.115.098l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1.007 1.007 0 0 1-.1-.115h.002A6.5 6.5 0 1 1 13 6.5ZM6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"></path>
                                    </svg>
                                </Button>
                            </InputGroup>
                        </NavItem>
                    </Nav>
                    <Nav>
                        <NavItem className={"d-flex align-items-center text-center"}>
                            <Dropdown menuVariant={"en"}  style={{width: "16em"}} drop={"down-centered"}>
                                <Badge pill={true}>n уведомлений</Badge>
                                <DropdownMenu>
                                    <DropdownHeader>Уведомлений нет</DropdownHeader>
                                    <DropdownItemText style={{fontSize: "1em"}}><a href="#">@ahmed</a> поставил ❤️ на ваш момент &quot;Опять работаю...&quot;</DropdownItemText>
                                </DropdownMenu>
                            </Dropdown>
                        </NavItem>
                    </Nav>
                </NavbarCollapse>
            </Container>
        </Navbar>
    );
}

export default NBar;