import { SearchOutlined } from '@ant-design/icons';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    MenuItem,
    OutlinedInput,
    Select,
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
import MainCard from 'components/MainCard';
import moment from 'moment';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { alert } from 'store/reducers/alert';
import axios from '../../../utils/axios.config';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';

function descendingComparator(a, b, orderBy) {
    if (orderBy === 'date') {
        return new Date(b['endTime']).valueOf() - new Date(a['endTime']).valueOf();
    }
    if (orderBy === 'store') {
        return a['store'].name.localeCompare(b['store'].name);
    }
    if (orderBy === 'code_merchandise') {
        return a['merchandise'].code.localeCompare(b['merchandise'].code);
    }
    if (orderBy === 'name_merchandise') {
        return a['merchandise'].name.localeCompare(b['merchandise'].name);
    }
    if (orderBy === 'supplier') {
        return a['supplier'].name.localeCompare(b['supplier'].name);
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
        id: 'code_merchandise',
        numeric: false,
        disablePadding: false,
        label: 'Người thực hiện'
    },
    {
        id: 'name_store',
        numeric: false,
        disablePadding: false,
        label: 'Tên cửa hàng'
    },
    {
        id: 'date',
        numeric: false,
        disablePadding: false,
        label: 'Ngày'
    },
    {
        id: 'comment',
        numeric: false,
        disablePadding: false,
        label: 'Hành động đã làm'
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

const History = () => {
    const dispatch = useDispatch();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('date');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [dataHistory, setDataHistory] = useState([]);
    const [valueSearch, setValueSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [storeList, setStoreList] = useState([]);
    const [dataSearch, setDataSearch] = useState({
        storeId: '',
        day: null
    });
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

    const handleInputSearch = (e) => {
        const { name, value } = e.target;
        setDataSearch({ ...dataSearch, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            let query = '';
            for (let key in dataSearch) {
                if (dataSearch.hasOwnProperty(key)) {
                    if (dataSearch[key] !== null) {
                        const value = encodeURIComponent(dataSearch[key]);
                        query += `${key}=${value}&`;
                    }
                }
            }
            const res = await axios.get(`/history?${query}`);
            setDataHistory(res);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            dispatch(alert({ error: 'Không tìm thấy kết quả' }));
        }
    };
    const openInPopup = (item = null) => {
        setTitle(item !== null ? 'Sửa kho' : 'Nhập kho');
        setRecordForEdit(item);
        setOpenPopup(true);
    };
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataHistory.length) : 0;

    useEffect(() => {
        let mounted = true;
        async function getData() {
            const resData = await axios.get(`/history`);
            const resStore = await axios.get(`/store`);
            if (mounted) {
                setStoreList(resStore);
                setDataHistory(resData);
                setIsLoading(false);
            }
        }
        getData();
        return function cleanup() {
            mounted = false;
        };
    }, []);
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
                <MainCard>
                    <Box
                        sx={{
                            width: '100%',
                            ml: { xs: 0, md: 1 },
                            justifyContent: 'space-between',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <Box flexGrow={1} component="form" onSubmit={handleSubmit} id="formSearch">
                            <Grid container spacing={3} justifyContent="center" alignItems="center">
                                <Grid item xs={6}>
                                    <FormControl sx={{ display: 'flex', flexDirection: 'row' }}>
                                        <Select
                                            name="storeId"
                                            value={dataSearch.storeId}
                                            onChange={handleInputSearch}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            sx={{ marginRight: 5 }}
                                        >
                                            <MenuItem value="">Tất cả cửa hàng</MenuItem>
                                            {storeList.map((store) => (
                                                <MenuItem key={store._id} value={store._id}>
                                                    {store.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DesktopDatePicker
                                            label="Nhập ngày cần tìm"
                                            inputFormat="MM/dd/yyyy"
                                            value={dataSearch.day}
                                            onChange={(e) => {
                                                if (e) {
                                                    setDataSearch({ ...dataSearch, day: new Date(e).toUTCString() });
                                                } else {
                                                    setDataSearch({ ...dataSearch, day: null });
                                                }
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box>
                            <Button
                                sx={{ marginRight: 2 }}
                                variant="contained"
                                color="info"
                                startIcon={<SearchOutlined />}
                                type="submit"
                                form="formSearch"
                            >
                                Tìm kiếm
                            </Button>
                        </Box>
                    </Box>
                </MainCard>
            </Grid>
            <Grid item xs={12} lg={12}>
                <ComponentSkeleton isLoadingPage={isLoading}>
                    <Stack spacing={3}>
                        <MainCard>
                            <TableContainer>
                                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                                    <EnhancedTableHead
                                        numSelected={selected.length}
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                        rowCount={dataHistory.length}
                                    />
                                    <TableBody>
                                        {stableSort(dataHistory, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                return (
                                                    <TableRow hover key={index}>
                                                        <TableCell>{row.user.username}</TableCell>
                                                        <TableCell>{row.store?.name}</TableCell>
                                                        <TableCell>{moment(row.createdAt).format('LLL')}</TableCell>
                                                        <TableCell>{row.comment}</TableCell>
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
                                count={dataHistory.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </MainCard>
                    </Stack>
                </ComponentSkeleton>
            </Grid>
        </Grid>
    );
};
export default History;
