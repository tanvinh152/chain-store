import {
    Autocomplete,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    TextField
} from '@mui/material';
import { responsiveProperty } from '@mui/material/styles/cssUtils';
import { Box } from '@mui/system';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AnimateButton from 'components/@extended/AnimateButton';
import Loader from 'components/Loader';
import { Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import instance from 'utils/AuthHelpers';
import * as Yup from 'yup';
import axios from '../../../utils/axios.config';

const WarehouseForm = (props) => {
    const { recordForEdit, addOrEdit, storeList } = props;
    const [merchandiseList, setMerchandiseList] = useState([]);
    const [supplierList, setSupplierList] = useState([]);
    const [merchandise, setMerchandise] = useState('');
    const [isValueLoad, setIsValueLoad] = useState(false);
    const [storeId, setStoreId] = useState('');
    const userRole = instance.getUserInfo();
    const [initialValues, setInitialValues] = useState({
        supplier: null,
        merchandise: null,
        quantity: 0,
        unit_cost: 0,
        price: 0,
        expired_date: null,
        input_date: null,
        store: '',
        is_hide: ''
    });
    const getMerchandiseList = async () => {
        try {
            const response = await axios.get(`/merchandise/active`);
            setMerchandiseList(response);
        } catch (e) {
            console.log(e.message);
        }
    };
    const getSupplierList = async () => {
        try {
            if (merchandise) {
                const res = await axios.get(`/merchandise/${merchandise}`);
                const response = await axios.get(`/supplier/${res.category._id}`);
                setSupplierList(response);
            }
        } catch (e) {
            console.log(e.message);
        }
    };
    useEffect(() => {
        if (recordForEdit !== null) {
            setIsValueLoad(true);
            setInitialValues({
                supplier: recordForEdit.supplier,
                merchandise: recordForEdit.merchandise,
                quantity: recordForEdit.quantity,
                unit_cost: recordForEdit.unit_cost,
                price: recordForEdit.price,
                expired_date: recordForEdit.expired_date,
                input_date: recordForEdit.input_date,
                _id: recordForEdit._id,
                store: recordForEdit.store._id,
                is_hide: recordForEdit.is_hide
            });
            setMerchandise(recordForEdit.merchandise._id);
        }
        getMerchandiseList();
        setIsValueLoad(true);
    }, [recordForEdit]);
    useEffect(() => {
        getSupplierList();
    }, [merchandise]);
    return !isValueLoad ? (
        <Loader />
    ) : (
        <Box>
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                    supplier: Yup.object().required('Vui l??ng ch???n nh?? cung c???p'),
                    merchandise: Yup.object().required('Vui l??ng ch???n h??ng h??a'),
                    store: Yup.string().required('Vui l??ng ch???n chi nh??nh c???a h??ng'),
                    quantity: Yup.number().required('Vui l??ng nh???p s??? l?????ng'),
                    unit_cost: Yup.number().required('Vui l??ng nh???p gi?? nh???p'),
                    price: Yup.number().required('Vui l??ng nh???p gi?? b??n'),
                    expired_date: Yup.date().required('Vui l??ng nh???p ng??y h???t h???n').nullable(),
                    input_date: Yup.date().required('Vui l??ng nh???p ng??y nh???p').nullable()
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
                            {userRole.role === 2 && (
                                <Grid item xs={6}>
                                    <Stack spacing={1}>
                                        <FormControl variant="outlined">
                                            <TextField
                                                select
                                                label="Chi nh??nh c???a h??ng"
                                                name="store"
                                                value={values.store}
                                                onBlur={handleBlur}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setStoreId(e.target.value);
                                                }}
                                                error={Boolean(touched?.store && errors?.store)}
                                            >
                                                {storeList.map((s) => (
                                                    <MenuItem key={s._id} value={s._id}>
                                                        {s.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            {touched?.store && errors?.store && (
                                                <FormHelperText error id="store">
                                                    {errors?.store}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Stack>
                                </Grid>
                            )}
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <FormControl variant="outlined">
                                        <Field
                                            component={Autocomplete}
                                            name="merchandise"
                                            options={merchandiseList}
                                            getOptionLabel={(option) => option.code + ` (${option.name})`}
                                            value={values.merchandise}
                                            onChange={(e, value) => {
                                                setFieldValue('merchandise', value !== null ? value : initialValues.merchandise);
                                                setMerchandise(value._id);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    error={Boolean(touched.merchandise && errors.merchandise)}
                                                    label="Ch???n h??ng h??a"
                                                />
                                            )}
                                        />
                                        {touched.merchandise && errors.merchandise && (
                                            <FormHelperText error id="merchandise">
                                                {errors.merchandise}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <FormControl variant="outlined">
                                        <Field
                                            component={Autocomplete}
                                            name="supplier"
                                            options={supplierList}
                                            getOptionLabel={(option) => option.name}
                                            value={values.supplier}
                                            onChange={(e, value) => {
                                                setFieldValue('supplier', value !== null ? value : initialValues.supplier);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    error={Boolean(touched.supplier && errors.supplier)}
                                                    label="Ch???n nh?? cung c???p"
                                                />
                                            )}
                                        />
                                        {touched.supplier && errors.supplier && (
                                            <FormHelperText error id="supplier">
                                                {errors.supplier}
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
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                            InputProps={{ inputProps: { min: 0 } }}
                                            id="quantity"
                                            type="number"
                                            value={values.quantity}
                                            name="quantity"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="S??? l?????ng"
                                            fullWidth
                                            error={Boolean(touched.quantity && errors.quantity ? true : null)}
                                        />
                                        {touched.quantity && errors.quantity && (
                                            <FormHelperText error id="quantity">
                                                {errors.quantity}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                            InputProps={{ inputProps: { min: 0 } }}
                                            id="unit_cost"
                                            type="number"
                                            value={values.unit_cost}
                                            name="unit_cost"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Gi?? nh???p"
                                            fullWidth
                                            error={Boolean(touched.unit_cost && errors.unit_cost ? true : null)}
                                        />
                                        {touched.unit_cost && errors.unit_cost && (
                                            <FormHelperText error id="unit_cost">
                                                {errors.unit_cost}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                            InputProps={{ inputProps: { min: 0 } }}
                                            id="price"
                                            type="number"
                                            value={values.price}
                                            name="price"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Gi?? b??n"
                                            fullWidth
                                            error={Boolean(touched.price && errors.price ? true : null)}
                                        />
                                        {touched.price && errors.price && (
                                            <FormHelperText error id="price">
                                                {errors.price}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={1}>
                                        <DateTimePicker
                                            label="Ng??y nh???p"
                                            value={values.input_date}
                                            onChange={(val) => setFieldValue('input_date', val)}
                                            renderInput={(params) => (
                                                <TextField
                                                    size="medium"
                                                    {...params}
                                                    error={Boolean(touched.input_date && errors.input_date)}
                                                />
                                            )}
                                        />
                                        {touched.input_date && errors.input_date && (
                                            <FormHelperText error id="input_date">
                                                {errors.input_date}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={1}>
                                        <DateTimePicker
                                            label="Ng??y h???t h???n"
                                            value={values.expired_date}
                                            onChange={(val) => setFieldValue('expired_date', val)}
                                            renderInput={(params) => (
                                                <TextField
                                                    size="medium"
                                                    {...params}
                                                    error={Boolean(touched.expired_date && errors.expired_date)}
                                                />
                                            )}
                                        />
                                        {touched.expired_date && errors.expired_date && (
                                            <FormHelperText error id="expired_date">
                                                {errors.expired_date}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </LocalizationProvider>
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
                                            label="Tr???ng th??i"
                                            error={Boolean(touched.is_hide && errors.is_hide)}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={false}>??ang s??? d???ng</MenuItem>
                                            <MenuItem value={true}>Ng??ng s??? d???ng</MenuItem>
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
                                        {recordForEdit ? 'S???a' : 'T???o'}
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

export default WarehouseForm;
