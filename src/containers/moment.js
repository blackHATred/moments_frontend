import {Button, Card, Col, Form, Image, InputGroup, Modal, Placeholder} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {momentLikesCountSvg, momentLikeSvg, momentPlaceholder, momentShareSvg, momentViewsCountSvg} from "../svgs";
import {UserContext} from "../userContext";
import {useNavigate} from "react-router-dom";
import ConfettiExplosion from "react-confetti-explosion";


function MomentContainer({momentId}) {
    const [isExploding, setIsExploding] = React.useState(false);
    const navigate = useNavigate();
    const {user, userId} = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [imageURL, setImageURL] = useState("");
    const [liked, setLiked] = useState(false);
    const [authorId, setAuthorId] = useState(-1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);
    const [likesCount, setLikesCount] = useState(0);
    const [viewsCount, setViewsCount] = useState(0);
    const [showModalShare, setShowModalShare] = useState(false);

    async function getMoment(id = momentId) {
        let res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/moment/get?` + new URLSearchParams({
            token: user,
            moment_id: id
        }), {
            method: "GET",
            headers: {'Accept': 'application/json'}
        });
        if (!res.ok)
            navigate("/not_found");
        res = await res.json();
        setImageURL((await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/moment/picture?` + new URLSearchParams({
            token: user,
            moment_id: id
        }), {
            method: "GET",
            headers: {'Accept': 'application/json'}
        })).url);
        setLiked(res["liked"]);
        setAuthorId(res["author"]);
        setTitle(res["title"]);
        setDescription(res["description"]);
        setTags(res["tags"]);
        setLikesCount(res["likes"]);
        setViewsCount(res["views"]);
        setLoading(false);
    }

    async function likeMoment(id = momentId) {
        let res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/like/like_moment?` + new URLSearchParams({
            token: user,
            moment_id: id
        }), {
            method: "POST",
            headers: {'Accept': 'application/json'}
        });
        if (res.ok) {
            setLiked(true);
            setLikesCount(likesCount + 1);
            setIsExploding(true);
        }
    }

    async function unlikeMoment(id = momentId) {
        let res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/like/unlike_moment?` + new URLSearchParams({
            token: user,
            moment_id: id
        }), {
            method: "POST",
            headers: {'Accept': 'application/json'}
        });
        if (res.ok) {
            setLiked(false);
            setLikesCount(likesCount - 1);
            setIsExploding(false);
        }
    }

    useEffect(() => {
        // расскоментировать строчку ниже, чтобы посмотреть, как работают плейсхолдеры
        //setTimeout(getMoment, 3000);
        getMoment().then(() => {
        });
    }, []);


    return (
        <>
            <Modal show={showModalShare} onHide={() => setShowModalShare(false)}
                   centered>
                <Modal.Header closeButton>
                    <Modal.Title>Поделиться моментом</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup>
                        <InputGroup.Text>Ссылка на момент</InputGroup.Text>
                        <Form.Control
                            readOnly={true}
                            value={`${window.location.origin}/moment/${momentId}`}
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => setShowModalShare(false)}>
                        Отмена
                    </Button>
                </Modal.Footer>
            </Modal>
            {loading ?
                <Col md={6}>
                    <Card>
                        <Card.Img src={momentPlaceholder}></Card.Img>
                        <div className="text-nowrap float-start">
                            <Button variant={"light"} className="border rounded-circle border-0 shadow-lg"
                                    style={{width: "64px", height: "64px", marginTop: "-32px", marginLeft: "12px"}}>
                                {momentLikeSvg}
                            </Button>
                            <Button variant={"light"} className="border rounded-circle border-0 shadow-lg"
                                    style={{width: "64px", height: "64px", marginTop: "-32px", marginLeft: "12px"}}>
                                {momentShareSvg}
                            </Button>
                        </div>
                        <Card.Body>
                            <Placeholder as={Card.Title} animation="glow">
                                <Placeholder xs={6}/>
                            </Placeholder>
                            <Placeholder as={Card.Text} animation="glow">
                                <Placeholder xs={7}/> <Placeholder xs={4}/> <Placeholder xs={4}/>{' '}
                                <Placeholder xs={6}/> <Placeholder xs={8}/>
                            </Placeholder>
                            <p style={{marginBottom: "0px"}}>
                                Теги:&nbsp;<Placeholder as={"span"} animation="glow"><Placeholder xs={2}/> <Placeholder
                                xs={1}/></Placeholder>
                                <br/>
                                {momentLikesCountSvg}&nbsp;Отметок&nbsp;
                                <span style={{textDecoration: "underline"}}>мне нравится</span>:&nbsp;<Placeholder
                                as={"span"} animation="glow"><Placeholder xs={1}/></Placeholder>
                                <br/>
                                {momentViewsCountSvg}&nbsp;Просмотров:&nbsp;<Placeholder as={"span"}
                                                                                         animation="glow"><Placeholder
                                xs={1}/></Placeholder>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                :
                <Col md={6}>
                    <Card>
                        <Card.Img src={imageURL}></Card.Img>
                        <div className="text-nowrap float-start">
                            {authorId === parseInt(userId) ?
                                <></>
                                :
                                liked ?
                                    <Button variant={"danger"} className="border rounded-circle border-0 shadow-lg"
                                            style={{
                                                width: "64px",
                                                height: "64px",
                                                marginTop: "-32px",
                                                marginLeft: "12px"
                                            }}
                                            onClick={async () => {
                                                await unlikeMoment();
                                            }}>
                                        {momentLikeSvg}
                                        {isExploding && <ConfettiExplosion/>}
                                    </Button>
                                    :
                                    <Button variant={"light"} className="border rounded-circle border-0 shadow-lg"
                                            style={{
                                                width: "64px",
                                                height: "64px",
                                                marginTop: "-32px",
                                                marginLeft: "12px"
                                            }}
                                            onClick={async () => {
                                                await likeMoment();
                                            }}>
                                        {momentLikeSvg}
                                        {isExploding && <ConfettiExplosion/>}
                                    </Button>
                            }
                            <Button variant={"light"} className="border rounded-circle border-0 shadow-lg"
                                    style={{width: "64px", height: "64px", marginTop: "-32px", marginLeft: "12px"}}
                                    onClick={() => setShowModalShare(true)}>
                                {momentShareSvg}
                            </Button>
                            <Button variant={"light"} className="border rounded-circle border-0 shadow-lg"
                                    style={{
                                        width: "64px", height: "64px", marginTop: "-32px", marginLeft: "12px",
                                        padding: "0px"
                                    }} target="_blank" href={`/user/${authorId}`}>
                                <Image className={"rounded-circle border-0"} width={64} height={64}
                                       style={{objectFit: "cover"}}
                                       src={`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/user/avatar?` + new URLSearchParams({user_id: authorId})}>
                                </Image>
                            </Button>
                        </div>
                        <Card.Body>
                            <Card.Title>{title}</Card.Title>
                            <Card.Text dangerouslySetInnerHTML={{__html: description}}></Card.Text>
                            <p style={{marginBottom: "0px"}}>
                                Теги:&nbsp;
                                {tags.length === 0 && <span>Тегов нет</span>}
                                {tags.map((elem, key) => (
                                    <span key={key} className="badge rounded-pill bg-primary"
                                          style={{marginRight: "2px"}}>{elem}</span>
                                ))}
                                <br/>
                                {momentLikesCountSvg}&nbsp;Отметок&nbsp;
                                <span style={{textDecoration: "underline"}}>мне нравится</span>:&nbsp;{likesCount}
                                <br/>
                                {momentViewsCountSvg}&nbsp;Просмотров:&nbsp;{viewsCount}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            }
        </>
    )
}

export default MomentContainer;