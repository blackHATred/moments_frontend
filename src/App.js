import React, {useState} from 'react';
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


class App extends React.Component {
    render() {
        let user = Cookies.get('user');
        let cent = Cookies.get('centrifugo');

        console.log(user);

        // проверяем валидность токена
        if (user !== null && user !== undefined){
            fetch(`${process.env.REACT_APP_BACKEND_HOST}/user/my_info`+ new URLSearchParams({token: user}), {method: "GET", headers: {'Accept': 'application/json'}})
                .then(response => {
                    if (response.ok) return response.json();
                    else { user = null; cent = null; }
                })
                .then(data => {
                    // если токен валиден, то запрашиваем токен для centrifugo
                    fetch(`${process.env.REACT_APP_BACKEND_HOST}/user/get_cent_token`+ new URLSearchParams({token: user}), {method: "GET", headers: {'Accept': 'application/json'}})
                        .then(response => {
                            if (response.ok) return response.json();
                            else { user = null; cent = null; }
                        })
                        .then(d => {cent = d.get("token")});
                    console.log(`Авторизован ${data.id}`);
                })
        }

        return (
            <>
                <UserContext.Provider value={{ user: user, centrifugo: cent }}>
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
}

export default App;