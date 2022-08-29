import { Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, TextField } from '@mui/material';
import { Box } from '@mui/system';
import AnimateButton from 'components/@extended/AnimateButton';
import Loader from 'components/Loader';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

const CategoryForm = (props) => {
    const { recordForEdit, addOrEdit } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [isValueLoad, setIsValueLoad] = useState(false);
    const [initialValues, setInitialValues] = useState({
        name: ''
    });
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
                    name: Yup.string().required('Vui lòng nhập tên loại hàng hóa')
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
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            label="Tên loại hàng hóa"
                                            id="name"
                                            type="text"
                                            value={values.name}
                                            name="name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Nhập tên loại hàng hóa"
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

export default CategoryForm;
