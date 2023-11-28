import React from 'react';

{/*
 user === null если вход не выполнен
 иначе
 user === token

 centrifugo - аналогично для токена centrifugo
 */}
const UserContext = React.createContext(
    {
        user: null,
        centrifugo: null
    }
);



export { UserContext };