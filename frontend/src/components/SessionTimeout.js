import moment from 'moment';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { activeItem } from 'store/reducers/menu';
import instance from 'utils/AuthHelpers';
import axios from '../utils/axios.config';
const SessionTimeout = () => {
    const [events, setEvents] = useState(['load']);
    const [second, setSecond] = useState(0);
    const [isOpen, setOpen] = useState(false);
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const token = instance.getAccessToken();
    let timeStamp;
    let warningInactiveInterval = useRef();
    let startTimerInterval = useRef();

    // start inactive check
    let timeChecker = () => {
        startTimerInterval.current = setTimeout(() => {
            let storedTimeStamp = sessionStorage.getItem('lastTimeStamp');
            warningInactive(storedTimeStamp);
        }, 60000);
    };
    const logout = async () => {
        await axios.get(`/user/logout`);
        instance.clearStorage();
        dispatch(activeItem({ openItem: [] }));
        navigate('/login', { replace: true });
    };
    // warning timer
    let warningInactive = (timeString) => {
        clearTimeout(startTimerInterval.current);

        warningInactiveInterval.current = setInterval(async () => {
            const maxTime = 120;
            const popTime = 1;

            const diff = moment.duration(moment().diff(moment(timeString)));
            const minPast = diff.minutes();
            const leftSecond = 60 - diff.seconds();

            if (minPast === popTime) {
                setSecond(leftSecond);
                setOpen(true);
            }

            if (minPast === maxTime) {
                await clearInterval(warningInactiveInterval.current);
                setOpen(false);
                logout();
            }
        }, 1000);
    };

    // reset interval timer
    let resetTimer = useCallback(() => {
        clearTimeout(startTimerInterval.current);
        clearInterval(warningInactiveInterval.current);

        if (token) {
            timeStamp = moment();
            sessionStorage.setItem('lastTimeStamp', timeStamp);
        } else {
            clearInterval(warningInactiveInterval.current);
            sessionStorage.removeItem('lastTimeStamp');
        }
        timeChecker();
        setOpen(false);
    }, [token]);

    // handle close popup
    const handleClose = () => {
        setOpen(false);

        // resetTimer();
    };

    useEffect(() => {
        timeChecker();

        return () => {
            clearTimeout(startTimerInterval.current);
        };
    }, [resetTimer, events, timeChecker]);

    if (!isOpen) {
        return null;
    }
    // change fragment to modal and handleclose func to close
    return <Fragment />;
};

export default SessionTimeout;
