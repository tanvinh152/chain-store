import { SearchOutlined } from '@ant-design/icons';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {
    Autocomplete,
    Box,
    Button,
    Chip,
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
import { formatCurrency } from 'utils/helper';
import axios from '../../../utils/axios.config';
import WarehouseForm from './WarehouseForm';
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

const headCellOfAdmin = [
    {
        id: 'code',
        numeric: false,
        disablePadding: true,
        label: 'Mã kho hàng hóa'
    },
    {
        id: 'code_merchandise',
        numeric: true,
        disablePadding: false,
        label: 'Mã hàng hóa'
    },
    {
        id: 'name_merchandise',
        numeric: true,
        disablePadding: false,
        label: 'Tên hàng hóa'
    },
    {
        id: 'quantity',
        numeric: true,
        disablePadding: false,
        label: 'Số lượng'
    },
    {
        id: 'supplier',
        numeric: true,
        disablePadding: false,
        label: 'Nhà cung cấp'
    },
    {
        id: 'unit_cost',
        numeric: true,
        disablePadding: false,
        label: 'Giá nhập'
    },
    {
        id: 'price',
        numeric: true,
        disablePadding: false,
        label: 'Giá bán'
    },
    {
        id: 'input_date',
        numeric: true,
        disablePadding: false,
        label: 'Ngày nhập hàng'
    },
    {
        id: 'expired_date',
        numeric: true,
        disablePadding: false,
        label: 'Ngày hết hạn'
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Trạng thái'
    }
];
const headCellsOfManager = [
    {
        id: 'code',
        numeric: false,
        disablePadding: true,
        label: 'Mã kho hàng hóa'
    },
    {
        id: 'code_merchandise',
        numeric: true,
        disablePadding: false,
        label: 'Mã hàng hóa'
    },
    {
        id: 'name_merchandise',
        numeric: true,
        disablePadding: false,
        label: 'Tên hàng hóa'
    },
    {
        id: 'quantity',
        numeric: true,
        disablePadding: false,
        label: 'Số lượng'
    },
    {
        id: 'supplier',
        numeric: true,
        disablePadding: false,
        label: 'Nhà cung cấp'
    },
    {
        id: 'unit_cost',
        numeric: true,
        disablePadding: false,
        label: 'Giá nhập'
    },
    {
        id: 'price',
        numeric: true,
        disablePadding: false,
        label: 'Giá bán'
    },
    {
        id: 'input_date',
        numeric: true,
        disablePadding: false,
        label: 'Ngày nhập hàng'
    },
    {
        id: 'expired_date',
        numeric: true,
        disablePadding: false,
        label: 'Ngày hết hạn'
    },
    {
        id: 'store',
        numeric: true,
        disablePadding: false,
        label: 'Tên cửa hàng'
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Trạng thái'
    }
];
const user = instance.getUserInfo();
function EnhancedTableHead(props) {
    const { order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    if (user.role === 2) {
        return (
            <TableHead>
                <TableRow>
                    {headCellsOfManager.map((headCell) => (
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
    } else {
        return (
            <TableHead>
                <TableRow>
                    {headCellOfAdmin.map((headCell) => (
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
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

const Warehouse = () => {
    const dispatch = useDispatch();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('date');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [dataWarehouse, setDataWarehouse] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [storeList, setStoreList] = useState([]);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
    const [title, setTitle] = useState('');
    const [merchandiseList, setMerchandiseList] = useState([]);
    const [supplierList, setSupplierList] = useState([]);
    const [merchandiseSelect, setMerchandiseSelect] = useState('');
    const [dataSearch, setDataSearch] = useState({
        code: '',
        merchandiseId: '',
        storeId: '',
        supplierId: '',
        is_hide: ''
    });
    const user = instance.getUserInfo();
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

    const addOrEdit = async (item) => {
        if (item._id) {
            try {
                await axios.put(`/warehouse/${item._id}`, item);
                await getData();
                setOpenPopup(false);
                dispatch(alert({ success: 'Cập nhật thành công' }));
            } catch (error) {
                setOpenPopup(false);
                dispatch(alert({ error: 'Cập nhật không thành công' }));
            }
        } else {
            try {
                await axios.post(`/warehouse/`, item);
                await getData();
                setOpenPopup(false);
                dispatch(alert({ success: 'Thêm thành công' }));
            } catch (error) {
                setOpenPopup(false);
                dispatch(alert({ error: 'Thêm không thành công' }));
            }
        }
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
                    const value = encodeURIComponent(dataSearch[key]);
                    query += `${key}=${value}&`;
                }
            }
            const res = await axios.get(`/warehouse?${query}`);
            setDataWarehouse(res);
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
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataWarehouse.length) : 0;
    async function getData() {
        const resWarehouse = await axios.get(`/warehouse`);
        const resStore = await axios.get(`store/active`);
        const resMerchandise = await axios.get(`/merchandise`);
        // const resSupplier = await axios.get(`/supplier/${resMerchandise.category._id}`);
        setDataWarehouse(resWarehouse);
        setStoreList(resStore);
        setMerchandiseList(resMerchandise.map((option) => ({ _id: option._id, label: option.code + ` (${option.name})` })));

        setIsLoading(false);
    }
    const getSupplierList = async () => {
        try {
            if (merchandiseSelect) {
                const res = await axios.get(`/merchandise/${merchandiseSelect}`);
                const response = await axios.get(`/supplier/${res.category._id}`);
                setSupplierList(response.map((option) => ({ _id: option._id, label: option.name })));
            }
        } catch (e) {
            console.log(e.message);
        }
    };
    useEffect(() => {
        let mounted = true;

        if (mounted) {
            getData();
        }
        return function cleanup() {
            mounted = false;
        };
    }, []);
    useEffect(() => {
        getSupplierList();
    }, [merchandiseSelect]);

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
                                            name="code"
                                            value={dataSearch.code}
                                            placeholder="Nhập mã kho"
                                            onChange={handleInputSearch}
                                        />
                                    </FormControl>
                                </Grid>
                                {user.role === 2 && (
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
                                            <MenuItem value={false}>Đang sử dụng</MenuItem>
                                            <MenuItem value={true}>Ngưng sử dụng</MenuItem>
                                        </TextField>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl>
                                        <Autocomplete
                                            onChange={(e, value) => {
                                                if (value !== null) {
                                                    setDataSearch({ ...dataSearch, merchandiseId: value._id });
                                                    setMerchandiseSelect(value._id);
                                                } else {
                                                    setDataSearch({ ...dataSearch, merchandiseId: '' });
                                                }
                                            }}
                                            options={merchandiseList}
                                            sx={{ width: 300 }}
                                            renderInput={(params) => <TextField {...params} label="Hàng hóa" />}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl>
                                        <Autocomplete
                                            onChange={(e, value) => {
                                                if (value !== null) {
                                                    setDataSearch({ ...dataSearch, supplierId: value._id });
                                                } else {
                                                    setDataSearch({ ...dataSearch, supplierId: '' });
                                                }
                                            }}
                                            options={supplierList}
                                            sx={{ width: 300 }}
                                            renderInput={(params) => <TextField {...params} label="Nhà cung cấp" />}
                                        />
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
                                        rowCount={dataWarehouse.length}
                                    />
                                    <TableBody>
                                        {stableSort(dataWarehouse, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                return (
                                                    <TableRow hover key={index}>
                                                        <TableCell>{row.code}</TableCell>
                                                        <TableCell align="right">{row.merchandise.code}</TableCell>
                                                        <TableCell align="right">{row.merchandise.name}</TableCell>
                                                        <TableCell align="right">{row.quantity}</TableCell>
                                                        <TableCell align="right">{row.supplier.name}</TableCell>
                                                        <TableCell align="right">{formatCurrency(row.unit_cost)}</TableCell>
                                                        <TableCell align="right">{formatCurrency(row.price)}</TableCell>
                                                        <TableCell align="right">{moment(row.input_date).format('DD-MM-YYYY')}</TableCell>
                                                        <TableCell align="right">{moment(row.expired_date).format('DD-MM-YYYY')}</TableCell>
                                                        {user.role === 2 && <TableCell align="right">{row.store.name}</TableCell>}
                                                        <TableCell align="right">
                                                            {!row.is_hide ? (
                                                                <Chip label="Đang sử dụng" color="success" />
                                                            ) : (
                                                                <Chip label="Ngưng sử dụng" color="error" />
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
                                count={dataWarehouse.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                            <Popup title={title} openPopup={openPopup} setOpenPopup={setOpenPopup} onClose={() => setOpenPopup(false)}>
                                <WarehouseForm storeList={storeList} recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
                            </Popup>
                            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
                        </MainCard>
                    </Stack>
                </ComponentSkeleton>
            </Grid>
        </Grid>
    );
};
export default Warehouse;
