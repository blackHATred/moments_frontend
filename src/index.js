import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from './App';
import {createRoot} from "react-dom/client";


const container = document.getElementById('root');
let router = createBrowserRouter([{path: "*", element: <App/>}]);
const root = createRoot(container);
root.render(
    <RouterProvider router={router}/>
);
export {router}
