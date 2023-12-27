import {Button, Image, Placeholder} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {commentLikeSvg, momentPlaceholder} from "../svgs";
import {UserContext} from "../userContext";


function CommentContainer({commentId}) {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authorId, setAuthorId] = useState(-1);
    const [authorNickname, setAuthorNickname] = useState("");
    const [commentText, setCommentText] = useState("");
    const [likesCount, setLikesCount] = useState(0);
    const [liked, setLiked] = useState(false);

    async function getComment() {
        setLoading(true);
        let res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/comment/get_comment?` + new URLSearchParams({
            token: user,
            comment_id: commentId
        }), {
            method: "GET",
            headers: {'Accept': 'application/json'}
        });
        if (res.ok) {
            res = await res.json();
            setAuthorId(res["author"]);
            setAuthorNickname(res["author_nickname"]);
            setCommentText(res["text"]);
            setLikesCount(res["likes"]);
            setLiked(res["liked"]);
        }
        setLoading(false);
    }

    async function likeComment() {
        let res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/like/like_comment?` + new URLSearchParams({
            token: user,
            comment_id: commentId
        }), {
            method: "POST",
            headers: {'Accept': 'application/json'}
        });
        if (res.ok) {
            setLiked(true);
            setLikesCount(likesCount + 1);
        }
    }

    async function unlikeComment() {
        let res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/like/unlike_comment?` + new URLSearchParams({
            token: user,
            comment_id: commentId
        }), {
            method: "POST",
            headers: {'Accept': 'application/json'}
        });
        if (res.ok) {
            setLiked(false);
            setLikesCount(likesCount - 1);
        }
    }

    useEffect(() => {
        getComment().then(() => {
        });
    }, []);

    return (
        <div className="d-flex flex-row">
            {!loading && <Image
                src={`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/user/avatar?` + new URLSearchParams({user_id: authorId})}
                onClick={() => {
                    navigate(`/user/${authorId}`)
                }} width={40} height={40} style={{objectFit: "cover"}} className="rounded-circle"/>}
            {loading && <Image src={momentPlaceholder} width={40} height={40} style={{objectFit: "cover"}}
                               className="rounded-circle"/>}
            <div className="d-flex flex-column" style={{paddingTop: "2px", paddingLeft: "8px", width: "100%"}}>
                {!loading && <span className="text-break fw-semibold" onClick={() => {
                    navigate(`/user/${authorId}`)
                }}>@{authorNickname}</span>}
                {loading && <Placeholder as={"span"} animation="glow"> <Placeholder xs={4}/> </Placeholder>}
                <small className="text-break">
                    {loading ?
                        <Placeholder as={"span"} animation="glow"> <Placeholder xs={3}/> <Placeholder xs={1}/>
                            <Placeholder xs={2}/> <Placeholder xs={4}/> </Placeholder>
                        :
                        <div dangerouslySetInnerHTML={{__html: commentText}}></div>
                    }
                </small>
                <small className="text-break">
                    <span style={{textDecoration: "underline"}}>Лайков:</span>
                    {loading ?
                        <Placeholder as={"span"} animation="glow"> <Placeholder xs={4}/> </Placeholder>
                        :
                        <>&nbsp;{likesCount}</>
                    }
                </small>
            </div>
            <div>
                {loading &&
                    <Placeholder.Button variant={"outline-danger"} className="border rounded-circle" style={{
                        width: "40px",
                        height: "40px",
                        maxWidth: "40px",
                        maxHeight: "40px",
                        fontSize: "20px"
                    }}>
                        {commentLikeSvg}
                    </Placeholder.Button>
                }
                {!loading && liked ?
                    <Button variant={"danger"} className="border rounded-circle" style={{
                        width: "40px",
                        height: "40px",
                        maxWidth: "40px",
                        maxHeight: "40px",
                        fontSize: "20px"
                    }} onClick={async () => {
                        await unlikeComment();
                    }}>
                        {commentLikeSvg}
                    </Button>
                    :
                    <Button variant={"outline-danger"} className="border rounded-circle" style={{
                        width: "40px",
                        height: "40px",
                        maxWidth: "40px",
                        maxHeight: "40px",
                        fontSize: "20px"
                    }} onClick={async () => {
                        await likeComment();
                    }}>
                        {commentLikeSvg}
                    </Button>
                }
            </div>
        </div>
    );
}

export default CommentContainer;
