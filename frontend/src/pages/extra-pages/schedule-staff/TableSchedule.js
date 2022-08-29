import {
    Box,
    Button,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MainCard from 'components/MainCard';
import moment from 'moment';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import instance from 'utils/AuthHelpers';
import axios from '../../../utils/axios.config';

function descendingComparator(a, b, orderBy) {
    if (orderBy === 'date') {
        return new Date(b['endTime']).valueOf() - new Date(a['endTime']).valueOf();
    }
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);

        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'shift',
        numeric: false,
        disablePadding: true,
        label: 'Ca làm'
    },
    {
        id: 'date',
        numeric: true,
        disablePadding: false,
        label: 'Ngày'
    },
    {
        id: 'slot',
        numeric: true,
        disablePadding: false,
        label: 'Số lượng'
    },
    {
        id: 'subscriber',
        numeric: true,
        disablePadding: false,
        label: 'Người đăng ký'
    }
];

function EnhancedTableHead(props) {
    const { order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

const TableSchedule = () => {
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('date');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [fromStartTime, setFromStartTime] = useState(null);
    const [toStartTime, setToStartTime] = useState(null);
    const [dataCalendar, setDataCalendar] = useState([]);
    const [fetchData, setFetchData] = useState(true);
    let token = instance.getAccessToken();
    let userInfo = instance.getUserInfo();
    const triggerDataFetch = () => setFetchData((t) => !t);
    const handleChangeFromStartTime = (newValue) => {
        setFromStartTime(new Date(newValue).toISOString());
    };
    const handleChangeToStartTime = (newValue) => {
        setToStartTime(new Date(newValue).toISOString());
    };
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleSearch = async (event) => {
        event.preventDefault();
        if (fromStartTime && toStartTime) {
            try {
                const response = await axios.get(`/calendar?fromStartTime=${fromStartTime}&toStartTime=${toStartTime}`);
                setDataCalendar(response);
            } catch (e) {
                console.log(e.message);
            }
        } else {
            console.log('No');
        }
    };

    const handleRegister = async (id) => {
        try {
            await axios.post(`/calendar/register`, { id: id });
            triggerDataFetch();
        } catch (e) {
            console.log(e.message);
        }
    };
    const handleCancelRegister = async (id) => {
        try {
            await axios.post(`/calendar/cancel-register`, { id: id });
            triggerDataFetch();
        } catch (e) {
            console.log(e.message);
        }
    };
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataCalendar.length) : 0;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/calendar`);
                setDataCalendar(response);
            } catch (e) {
                console.log(e.message);
            }
        };
        fetchData();
    }, [fetchData]);

    return (
        <ComponentSkeleton>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>
                    <Stack spacing={3}>
                        <MainCard>
                            <form onSubmit={(e) => handleSearch(e)}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <Stack spacing={3}>
                                                <DesktopDatePicker
                                                    label="Từ ngày"
                                                    inputFormat="MM/dd/yyyy"
                                                    value={fromStartTime}
                                                    onChange={handleChangeFromStartTime}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </Stack>
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <Stack spacing={3}>
                                                <DesktopDatePicker
                                                    label="đến"
                                                    inputFormat="MM/dd/yyyy"
                                                    value={toStartTime}
                                                    onChange={handleChangeToStartTime}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </Stack>
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="primary">
                                            Tìm kiếm
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </MainCard>
                    </Stack>
                </Grid>
                <Grid item xs={12} lg={12}>
                    <Stack spacing={3}>
                        <MainCard>
                            <TableContainer>
                                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                                    <EnhancedTableHead
                                        numSelected={selected.length}
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                        rowCount={dataCalendar.length}
                                    />
                                    <TableBody>
                                        {stableSort(dataCalendar, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                return (
                                                    <TableRow hover key={index}>
                                                        <TableCell>
                                                            {moment(row?.startTime).diff(moment(row?.startTime).format('l'), 'hours') < 12
                                                                ? 'Ca sáng'
                                                                : 'Ca chiều'}
                                                        </TableCell>
                                                        <TableCell align="right">{moment(row.endTime).format('DD-MM-YYYY')}</TableCell>
                                                        <TableCell align="right">{row.slot}</TableCell>
                                                        <TableCell align="right">{row.subscriber.length}</TableCell>
                                                        <TableCell align="right">
                                                            {row.subscriber.find((x) => x._id === userInfo._id) ? (
                                                                <Button
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={() => handleCancelRegister(row._id)}
                                                                >
                                                                    Hủy đăng ký
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="contained"
                                                                    color="success"
                                                                    disabled={row.subscriber.length == row.slot}
                                                                    onClick={() => handleRegister(row._id)}
                                                                >
                                                                    {row.subscriber.length == row.slot ? 'Full' : 'Đăng ký'}
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        {emptyRows > 0 && (
                                            <TableRow
                                                style={{
                                                    height: (dense ? 33 : 53) * emptyRows
                                                }}
                                            >
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                component="div"
                                count={dataCalendar.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </MainCard>
                    </Stack>
                </Grid>
            </Grid>
        </ComponentSkeleton>
    );
};
export default TableSchedule;
