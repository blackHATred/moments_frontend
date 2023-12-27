import React, {useContext, useEffect} from 'react';
import {UserContext} from "../userContext";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";


function Logout() {
    const {user, setUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        Cookies.remove("user");
        setUser(undefined);
        navigate("/login");
    }, [user]);

    return (
        <></>
    );
}

export default Logout;