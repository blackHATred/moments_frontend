import React, {useEffect, useState} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
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


function App() {
    const [user, setUser] = useState(Cookies.get('user'));
    const [cent, setCent] = useState(Cookies.get('centrifugo'));
    const [userId, setUserId] = useState(null);

    useEffect( () => {
        // проверяем валидность токена, обновляем инфу о юзере
        const fetchUser = async () => {
            if (user !== null && user !== undefined) {
                const res1 = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/user/my_info?` + new URLSearchParams({token: user}), {
                    method: "GET",
                    headers: {'Accept': 'application/json'}
                });
                const res2 = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/user/get_cent_token?` + new URLSearchParams({token: user}), {
                    method: "GET",
                    headers: {'Accept': 'application/json'}
                });
                if (res2.ok) {
                    Cookies.set("centrifugo", (await res2.json())["cent_token"]);
                    setCent(Cookies.get("centrifugo"));
                    Cookies.set("userId", (await res1.json())["id"]);
                    setUserId(Cookies.get("userId"));
                } else {
                    setUser(null);
                    setCent(null);
                }
            }
        }
        fetchUser();
    }, []);

    return (
        <>
            <UserContext.Provider value={{user: user, setUser: setUser, cent: cent, setCent: setCent, userId: userId, setUserId: setUserId}}>
                <Routes>
                    {/* По дефолту будем скидывать пользователя на страницу авторизации */}
                    <Route index element={<Navigate to="/login"/>}/>
                    <Route path='/login' element={<Login/>}></Route>
                    <Route path='/register' element={<Register/>}></Route>
                    <Route path='/feed' element={<Feed/>}></Route>
                    <Route path='/me' element={Me}></Route>
                    <Route path='/notificcations' element={Notifications}></Route>
                    <Route path='/search'>
                        <Route path=":searchString" element={Search}/>
                    </Route>
                    <Route path='/user'>
                        <Route path=":userId" element={User}/>
                    </Route>
                    <Route path='/moment'>
                        <Route path=":momentId" element={Moment}/>
                    </Route>
                    <Route path='*' element={NotFound}></Route>
                </Routes>
            </UserContext.Provider>
        </>
    );
}

export default App;