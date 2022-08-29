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
import { Box } from '@mui/system';
import AnimateButton from 'components/@extended/AnimateButton';
import Loader from 'components/Loader';
import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import axios from '../../../utils/axios.config';
const SupplierForm = (props) => {
    const { recordForEdit, addOrEdit } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [isValueLoad, setIsValueLoad] = useState(false);
    const [initialValues, setInitialValues] = useState({
        name: '',
        category_id: [],
        phone_number: '',
        address: '',
        is_hide: ''
    });
    const getCategoryList = async () => {
        try {
            const response = await axios.get(`/category`);
            setCategoryList(response);
        } catch (e) {
            console.log(e.message);
        }
    };
    useEffect(() => {
        if (recordForEdit !== null) {
            setIsValueLoad(true);
            setInitialValues({
                name: recordForEdit.name,
                category_id: recordForEdit.category,
                phone_number: recordForEdit.phone_number,
                address: recordForEdit.address,
                _id: recordForEdit._id,
                is_hide: recordForEdit.is_hide
            });
        }
        getCategoryList();
        setIsValueLoad(true);
    }, [recordForEdit]);
    return !isValueLoad ? (
        <Loader />
    ) : (
        <Box>
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                    name: Yup.string().required('Vui lòng nhập tên nhà cung cấp'),
                    address: Yup.string().required('Vui lòng nhập địa chỉ'),
                    phone_number: Yup.string().required('Vui lòng nhập số điện thoại'),
                    category_id: Yup.array().min(1, 'Vui lòng chọn loại hàng hóa cung cấp').required(),
                    is_hide: Yup.boolean().required('Vui lòng chọn trạng thái')
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
                                            label="Tên nhà cung cấp"
                                            fullWidth
                                            error={Boolean(touched.name && errors.name ? true : null)}
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
                                            label="Địa chỉ"
                                            id="address"
                                            type="text"
                                            value={values.address}
                                            name="address"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            fullWidth
                                            error={Boolean(touched.address && errors.address ? true : null)}
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
                                            label="Số điện thoại"
                                            name="phone_number"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            fullWidth
                                            error={Boolean(touched.phone_number && errors.phone_number ? true : null)}
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
                                            <MenuItem value={false}>Đang hợp tác</MenuItem>
                                            <MenuItem value={true}>Ngưng hợp tác</MenuItem>
                                        </TextField>
                                        {touched.is_hide && errors.is_hide && (
                                            <FormHelperText error id="is_hide">
                                                {errors.is_hide}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <Form>
                                        <Field
                                            component={Autocomplete}
                                            name="category_id"
                                            multiple
                                            id="tags-outlined"
                                            options={categoryList}
                                            value={values.category_id}
                                            getOptionLabel={(option) => option.name}
                                            filterSelectedOptions
                                            onChange={(e, value) => {
                                                setFieldValue('category_id', value !== null ? value : initialValues.category_id);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    error={Boolean(touched.category_id && errors.category_id)}
                                                    label="Loại hàng cung cấp"
                                                />
                                            )}
                                        />
                                        {touched.category_id && errors.category_id && (
                                            <FormHelperText error id="category_id">
                                                {errors.category_id}
                                            </FormHelperText>
                                        )}
                                    </Form>
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
SupplierForm.propTypes = {
    recordForEdit: PropTypes.object,
    addOrEdit: PropTypes.func
};
export default SupplierForm;
