import { SearchOutlined } from '@ant-design/icons';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
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
import ConfirmDialog from 'components/ConfirmDialog';
import MainCard from 'components/MainCard';
import Popup from 'components/Popup';
import moment from 'moment';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { alert } from 'store/reducers/alert';
import { formatCurrency } from 'utils/helper';
import axios from '../../../utils/axios.config';
import BillForm from './BillForm';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import BillDetail from './BillDetail';
import instance from 'utils/AuthHelpers';

function descendingComparator(a, b, orderBy) {
    if (orderBy === 'date') {
        return new Date(b['createdAt']).valueOf() - new Date(a['createdAt']).valueOf();
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
        id: 'code',
        numeric: false,
        disablePadding: true,
        label: 'Mã hóa đơn'
    },
    {
        id: 'date',
        numeric: false,
        disablePadding: true,
        label: 'Ngày tạo hóa đơn'
    },
    {
        id: 'store',
        numeric: false,
        disablePadding: true,
        label: 'Cửa hàng'
    },
    {
        id: 'total',
        numeric: true,
        disablePadding: false,
        label: 'Tổng'
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

const Bill = () => {
    const dispatch = useDispatch();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('date');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [dataBill, setDataBill] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [openDialogDetail, setOpenDialogDetail] = useState(false);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [recordForDetail, setRecordForDetail] = useState(null);
    const [valueSearch, setValueSearch] = useState('');
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [value, setValue] = useState('');
    const [storeList, setStoreList] = useState([]);
    const [title, setTitle] = useState('');
    const [dataSearch, setDataSearch] = useState({
        code: '',
        day: null,
        storeId: ''
    });
    const userInfo = instance.getUserInfo();
    let navigate = useNavigate();
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
            const res = await axios.get(`/bill?${query}`);
            setDataBill(res);
            setIsLoading(false);
        } catch (error) {
            dispatch(alert({ error: 'Không tìm thấy kết quả' }));
        }
    };
    const addOrEdit = async (item) => {
        try {
            await axios.post(`/bill`, item);
            await getData();
            setOpenPopup(false);
            dispatch(alert({ success: 'Thêm thành công' }));
        } catch (error) {
            setOpenPopup(false);
            dispatch(alert({ error: error }));
        }
    };

    const openInPopup = (item = null) => {
        setTitle(item !== null ? 'Sửa hóa đơn' : 'Tạo hóa đơn');
        setRecordForEdit(item);
        setOpenPopup(true);
    };
    const handleOpenDialogDetail = (item) => {
        setRecordForDetail(item);
        setOpenDialogDetail(true);
    };
    const onDelete = async (id) => {
        try {
            await axios.delete(`/bill/${id}`);
            await getData();
            setConfirmDialog({ isOpen: false, ...confirmDialog });
            dispatch(alert({ success: 'Xóa thành công' }));
        } catch (error) {
            setConfirmDialog({ isOpen: false, ...confirmDialog });
            dispatch(alert({ error: 'Xóa không thành công' }));
        }
    };
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataBill.length) : 0;

    async function getData() {
        const resBill = await axios.get(`/bill`);
        const resStore = await axios.get(`store/active`);
        setDataBill(resBill);
        setStoreList(resStore);
        setIsLoading(false);
    }

    useEffect(() => {
        let mounted = true;

        if (mounted) {
            getData();
        }
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
                                <Grid item xs={userInfo.role === 2 ? 4 : 6}>
                                    <FormControl>
                                        <OutlinedInput
                                            name="code"
                                            value={dataSearch.code}
                                            placeholder="Nhập mã hoá đơn"
                                            onChange={handleInputSearch}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={userInfo.role === 2 ? 4 : 6}>
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
                                {userInfo.role === 2 && (
                                    <Grid item xs={4}>
                                        <FormControl>
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
                                )}
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
                            <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openInPopup()}>
                                Thêm
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
                                        rowCount={dataBill.length}
                                    />
                                    <TableBody>
                                        {stableSort(dataBill, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                return (
                                                    <TableRow hover key={index}>
                                                        <TableCell>{row.code}</TableCell>
                                                        <TableCell>{moment(row.createdAt).format('lll')}</TableCell>
                                                        <TableCell>{row.store.name}</TableCell>
                                                        <TableCell align="right">{formatCurrency(row.total)}</TableCell>
                                                        <TableCell align="right">
                                                            <IconButton size="large" onClick={() => handleOpenDialogDetail(row)}>
                                                                <InfoIcon fontSize="inherit" />
                                                            </IconButton>
                                                            <IconButton
                                                                aria-label="delete"
                                                                size="large"
                                                                color="error"
                                                                onClick={() =>
                                                                    setConfirmDialog({
                                                                        isOpen: true,
                                                                        title: 'Bạn có muốn xóa hay không?',
                                                                        onConfirm: () => {
                                                                            onDelete(row._id);
                                                                        }
                                                                    })
                                                                }
                                                            >
                                                                <DeleteIcon fontSize="inherit" />
                                                            </IconButton>
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
                                count={dataBill.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                            <Popup title={title} openPopup={openPopup} setOpenPopup={setOpenPopup} onClose={() => setOpenPopup(false)}>
                                <BillForm storeList={storeList} recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
                            </Popup>
                            <Popup
                                title="Chi tiết hóa đơn"
                                openPopup={openDialogDetail}
                                setOpenPopup={setOpenDialogDetail}
                                onClose={() => setOpenDialogDetail(false)}
                            >
                                <BillDetail recordForDetail={recordForDetail} />
                            </Popup>
                            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
                        </MainCard>
                    </Stack>
                </ComponentSkeleton>
            </Grid>
        </Grid>
    );
};
export default Bill;
