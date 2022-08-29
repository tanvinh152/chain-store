import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    AppBar,
    Avatar,
    Box,
    CardContent,
    ClickAwayListener,
    Grid,
    IconButton,
    Paper,
    Popper,
    Stack,
    Toolbar,
    Typography
} from '@mui/material';

// project import
import Search from './Search';
import Profile from './Profile';
import Transitions from 'components/@extended/Transitions';

import axios from '../../../../utils/axios.config';

// assets
import { LogoutOutlined, MoreOutlined } from '@ant-design/icons';
import instance from 'utils/AuthHelpers';
import MainCard from 'components/MainCard';
import { useDispatch } from 'react-redux';
import { activeItem } from 'store/reducers/menu';

// ==============================|| HEADER CONTENT - MOBILE ||============================== //

const MobileSection = () => {
    const theme = useTheme();
    const user = instance.getUserInfo();

    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const dispatch = useDispatch();
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleLogout = async () => {
        // logout
        await axios.get(`/user/logout`);
        instance.clearStorage();
        dispatch(activeItem({ openItem: [] }));
        navigate('/login', { replace: true });
    };
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Box sx={{ flexShrink: 0, ml: 0.75 }}>
                <IconButton
                    component="span"
                    disableRipple
                    sx={{
                        bgcolor: open ? 'grey.300' : 'grey.100'
                    }}
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    color="inherit"
                >
                    <MoreOutlined />
                </IconButton>
            </Box>
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{
                    width: '100%'
                }}
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 9]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="fade" in={open} {...TransitionProps}>
                        <Paper
                            sx={{
                                boxShadow: theme.customShadows.z1
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard elevation={0} border={false} content={false}>
                                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                                        <Grid container justifyContent="space-between" alignItems="center">
                                            <Grid item>
                                                <Stack direction="row" spacing={1.25} alignItems="center">
                                                    <Avatar alt="profile user" src={user?.profile?.image} sx={{ width: 32, height: 32 }} />
                                                    <Stack>
                                                        <Typography variant="h6">{user?.username}</Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {user?.role === 0 && 'Nhân viên'}
                                                            {user?.role === 1 && 'Quản lý cửa hàng'}
                                                            {user?.role === 2 && 'Quản lý chuỗi cửa hàng'}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Grid>
                                            <Grid item>
                                                <IconButton size="large" color="secondary" onClick={handleLogout}>
                                                    <LogoutOutlined />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default MobileSection;
