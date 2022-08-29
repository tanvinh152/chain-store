import { SearchOutlined } from '@ant-design/icons';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Button,
    Chip,
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
import { alert } from 'store/reducers/alert';
import instance from 'utils/AuthHelpers';
import axios from '../../../utils/axios.config';
import StaffForm from './StaffForm';

function descendingComparator(a, b, orderBy) {
    if (orderBy === 'date') {
        return new Date(b['endDate']).valueOf() - new Date(a['endDate']).valueOf();
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
        id: 'stt',
        numeric: false,
        disablePadding: true,
        label: 'STT'
    },
    {
        id: 'full_name',
        numeric: false,
        disablePadding: true,
        label: 'Tên nhân viên'
    },
    {
        id: 'gender',
        numeric: false,
        disablePadding: true,
        label: 'Giới tính'
    },
    {
        id: 'birthday',
        numeric: true,
        disablePadding: false,
        label: 'Ngày sinh'
    },
    {
        id: 'address',
        numeric: true,
        disablePadding: false,
        label: 'Địa chỉ'
    },
    {
        id: 'role',
        numeric: true,
        disablePadding: false,
        label: 'Vị trí'
    },
    {
        id: 'store',
        numeric: true,
        disablePadding: false,
        label: 'Nơi làm việc'
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Trạng thái'
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

export default function Staff() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('date');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [age, setAge] = useState('');
    const [openPopup, setOpenPopup] = useState(false);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [valueSearch, setValueSearch] = useState('');
    const [dataUser, setDataUser] = useState([]);
    const [filterDataUser, setFilterDataUser] = useState([]);
    const [value, setValue] = useState('');
    const [storeList, setStoreList] = useState([]);
    const [title, setTitle] = useState('');
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
    const [dataSearch, setDataSearch] = useState({
        storeId: '',
        staffName: '',
        is_hide: ''
    });
    const userRole = instance.getUserInfo().role;
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
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
            const res = await axios.get(`/user?${query}`);
            setDataUser(res);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            dispatch(alert({ error: 'Không tìm thấy kết quả' }));
        }
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const addOrEdit = async (item) => {
        if (item._id) {
            try {
                await axios.put(`/user/${item._id}`, {
                    profile: {
                        full_name: item.profile.full_name,
                        address: item.profile.address,
                        national_id: item.profile.national_id,
                        gender: item.profile.gender
                    },
                    is_hide: item.is_hide
                });
                await getData();
                setOpenPopup(false);
                dispatch(alert({ success: 'Sửa thành công' }));
            } catch (error) {
                setOpenPopup(false);
                dispatch(alert({ error: 'Sửa không thành công' }));
            }
        } else {
            try {
                await axios.post(`/auth/add-user`, item);
                await getData();
                setOpenPopup(false);
                dispatch(alert({ success: 'Thêm thành công' }));
            } catch (error) {
                setOpenPopup(false);
                dispatch(alert({ error: 'Thêm không thành công' }));
            }
        }
    };

    const openInPopup = (item = null) => {
        setTitle(item !== null ? 'Sửa thông tin nhân viên' : 'Tạo thông tin nhân viên');
        setRecordForEdit(item);
        setOpenPopup(true);
    };

    const onDelete = async (id) => {
        try {
            await axios.delete(`/user/${id}`);
            await getData();
            setConfirmDialog({ isOpen: false, ...confirmDialog });
            dispatch(alert({ success: 'Xóa thành công' }));
        } catch (error) {
            setConfirmDialog({ isOpen: false, ...confirmDialog });
            dispatch(alert({ error: 'Xóa không thành công' }));
        }
    };
    async function getData() {
        const resUser = await axios.get(`user`);
        const resStore = await axios.get(`store/active`);
        setDataUser(resUser);
        setStoreList(resStore);
        setIsLoading(false);
    }
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataUser.length) : 0;
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
                            <Grid container spacing={3} justifyContent="flex-start" alignItems="center">
                                <Grid item xs={4}>
                                    <FormControl>
                                        <OutlinedInput
                                            name="staffName"
                                            value={dataSearch.staffName}
                                            placeholder="Nhập tên nhân viên"
                                            onChange={handleInputSearch}
                                        />
                                    </FormControl>
                                </Grid>
                                {userRole === 2 && (
                                    <Grid item xs={4}>
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
                                )}

                                <Grid item xs={4}>
                                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                                        <TextField
                                            select
                                            name="is_hide"
                                            value={dataSearch.is_hide}
                                            onChange={handleInputSearch}
                                            label="Trạng thái"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={false}>Đang hoạt động</MenuItem>
                                            <MenuItem value={true}>Ngưng hoạt động</MenuItem>
                                        </TextField>
                                    </FormControl>
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
                                        rowCount={dataUser.length}
                                    />
                                    <TableBody>
                                        {stableSort(dataUser, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                return (
                                                    <TableRow hover key={index}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{row.profile.full_name}</TableCell>
                                                        <TableCell>{row.profile.gender === 'men' ? 'Nam' : 'Nữ'}</TableCell>
                                                        <TableCell align="right">
                                                            {moment(row.profile.birthday).format('DD-MM-YYYY')}
                                                        </TableCell>
                                                        <TableCell align="right">{row.profile.address}</TableCell>
                                                        <TableCell align="right">
                                                            {(row.role === 0 && 'Nhân viên') || (row.role === 1 && 'Quản lý cửa hàng')}
                                                        </TableCell>
                                                        <TableCell align="right">{row.store.name}</TableCell>
                                                        <TableCell align="right">
                                                            {!row.is_hide ? (
                                                                <Chip label="Đang hoạt động" color="success" />
                                                            ) : (
                                                                <Chip label="Ngưng hoạt động" color="error" />
                                                            )}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton aria-label="edit" size="large" onClick={() => openInPopup(row)}>
                                                                <EditIcon fontSize="inherit" />
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
                                count={dataUser.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                            <Popup title={title} openPopup={openPopup} setOpenPopup={setOpenPopup} onClose={() => setOpenPopup(false)}>
                                <StaffForm storeList={storeList} recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
                            </Popup>
                            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
                        </MainCard>
                    </Stack>
                </ComponentSkeleton>
            </Grid>
        </Grid>
    );
}
