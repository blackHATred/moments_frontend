import React, {useEffect, useState} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';

import {UserContext} from './userContext';

import Login from './pages/login';
import Register from './pages/register';
import Feed from './pages/feed';
import Me from './pages/me';
import Moment from './pages/moment';
import Notifications from './pages/notifications';
import User from './pages/user';
import Search from './pages/search';
import NotFound from './pages/notfound';
import Logout from './pages/logout';
import NavbarContainer from "./containers/navbar";


function App() {
    const navigate = useNavigate();
    const [user, setUser] = useState(Cookies.get("user"));
    const [userId, setUserId] = useState(Cookies.get("userId"));
    const [userAvatarLink, setUserAvatarLink] = useState("");

    useEffect(() => {
        console.log("App mount");
        // проверяем валидность токена, обновляем инфу о юзере
        (async () => {
            if (user !== undefined) {
                let res = await fetch(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_BACKEND_HOST}/user/my_info?` + new URLSearchParams({token: user}), {
                    method: "GET",
                    headers: {'Accept': 'application/json'}
                });
                if (res.ok) {
                    res = await res.json();
                    Cookies.set("userId", res["id"]);
                    setUserId(Cookies.get("userId"));
                } else {
                    setUser(undefined);
                    navigate("/login");
                }
            } else {
                navigate("/login");
            }
        })();
    }, [user]);

    return (
        <>
            <UserContext.Provider value={{
                user: user,
                setUser: setUser,
                userId: userId,
                setUserId: setUserId,
                userAvatarLink: userAvatarLink,
                setUserAvatarLink: setUserAvatarLink
            }}>
                <Routes>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    {/* Другие страницы имеют шапку */}
                    <Route path='/' element={<NavbarContainer/>}>
                        <Route index element={<Feed/>}/>
                        <Route path='me' element={<Me/>}/>
                        <Route path='notifications' element={<Notifications/>}/>
                        <Route path='search/:searchString' element={<Search/>}/>
                        <Route path='user/:user_id' element={<User/>}/>
                        <Route path='moment/:momentId' element={<Moment/>}/>
                    </Route>
                    <Route path='/logout' element={<Logout/>}/>
                    <Route path='*' element={<NotFound/>}/>
                </Routes>
            </UserContext.Provider>
        </>
    );
}

export default App;