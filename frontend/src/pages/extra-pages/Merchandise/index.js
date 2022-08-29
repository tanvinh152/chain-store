import { SearchOutlined } from '@ant-design/icons';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
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
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { alert } from 'store/reducers/alert';
import axios from '../../../utils/axios.config';
import MerchandiseForm from './MerchandiseForm';
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
        id: 'code',
        numeric: false,
        disablePadding: true,
        label: 'Mã hàng hóa'
    },
    {
        id: 'name',
        numeric: true,
        disablePadding: false,
        label: 'Tên hàng hóa'
    },
    {
        id: 'category_code',
        numeric: true,
        disablePadding: false,
        label: 'Mã loại hàng hóa'
    },
    {
        id: 'category_name',
        numeric: true,
        disablePadding: false,
        label: 'Tên loại hàng hóa'
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

const Merchandise = () => {
    const dispatch = useDispatch();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('date');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [dataMerchandise, setDataMerchandise] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [categoryList, setCategoryList] = useState([]);
    const [dataSearch, setDataSearch] = useState({
        code: '',
        name: '',
        categoryId: '',
        is_hide: ''
    });
    const [categoryOptions, setCategoryOptions] = useState([]);

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
                await axios.put(`/merchandise/${item._id}`, item);
                await getData();
                setOpenPopup(false);
                dispatch(alert({ success: 'Cập nhật thành công' }));
            } catch (error) {
                setOpenPopup(false);
                dispatch(alert({ error: 'Cập nhật không thành công' }));
            }
        } else {
            try {
                await axios.post(`/merchandise/`, item);
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
        setTitle(item !== null ? 'Sửa hàng hóa' : 'Tạo hàng hóa');
        setRecordForEdit(item);
        setOpenPopup(true);
    };

    const onDelete = (id) => {
        setConfirmDialog({ isOpen: false, ...confirmDialog });
        dispatch(alert({ success: 'Xóa thành công' }));
    };

    const handleInputSearch = (e) => {
        const { name, value } = e.target;
        setDataSearch({ ...dataSearch, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let query = '';
            for (let key in dataSearch) {
                if (dataSearch.hasOwnProperty(key)) {
                    const value = encodeURIComponent(dataSearch[key]);
                    query += `${key}=${value}&`;
                }
            }
            const res = await axios.get(`/merchandise?${query}`);
            setDataMerchandise(res);
        } catch (error) {
            dispatch(alert({ error: 'Không tìm thấy kết quả' }));
        }
    };
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataMerchandise.length) : 0;
    async function getData() {
        const resMerchandise = await axios.get(`/merchandise`);
        const resCategory = await axios.get(`/category`);
        setDataMerchandise(resMerchandise);
        setCategoryList(resCategory);
        setCategoryOptions(resCategory.map((option) => ({ _id: option._id, label: option.code + ` (${option.name})` })));
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
                            <Grid container spacing={3} justifyContent="flex-start" alignItems="center">
                                <Grid item xs={3}>
                                    <FormControl>
                                        <OutlinedInput
                                            name="code"
                                            value={dataSearch.code}
                                            placeholder="Nhập mã hàng hóa"
                                            onChange={handleInputSearch}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                    <FormControl>
                                        <OutlinedInput
                                            name="name"
                                            value={dataSearch.name}
                                            placeholder="Nhập tên hàng hóa"
                                            onChange={handleInputSearch}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                    <FormControl>
                                        <Autocomplete
                                            onChange={(e, value) => {
                                                if (value !== null) {
                                                    setDataSearch({ ...dataSearch, categoryId: value._id });
                                                } else {
                                                    setDataSearch({ ...dataSearch, categoryId: '' });
                                                }
                                            }}
                                            options={categoryOptions}
                                            sx={{ width: 300 }}
                                            renderInput={(params) => <TextField {...params} label="Mã loại hàng hóa" />}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
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
                                            <MenuItem value={false}>Đang bán</MenuItem>
                                            <MenuItem value={true}>Ngưng bán</MenuItem>
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
                                        rowCount={dataMerchandise.length}
                                    />
                                    <TableBody>
                                        {stableSort(dataMerchandise, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                return (
                                                    <TableRow hover key={index}>
                                                        <TableCell>{row.code}</TableCell>
                                                        <TableCell align="right">{row.name}</TableCell>
                                                        <TableCell align="right">{row.category.code}</TableCell>
                                                        <TableCell align="right">{row.category.name}</TableCell>
                                                        <TableCell align="right">
                                                            {!row.is_hide ? (
                                                                <Chip label="Đang bán" color="success" />
                                                            ) : (
                                                                <Chip label="Ngưng bán" color="error" />
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
                                count={dataMerchandise.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                            <Popup title={title} openPopup={openPopup} setOpenPopup={setOpenPopup} onClose={() => setOpenPopup(false)}>
                                <MerchandiseForm categoryList={categoryList} recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
                            </Popup>
                            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
                        </MainCard>
                    </Stack>
                </ComponentSkeleton>
            </Grid>
        </Grid>
    );
};
export default Merchandise;
