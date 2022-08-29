import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Grid, Skeleton, Stack } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// ===============================|| COMPONENT - SKELETON ||=============================== //

const ComponentSkeleton = ({ isLoadingPage, children }) => {
    const skeletonCard = (
        <MainCard secondary={<Skeleton animation="wave" variant="circular" width={24} height={24} />}>
            <Stack spacing={1}>
                <Skeleton />
                <Skeleton sx={{ height: 64 }} animation="wave" variant="rectangular" />
                <Skeleton />
                <Skeleton />
            </Stack>
        </MainCard>
    );

    return (
        <>
            {isLoadingPage ? (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        {skeletonCard}
                    </Grid>
                </Grid>
            ) : (
                children
            )}
        </>
    );
};

ComponentSkeleton.propTypes = {
    children: PropTypes.node,
    isLoadingPage: PropTypes.bool
};

export default ComponentSkeleton;
