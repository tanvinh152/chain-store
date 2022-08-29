// material-ui
import { Box, Typography } from '@mui/material';
import schedule from 'menu-items/schedule';
import dashboard from 'menu-items/dashboard';
// project import
import NavGroup from './NavGroup';
// import menuItem from 'menu-items';
import { useEffect, useState } from 'react';
import instance from '../../../../../utils/AuthHelpers';
import { useDispatch } from 'react-redux';
import { activeItem } from 'store/reducers/menu';
import admin from 'menu-items/admin';
import chainManager from 'menu-items/chainManager';
import staff from 'menu-items/staff';
// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //
const Navigation = () => {
    const [menuItems, setMenuItems] = useState();
    const dispatch = useDispatch();
    let user = instance.getUserInfo();
    useEffect(() => {
        if (user?.role === 0) {
            setMenuItems({
                items: [schedule, staff]
            });
            dispatch(activeItem({ openItem: ['schedule'] }));
        }

        if (user?.role === 1) {
            setMenuItems({
                items: [admin]
            });
            dispatch(activeItem({ openItem: ['admin'] }));
        }
        if (user?.role === 2) {
            setMenuItems({
                items: [chainManager]
            });
            dispatch(activeItem({ openItem: ['chainManager'] }));
        }
    }, []);

    const navGroups = menuItems?.items.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Fix - Navigation Group
                    </Typography>
                );
        }
    });

    return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
