import React from 'react';

// material-ui
import { Button, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import instance from '../../../utils/AuthHelpers';
import axios from '../../../utils/axios.config';
import moment from 'moment';
// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
    const [checked, setChecked] = React.useState(false);
    const navigator = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    return (
        <>
            <Formik
                initialValues={{
                    username: '',
                    password: ''
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string()
                        .min(4, 'Mininum 4 characters')
                        .max(30, 'Maximum 30 characters')
                        .required('Vui lòng nhập tên đăng nhập'),
                    password: Yup.string().max(255).required('Vui lòng nhập mật khẩu')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        setSubmitting(true);
                        const response = await axios.post(`/auth/login`, values);
                        const timeStamp = moment();
                        sessionStorage.setItem('lastTimeStamp', timeStamp);
                        instance.storeAccessToken(response.access_token);
                        const res = await axios.get(`/user/me`);
                        await instance.storeUserInfo(res);
                        setStatus({ success: true });
                        navigator('/');
                    } catch (err) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="username-login">Tên đăng nhập</InputLabel>
                                    <OutlinedInput
                                        id="username-login"
                                        type="text"
                                        value={values.username}
                                        name="username"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Nhập tên đăng nhập"
                                        fullWidth
                                        error={Boolean(touched.username && errors.username)}
                                    />
                                    {touched.username && errors.username && (
                                        <FormHelperText error id="standard-weight-helper-text-username-login">
                                            {errors.username}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password-login">Mật khẩu</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="-password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Nhập mật khẩu"
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
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
                                        Đăng nhập
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthLogin;
