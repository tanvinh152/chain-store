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
    OutlinedInput,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel
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
import CategoryForm from './CategoryForm';
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
        label: 'M?? lo???i h??ng h??a'
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'T??n lo???i h??ng h??a'
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

const Category = () => {
    const dispatch = useDispatch();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('date');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [dataCalendar, setDataCalendar] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [title, setTitle] = useState('');
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [valueSearch, setValueSearch] = useState('');
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [filterDataCategory, setFilterDataCategory] = useState([]);

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
                await axios.put(`/category/${item._id}`, { name: item.name });
                await getData();
                setOpenPopup(false);
                dispatch(alert({ success: 'C???p nh???t th??nh c??ng' }));
            } catch (error) {
                setOpenPopup(false);
                dispatch(alert({ error: 'C???p nh???t kh??ng th??nh c??ng' }));
            }
        } else {
            try {
                await axios.post(`/category/`, item);
                await getData();
                setOpenPopup(false);
                dispatch(alert({ success: 'Th??m th??nh c??ng' }));
            } catch (error) {
                setOpenPopup(false);
                dispatch(alert({ error: 'Th??m kh??ng th??nh c??ng' }));
            }
        }
    };

    const openInPopup = (item = null) => {
        setTitle(item !== null ? 'S???a lo???i h??ng h??a' : 'T???o lo???i h??ng h??a');
        setRecordForEdit(item);
        setOpenPopup(true);
    };

    const onDelete = async (id) => {
        try {
            await axios.delete(`/category/${id}`);
            setConfirmDialog({ isOpen: false, ...confirmDialog });
            dispatch(alert({ success: 'X??a th??nh c??ng' }));
        } catch (error) {
            setConfirmDialog({ isOpen: false, ...confirmDialog });
            dispatch(alert({ error: 'X??a kh??ng th??nh c??ng' }));
        }
    };
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataCalendar.length) : 0;

    async function getData() {
        const response = await axios.get(`/category`);
        setDataCalendar(response);
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
    useEffect(() => {
        setFilterDataCategory(dataCalendar.filter((u) => u.name.toLowerCase().includes(valueSearch.toLowerCase())));
    }, [valueSearch, dataCalendar]);

    return (
        <ComponentSkeleton isLoadingPage={isLoading}>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>
                    <Stack spacing={3}>
                        <MainCard>
                            <Box sx={{ width: '100%', ml: { xs: 0, md: 1 }, justifyContent: 'space-between', display: 'flex' }}>
                                <FormControl sx={{ width: { xs: '100%', md: 300 } }}>
                                    <OutlinedInput
                                        size="small"
                                        id="header-search"
                                        endAdornment={
                                            <InputAdornment position="end" sx={{ mr: -0.5 }}>
                                                <SearchOutlined />
                                            </InputAdornment>
                                        }
                                        aria-describedby="header-search-text"
                                        inputProps={{
                                            'aria-label': 'weight'
                                        }}
                                        placeholder="Nh???p t??n"
                                        onChange={(e) => setValueSearch(e.target.value)}
                                    />
                                </FormControl>
                                <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openInPopup()}>
                                    Th??m
                                </Button>
                            </Box>
                            <TableContainer>
                                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                                    <EnhancedTableHead
                                        numSelected={selected.length}
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                        rowCount={filterDataCategory.length}
                                    />
                                    <TableBody>
                                        {stableSort(filterDataCategory, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                return (
                                                    <TableRow hover key={index}>
                                                        <TableCell>{row?.code}</TableCell>
                                                        <TableCell>{row?.name}</TableCell>
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
                                count={filterDataCategory.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                            <Popup title={title} openPopup={openPopup} setOpenPopup={setOpenPopup} onClose={() => setOpenPopup(false)}>
                                <CategoryForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
                            </Popup>
                            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
                        </MainCard>
                    </Stack>
                </Grid>
            </Grid>
        </ComponentSkeleton>
    );
};
export default Category;
