import { useEffect, useState } from 'react';

// material-ui
import { FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';

// project import
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MainCard from 'components/MainCard';
import SalesColumnChart from './SalesColumnChart';

import axios from '../../utils/axios.config';

import { formatCurrency } from '../../utils/helper';
import instance from 'utils/AuthHelpers';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';

const DashboardDefault = () => {
    const [value, setValue] = useState('');
    const [valueYear, setValueYear] = useState(2022);
    const [isLoading, setIsLoading] = useState(true);
    const yearList = [2022, 2021, 2020];
    const [revenueYear, setRevenueYear] = useState('');
    const [revenueToday, setRevenueToday] = useState('');
    const [storeList, setStoreList] = useState([]);
    const [dataRevenue, setDataRevenue] = useState([]);
    const user = instance.getUserInfo();
    useEffect(async () => {
        setIsLoading(true);
        let mounted = true;
        async function getData() {
            const responseRevenueYear = await axios.get(`/revenue/year/${valueYear}/${value}`);
            const responseRevenueToday = await axios.get(`/revenue/today/${value}`);
            const responseStore = await axios.get(`store/active`);
            const responseRevenueMonth = await axios.get(`/revenue/month/${valueYear}/${value}`);
            if (mounted) {
                setRevenueYear(responseRevenueYear);
                setRevenueToday(responseRevenueToday);
                setDataRevenue(responseRevenueMonth);
                setStoreList(responseStore);
                setIsLoading(false);
            }
        }
        getData();
        return function cleanup() {
            mounted = false;
        };
    }, [value, valueYear]);
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
                {user.role === 2 && (
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <Select
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value="">Tất cả cửa hàng</MenuItem>
                            {storeList.map((store) => (
                                <MenuItem key={store._id} value={store._id}>
                                    {store.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <Select
                        value={valueYear}
                        onChange={(e) => setValueYear(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        {yearList.map((y, index) => (
                            <MenuItem key={index} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} lg={12}>
                <ComponentSkeleton isLoadingPage={isLoading}>
                    <Grid container item xs={12} lg={12} spacing={3}>
                        <Grid item xs={6} sm={6} md={6} lg={6}>
                            <AnalyticEcommerce title="Tổng doanh thu" count={formatCurrency(revenueYear)} />
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={6}>
                            <AnalyticEcommerce title="Tổng doanh thu hôm nay" count={formatCurrency(revenueToday)} />
                        </Grid>
                    </Grid>

                    <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

                    <Grid item xs={12} md={12} lg={12} mt={3}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h5">Doanh thu các tháng</Typography>
                            </Grid>
                        </Grid>
                        <MainCard sx={{ mt: 1.75 }}>{dataRevenue.length > 0 && <SalesColumnChart data={dataRevenue} />}</MainCard>
                    </Grid>
                </ComponentSkeleton>
            </Grid>

            {/* row 1 */}
        </Grid>
    );
};

export default DashboardDefault;
