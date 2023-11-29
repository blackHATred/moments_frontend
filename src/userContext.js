import React from 'react';

{/*
 user === null если вход не выполнен
 иначе
 user === token

 centrifugo - аналогично для токена centrifugo
 */
}
const UserContext = React.createContext({
    user: undefined,
    setUser: undefined,
    cent: undefined,
    setCent: undefined,
    userId: undefined,
    setUserId: undefined
});

const getUserAvatarLink = async (user_id) => {
    // Возвращает ссылку на аватарку пользователя
    let res =
        await fetch(`${process.env.REACT_APP_BACKEND_HOST}/user/avatar?` + new URLSearchParams({user_id: user_id}), {
            method: "GET",
            headers: {'Accept': 'application/json'}
        });
    return res.url;
}


export {UserContext, getUserAvatarLink};