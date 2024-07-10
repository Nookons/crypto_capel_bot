import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { publicRoutes } from "../Routes";

const AppRouter = () => {
    return (
        <Routes>
            {publicRoutes.map(({ path, Component }, index) => (
                <Route key={index} path={path} element={<Component />} />
            ))}
        </Routes>
    );
};

export default AppRouter;
