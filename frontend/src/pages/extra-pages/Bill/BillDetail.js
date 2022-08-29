// material-ui
import { Grid, Stack, Typography } from '@mui/material';
// project import
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';

// ==============================|| SAMPLE PAGE ||============================== //
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import { formatCurrency } from 'utils/helper';

const BillDetail = ({ recordForDetail }) => {
    return (
        <ComponentSkeleton>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>
                    <Stack spacing={3}>
                        {/*<MainCard>*/}
                        <Grid container marginBottom={2}>
                            <Grid item xs={6} lg={6}>
                                <Typography variant="h5">
                                    Mã hóa đơn: <Typography variant="body1">{recordForDetail.code}</Typography>
                                </Typography>
                                <Typography variant="h5">
                                    Người lập đơn: <Typography variant="body1">{recordForDetail.cashier.profile.full_name}</Typography>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} lg={6}>
                                <Typography variant="h5">
                                    Ngày lập đơn:
                                    <Typography variant="body1">{moment(recordForDetail.createdAt).format('lll')}</Typography>
                                </Typography>
                                <Typography variant="h5">
                                    Cửa hàng
                                    <Typography variant="body1">{recordForDetail.store.name}</Typography>
                                </Typography>
                            </Grid>
                        </Grid>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell>Mã hàng hóa</TableCell>
                                        <TableCell>Tên hàng hóa</TableCell>
                                        <TableCell>Giá</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                        <TableCell>Tổng</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recordForDetail.merchandises.map((row, index) => (
                                        <TableRow key={row._id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{row.merchandise.code}</TableCell>
                                            <TableCell>{row.merchandise.name}</TableCell>
                                            <TableCell>{formatCurrency(row.price)}</TableCell>
                                            <TableCell>{row.quantity}</TableCell>
                                            <TableCell>{formatCurrency(row.price * row.quantity)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <tr style={{ borderTop: '1pt solid black' }}></tr>
                                    <TableRow style={{ borderTop: '1px solid black' }}>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 'bold' }}>Tổng hóa đơn:</Typography>
                                        </TableCell>
                                        <TableCell>{formatCurrency(recordForDetail.total)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/*</MainCard>*/}
                    </Stack>
                </Grid>
            </Grid>
        </ComponentSkeleton>
    );
};

export default BillDetail;
