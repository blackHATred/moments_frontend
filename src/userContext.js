import React from 'react';

/*
 user === undefined если вход не выполнен
 иначе
 user === token
 */
const UserContext = React.createContext({
    user: undefined,
    setUser: undefined,
    userId: undefined,
    setUserId: undefined,
    userAvatarLink: undefined,
    setUserAvatarLink: undefined
});

export {UserContext};