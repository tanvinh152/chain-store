import { Autocomplete, Button, FormControl, FormHelperText, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { Box } from '@mui/system';
import AnimateButton from 'components/@extended/AnimateButton';
import Loader from 'components/Loader';
import { Field, Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

const MerchandiseForm = (props) => {
    const { recordForEdit, addOrEdit, categoryList } = props;
    const [isValueLoad, setIsValueLoad] = useState(false);
    const [initialValues, setInitialValues] = useState({
        name: '',
        category: null,
        is_hide: ''
    });
    useEffect(() => {
        if (recordForEdit !== null) {
            setIsValueLoad(true);

            setInitialValues({
                name: recordForEdit.name,
                category: recordForEdit.category,
                _id: recordForEdit._id,
                is_hide: recordForEdit.is_hide
            });
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
                    name: Yup.string().required('Vui lòng nhập tên hàng hóa'),
                    category: Yup.object().required('Vui lòng chọn loại hàng hóa'),
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
                                            label="Tên hàng hóa"
                                            id="name"
                                            type="text"
                                            value={values.name}
                                            name="name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Nhập tên hàng hóa"
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
                                        <Field
                                            component={Autocomplete}
                                            name="category"
                                            options={categoryList}
                                            getOptionLabel={(option) => option.code + ` (${option.name})`}
                                            value={values.category}
                                            onChange={(e, value) => {
                                                setFieldValue('category', value !== null ? value : initialValues.category);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    error={Boolean(touched.category && errors.category)}
                                                    label="Chọn loại hàng cung cấp"
                                                />
                                            )}
                                        />
                                        {touched.category && errors.category && (
                                            <FormHelperText error id="category">
                                                {errors.category}
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
                                            <MenuItem value={false}>Đang bán</MenuItem>
                                            <MenuItem value={true}>Ngưng bán</MenuItem>
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

export default MerchandiseForm;
