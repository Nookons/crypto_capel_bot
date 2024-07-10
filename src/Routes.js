import { FAVORITE_ROUTE, HOME_ROUTE, NEWS_ROUTE, USER_ROUTE } from "./utils/Consts";
import User from "./Pages/User/User";
import Favorite from "./Pages/Favorite/Favorite";
import News from "./Pages/News/News";
import Main from "./Display/Main";

export const publicRoutes = [
    {
        path: USER_ROUTE,
        Component: User,
        label: 'User',
    },
    {
        path: FAVORITE_ROUTE,
        Component: Favorite,
        label: 'Favorite',
    },
    {
        path: NEWS_ROUTE,
        Component: News,
        label: 'News',
    },
    {
        path: HOME_ROUTE,
        Component: Main,
        label: 'Home',
    },
];
