import cookie from 'react-cookies';

const COOKIE_DOMAIN = window.location.hostname;

const EStorage = {
    COOKIE_ACCESS_TOKEN: 'atk',
    COOKIE_REFRESH_TOKEN: 'rtk',
    LOCAL_STORAGE_USER_INFO: 'userInfo'
};

const cookieSetting = {
    path: '/',
    domain: COOKIE_DOMAIN
};

const setCookie = (name, value) => cookie.save(name, value, cookieSetting);

const getCookie = (name) => cookie.load(name);

const removeCookie = (name) => cookie.remove(name, cookieSetting);

const setLocalStorage = (name, value) => {
    const isString = typeof value === 'string';
    localStorage.setItem(name, isString ? value : JSON.stringify(value));
};

const getLocalStorage = (name) => localStorage.getItem(name);

const removeLocalStorage = (name) => localStorage.removeItem(name);

class AuthHelpers {
    getRefreshToken = () => getCookie(EStorage.COOKIE_REFRESH_TOKEN);

    storeRefreshToken = (refreshToken) => setCookie(EStorage.COOKIE_REFRESH_TOKEN, refreshToken);

    getAccessToken = () => getCookie(EStorage.COOKIE_ACCESS_TOKEN);

    storeAccessToken = (accessToken) => {
        setCookie(EStorage.COOKIE_ACCESS_TOKEN, accessToken);
    };

    getUserInfo = () => JSON.parse(getLocalStorage(EStorage.LOCAL_STORAGE_USER_INFO));

    storeUserInfo = (userInfo) => setLocalStorage(EStorage.LOCAL_STORAGE_USER_INFO, userInfo);

    clearStorage = () => {
        removeCookie(EStorage.COOKIE_ACCESS_TOKEN);
        removeCookie(EStorage.COOKIE_REFRESH_TOKEN);
        removeLocalStorage(EStorage.LOCAL_STORAGE_USER_INFO);
        sessionStorage.removeItem('lastTimeStamp');
    };
}

const instance = new AuthHelpers();
export default instance;
