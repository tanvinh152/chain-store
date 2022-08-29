import { Stack, Typography } from '@mui/material';
// material-ui
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = ({ open }) => {
    const theme = useTheme();

    return (
        // only available in paid version
        <DrawerHeaderStyled theme={theme} open={open}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h2">Chain Store</Typography>
            </Stack>
        </DrawerHeaderStyled>
    );
};

DrawerHeader.propTypes = {
    open: PropTypes.bool
};

export default DrawerHeader;
