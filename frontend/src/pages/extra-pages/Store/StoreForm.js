import {
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormHelperText,
    Grid,
    Link,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
    TextField,
    FormControl,
    Select,
    MenuItem
} from '@mui/material';
import { Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import AnimateButton from 'components/@extended/AnimateButton';
import { Box } from '@mui/system';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Loader from 'components/Loader';

const StaffForm = (props) => {
    const { recordForEdit, addOrEdit } = props;
    const [checked, setChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const [isValueLoad, setIsValueLoad] = useState(false);
    const [initialValues, setInitialValues] = useState({
        address: '',
        phone_number: '',
        name: '',
        is_hide: ''
    });
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    useEffect(() => {
        if (recordForEdit !== null) {
            setIsValueLoad(true);
            setInitialValues({ ...recordForEdit });
        }
        setIsValueLoad(true);
    }, [recordForEdit]);
    return !isValueLoad ? (
        <Loader />
    ) : (
        <Box>
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                    address: Yup.string().required('Vui lòng nhập địa chỉ'),
                    phone_number: Yup.string().required('Vui lòng nhập số điện thoại'),
                    name: Yup.string().required('Vui lòng nhập tên cửa hàng'),
                    is_hide: Yup.bool().required('Vui lòng chọn trạng thái')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        setSubmitting(true);
                        await addOrEdit(values);
                        setStatus({ success: true });
                    } catch (err) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3} paddingTop={2}>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            id="name"
                                            type="text"
                                            value={values.name}
                                            name="name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Tên cửa hàng"
                                            fullWidth
                                            error={Boolean(touched.name && errors.name)}
                                        />
                                        {touched.name && errors.name && (
                                            <FormHelperText error id="name">
                                                {errors.name}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            id="address"
                                            type="text"
                                            value={values.address}
                                            name="address"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Địa chỉ"
                                            fullWidth
                                            error={Boolean(touched.address && errors.address)}
                                        />
                                        {touched.address && errors.address && (
                                            <FormHelperText error id="address">
                                                {errors.address}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            id="phone_number"
                                            type="text"
                                            value={values.phone_number}
                                            name="phone_number"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Số điện thoại"
                                            fullWidth
                                            error={Boolean(touched.phone_number && errors.phone_number)}
                                        />
                                        {touched.phone_number && errors.phone_number && (
                                            <FormHelperText error id="phone_number">
                                                {errors.phone_number}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            select
                                            name="is_hide"
                                            value={values.is_hide}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Trạng thái"
                                            error={Boolean(touched.is_hide && errors.is_hide)}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={false}>Đang hoạt động</MenuItem>
                                            <MenuItem value={true}>Ngưng hoạt động</MenuItem>
                                        </TextField>
                                        {touched.is_hide && errors.is_hide && (
                                            <FormHelperText error id="is_hide">
                                                {errors.is_hide}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>
                            </Grid>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        {recordForEdit ? 'Sửa' : 'Tạo'}
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default StaffForm;
