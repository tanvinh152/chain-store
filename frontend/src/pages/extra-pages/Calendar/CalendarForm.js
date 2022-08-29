import { Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AnimateButton from 'components/@extended/AnimateButton';
import Loader from 'components/Loader';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';

const CalendarForm = (props) => {
    const { recordForEdit, addOrEdit } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [isValueLoad, setIsValueLoad] = useState(false);
    const [initialValues, setInitialValues] = useState({
        startTime: null,
        endTime: null,
        slot: '',
        subscriber: []
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
                    slot: Yup.number().required('Vui lòng nhập số lượng người trực ca'),
                    startTime: Yup.date().required('Vui lòng nhập ngày').nullable(),
                    endTime: Yup.date().required('Vui lòng nhập ngày').nullable()
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
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={1}>
                                        <DateTimePicker
                                            label="Ngày bắt đầu"
                                            value={values.startTime}
                                            onChange={(val) => setFieldValue('startTime', val)}
                                            renderInput={(params) => (
                                                <TextField
                                                    size="medium"
                                                    {...params}
                                                    error={Boolean(touched.startTime && errors.startTime)}
                                                />
                                            )}
                                        />
                                        {touched.startTime && errors.startTime && (
                                            <FormHelperText error id="startTime">
                                                {errors.startTime}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={1}>
                                        <DateTimePicker
                                            label="Tới"
                                            value={values.endTime}
                                            onChange={(val) => setFieldValue('endTime', val)}
                                            renderInput={(params) => (
                                                <TextField size="medium" {...params} error={Boolean(touched.endTime && errors.endTime)} />
                                            )}
                                        />
                                        {touched.endTime && errors.endTime && (
                                            <FormHelperText error id="endTime">
                                                {errors.endTime}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <FormControl variant="outlined">
                                        <InputLabel htmlFor="slot">Số người trực</InputLabel>
                                        <OutlinedInput
                                            id="slot"
                                            type="number"
                                            value={values.slot}
                                            name="slot"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Nhập số lượng người trực"
                                            fullWidth
                                            error={Boolean(touched.slot && errors.slot ? true : null)}
                                        />
                                        {touched.slot && errors.slot && (
                                            <FormHelperText error id="slot">
                                                {errors.slot}
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

export default CalendarForm;
