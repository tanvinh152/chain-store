import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    TextField
} from '@mui/material';
import { Box } from '@mui/system';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AnimateButton from 'components/@extended/AnimateButton';
import Loader from 'components/Loader';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import instance from 'utils/AuthHelpers';
import * as Yup from 'yup';
import axios from '../../../utils/axios.config';

const StaffForm = (props) => {
    const { recordForEdit, addOrEdit, storeList } = props;
    const [checked, setChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const userInfo = instance.getUserInfo();
    const [isValueLoad, setIsValueLoad] = useState(false);
    const [initialValues, setInitialValues] = useState({
        password: '',
        profile: {
            full_name: '',
            gender: '',
            address: '',
            birthday: null,
            national_id: ''
        },
        role: '',
        store: userInfo.store || '',
        is_hide: ''
    });
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    useEffect(() => {
        if (recordForEdit !== null) {
            setIsValueLoad(true);
            setInitialValues({ ...recordForEdit, store: recordForEdit.store._id, _id: recordForEdit._id });
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
                    username: Yup.string().min(6).max(255).required('Vui l??ng nh???p t??n ????ng nh???p'),
                    password:
                        recordForEdit === null
                            ? Yup.string().min(6).max(16).required('Vui l??ng nh???p m???t kh???u')
                            : Yup.string().min(6).max(16),
                    profile: Yup.object().shape({
                        full_name: Yup.string().max(255).required('Vui l??ng nh???p t??n ?????y ?????'),
                        national_id: Yup.string().max(255).required('Vui l??ng nh???p m?? CCCD'),
                        gender: Yup.string().required('Vui l??ng ch???n gi???i t??nh'),
                        address: Yup.string(),
                        birthday: Yup.string().nullable()
                    }),
                    role: Yup.number().required('Vui l??ng ch???n ch???c v???'),
                    store: userInfo.role === 2 ? Yup.string().required('Vui l??ng ch???n chi nh??nh c???a h??ng') : Yup.string(),
                    is_hide: Yup.boolean().required('Vui l??ng ch???n tr???ng th??i')
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
                                            id="username"
                                            type="text"
                                            value={values.username}
                                            name="username"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="T??n ????ng nh???p"
                                            fullWidth
                                            disabled={recordForEdit !== null}
                                            error={Boolean(touched.username && errors.username)}
                                        />
                                        {touched.username && errors.username && (
                                            <FormHelperText error id="username">
                                                {errors.username}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>
                            </Grid>
                            {recordForEdit === null && (
                                <Grid item xs={6}>
                                    <Stack spacing={1}>
                                        <FormControl variant="outlined">
                                            <InputLabel htmlFor="password-login">M???t kh???u</InputLabel>
                                            <OutlinedInput
                                                label="M???t kh???u"
                                                fullWidth
                                                error={Boolean(touched.password && errors.password)}
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
                                                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                            {touched.password && errors.password && (
                                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                                    {errors.password}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Stack>
                                </Grid>
                            )}
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            id="profile.full_name"
                                            value={values.profile.full_name}
                                            type="text"
                                            name="profile.full_name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="T??n ?????y ?????"
                                            fullWidth
                                            error={Boolean(touched.profile?.full_name && errors.profile?.full_name)}
                                        />
                                        {touched.profile?.full_name && errors.profile?.full_name && (
                                            <FormHelperText error id="full_name">
                                                {errors.profile?.full_name}
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
                                            // id="profile.gender"
                                            name="profile.gender"
                                            value={values.profile.gender}
                                            label="Gi???i t??nh"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            error={Boolean(touched.profile?.gender && errors.profile?.gender)}
                                        >
                                            <MenuItem value="men">Nam</MenuItem>
                                            <MenuItem value="women">N???</MenuItem>
                                        </TextField>
                                        {touched.profile?.gender && errors.profile?.gender && (
                                            <FormHelperText error id="gender">
                                                {errors.profile?.gender}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={1}>
                                        <DatePicker
                                            label="Ng??y sinh"
                                            inputFormat="MM/dd/yyyy"
                                            value={values.profile.birthday}
                                            onChange={(val) => setFieldValue('profile.birthday', val)}
                                            renderInput={(params) => <TextField size="medium" {...params} />}
                                            onError={() => Boolean(touched.profile?.birthday && errors.profile?.birthday)}
                                        />
                                        {touched.profile?.birthday && errors.profile?.birthday && (
                                            <FormHelperText error id="birthday">
                                                {errors.profile?.birthday}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={1}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            // id="address"
                                            value={values.profile.address}
                                            name="profile.address"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="?????a ch???"
                                            fullWidth
                                            error={Boolean(touched.profile?.address && errors.profile?.address)}
                                        />
                                        {touched.profile?.address && errors.profile?.address && (
                                            <FormHelperText error id="address">
                                                {errors.profile?.address}
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
                                            // id="address"
                                            value={values.profile.national_id}
                                            name="profile.national_id"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="CCCD"
                                            fullWidth
                                            error={Boolean(touched.profile?.national_id && errors.profile?.national_id)}
                                        />
                                        {touched.profile?.national_id && errors.profile?.national_id && (
                                            <FormHelperText error id="national_id">
                                                {errors.profile?.national_id}
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
                                            label="Ch???c v???"
                                            // id="profile.role"
                                            name="role"
                                            value={values.role}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            error={Boolean(touched?.role && errors?.role)}
                                        >
                                            <MenuItem value={0}>Nh??n vi??n</MenuItem>
                                            {userInfo.role === 2 && <MenuItem value={1}>Qu???n l?? c???a h??ng</MenuItem>}
                                        </TextField>
                                        {touched?.role && errors?.role && (
                                            <FormHelperText error id="role">
                                                {errors?.role}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>
                            </Grid>
                            {userInfo.role === 2 && (
                                <Grid item xs={6}>
                                    <Stack spacing={1}>
                                        <FormControl variant="outlined">
                                            <TextField
                                                select
                                                label="Chi nh??nh c???a h??ng"
                                                name="store"
                                                value={values.store}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
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
                                            <MenuItem value={false}>??ang ho???t ?????ng</MenuItem>
                                            <MenuItem value={true}>Ng??ng ho???t ?????ng</MenuItem>
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

export default StaffForm;
