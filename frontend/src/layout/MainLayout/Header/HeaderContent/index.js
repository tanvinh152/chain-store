// material-ui
import { Box, useMediaQuery } from '@mui/material';

// project import
import MobileSection from './MobileSection';
import Profile from './Profile';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
    const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <>
            <Box sx={{ width: '100%', ml: 1 }} />
            {!matchesXs && <Profile />}
            {matchesXs && <MobileSection />}
        </>
    );
};

export default HeaderContent;
