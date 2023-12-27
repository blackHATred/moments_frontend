import {Button, Card, Col, Form, InputGroup, Placeholder, Stack} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../userContext";
import CommentContainer from "./comment";
import {commentDeleteSvg, commentPostSvg} from "../svgs";


function Comments({momentId}) {
    const {user} = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [commentsTotal, setCommentsTotal] = useState(-1);
    const [lastComment, setLastComment] = useState(0);
    const [endReached, setEndReached] = useState(false);
    const [comments, setComments] = useState([]);
    const [myCommentId, setMyCommentId] = useState(-1);
    const [myCommentText, setMyCommentText] = useState("");
    const [myCommentLikes, setMyCommentLikes] = useState(0);
    const [myPostCommentText, setMyPostCommentText] = useState("");

    async function getComments() {
        setLoading(true);
        let res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/comment/get_comments?` + new URLSearchParams({
            token: user,
            moment_id: momentId,
            last_comment: lastComment
        }), {
            method: "GET",
            headers: {'Accept': 'application/json'}
        });
        if (res.ok) {
            res = await res.json();
            setCommentsTotal(res["total"]);
            if (res["comments"].length < 10)
                setEndReached(true);
            if (res["comments"].length > 0) {
                setLastComment(res["comments"][res.length - 1]);
                comments.push(...res["comments"])
            }
        }
        setLoading(false);
    }

    async function getMyComment() {
        let res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/comment/my_comment?` + new URLSearchParams({
            token: user,
            moment_id: momentId
        }), {
            method: "GET",
            headers: {'Accept': 'application/json'}
        });
        if (res.ok) {
            res = await res.json();
            if (res["comment"] !== null) {
                let res1 = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/comment/get_comment?` + new URLSearchParams({
                    token: user,
                    comment_id: res["comment"]
                }), {
                    method: "GET",
                    headers: {'Accept': 'application/json'}
                });
                if (res1.ok) {
                    res1 = await res1.json();
                    setMyCommentId(res["comment"]);
                    setMyCommentText(res1["text"]);
                    setMyCommentLikes(res1["likes"]);
                }
            } else {
                setMyCommentId(-1);
            }
        }
    }

    async function postComment() {
        setLoading(true);
        if (myPostCommentText.length < 1)
            return;
        const res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/comment/create?` + new URLSearchParams({
            token: user,
            moment_id: momentId,
            text: myPostCommentText
        }), {
            method: "POST",
            headers: {'Accept': 'application/json'}
        });
        if (res.ok) {
            await getMyComment();
            setCommentsTotal(commentsTotal + 1);
        }
        setLoading(false);
    }

    async function deleteComment() {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/comment/delete?` + new URLSearchParams({
            token: user,
            comment_id: myCommentId
        }), {
            method: "DELETE",
            headers: {'Accept': 'application/json'}
        });
        if (res.ok) {
            setMyPostCommentText("");
            await getMyComment();
            setCommentsTotal(commentsTotal - 1);
        }
        setLoading(false);
    }

    useEffect(() => {
        getComments().then(() => {
        });
        getMyComment().then(() => {
        });
    }, []);

    return (
        <Col md={4}>
            <Card>
                <Card.Header>
                    Комментарии {loading ?
                    <Placeholder as="span" animation="glow"><Placeholder xs={2}/></Placeholder> : commentsTotal}
                </Card.Header>
                <Card.Body>
                    <Stack gap={2}>
                        {myCommentId === -1 ?
                            !loading && <InputGroup>
                                <Form.Control className="bg-body-tertiary focus-ring form-control" type="text"
                                              placeholder="Ваш комментарий"
                                              style={{borderBottomLeftRadius: "16px", borderTopLeftRadius: "16px"}}
                                              onChange={async (e) => {
                                                  await setMyPostCommentText(e.target.value.trim());
                                              }}/>
                                <Button variant={"outline-primary"} style={{
                                    borderBottomRightRadius: "16px",
                                    borderTopRightRadius: "16px",
                                    borderStyle: "dashed",
                                    borderColor: "#adb5bd"
                                }} onClick={async (e) => {
                                    e.target.disabled = true;
                                    await postComment();
                                }}>{commentPostSvg}</Button>
                            </InputGroup>
                            :
                            !loading && <div className="d-flex flex-row">
                                <div className="d-flex flex-column"
                                     style={{paddingTop: "2px", paddingLeft: "8px", width: "100%"}}>
                                    <span className="fw-semibold">Ваш комментарий:</span>
                                    <small className="text-break" dangerouslySetInnerHTML={{__html: myCommentText}}></small>
                                    <small className="text-break">Лайков: {myCommentLikes}</small>
                                </div>
                                <Stack gap={2}>
                                    <Button variant="outline-danger" className="border rounded-circle" style={{
                                        width: "40px",
                                        height: "40px",
                                        maxWidth: "40px",
                                        maxHeight: "40px",
                                        fontSize: "20px"
                                    }} onClick={async () => {
                                        await deleteComment();
                                    }}>
                                        {commentDeleteSvg}
                                    </Button>
                                </Stack>
                            </div>
                        }
                        {comments.map(elem => (
                            <CommentContainer key={elem} commentId={elem}/>
                        ))}
                        {!endReached && !loading &&
                            <Button variant="light" onClick={async () => {
                                await getComments();
                            }}>Показать больше</Button>
                        }
                        {!endReached && loading &&
                            <Placeholder.Button variant={"light"}>Показать больше</Placeholder.Button>
                        }
                        {!loading && comments.length === 0 && myCommentId === -1 &&
                            <div className="text-center"><p>Комментариев нет</p></div>}
                    </Stack>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default Comments;