import AddIcon from '@mui/icons-material/Add';
import { Autocomplete, Button, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, Stack, TextField } from '@mui/material';
import { Box } from '@mui/system';
import AnimateButton from 'components/@extended/AnimateButton';
import { useEffect, useState } from 'react';
import instance from 'utils/AuthHelpers';
import axios from '../../../utils/axios.config';

const BillForm = (props) => {
    const { recordForEdit, addOrEdit, storeList } = props;
    const [merchandiseList, setMerchandiseList] = useState([]);
    const [store, setStore] = useState('');
    const userInfo = instance.getUserInfo();
    const getMerchandiseList = async () => {
        try {
            const response = await axios.get(`/warehouse/active`);
            if (userInfo.role === 2) {
                const merchandiseOfStore = response.filter((m) => m.store._id === store);
                setMerchandiseList(
                    merchandiseOfStore.map((option) => ({
                        _id: option.merchandise._id,
                        label: option.merchandise.code + ` (${option.merchandise.name})`
                    }))
                );
            } else {
                setMerchandiseList(
                    response.map((option) => ({
                        _id: option.merchandise._id,
                        label: option.merchandise.code + ` (${option.merchandise.name})`
                    }))
                );
            }
        } catch (e) {
            console.log(e.message);
        }
    };
    useEffect(() => {
        getMerchandiseList();
    }, [recordForEdit, store]);
    const [inputFields, setInputFields] = useState([
        {
            merchandise_id: '',
            quantity: 0
        }
    ]);
    const addInputField = () => {
        setInputFields([
            ...inputFields,
            {
                merchandise_id: '',
                quantity: 0
            }
        ]);
    };
    const removeInputFields = (index) => {
        const rows = [...inputFields];
        rows.splice(index, 1);
        setInputFields(rows);
    };
    const handleChange = (index, evnt) => {
        const { name, value } = evnt.target;
        const list = [...inputFields];
        list[index][name] = value;
        setInputFields(list);
    };
    const onSubmit = () => {
        addOrEdit({
            store: store,
            merchandises_detail: inputFields
        });
    };
    return (
        <Box>
            <Grid container spacing={2} mt={2}>
                {userInfo.role === 2 && (
                    <Grid item xs={6}>
                        <Stack spacing={1}>
                            <FormControl variant="outlined">
                                <TextField
                                    select
                                    label="Chi nhánh cửa hàng"
                                    name="store"
                                    value={store}
                                    onChange={(e) => setStore(e.target.value)}
                                >
                                    {storeList.map((s) => (
                                        <MenuItem key={s._id} value={s._id}>
                                            {s.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        </Stack>
                    </Grid>
                )}
                {inputFields.map((data, index) => {
                    const { merchandise_id, quantity } = data;
                    return (
                        <Grid item container xs={10} key={index} alignItems="center">
                            <Grid item xs={6} mr={2}>
                                <Stack spacing={1}>
                                    <FormControl variant="outlined">
                                        <Autocomplete
                                            onChange={(e, value) => {
                                                handleChange(index, { target: { name: 'merchandise_id', value: value._id } });
                                            }}
                                            options={merchandiseList}
                                            sx={{ width: 300 }}
                                            renderInput={(params) => <TextField {...params} label="Hàng hóa" />}
                                        />
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item xs={4}>
                                <Stack spacing={1}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                            InputProps={{ inputProps: { min: 0 } }}
                                            label="Số lượng"
                                            value={quantity}
                                            onChange={(e) =>
                                                handleChange(index, { target: { name: e.target.name, value: +e.target.value } })
                                            }
                                            id="quantity"
                                            type="number"
                                            name="quantity"
                                            placeholder="Enter quantity"
                                            fullWidth
                                        />
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item ml={2} xs={1}>
                                <Stack spacing={1}>
                                    {inputFields.length !== 1 ? (
                                        <Button color="error" variant="contained" size="small" onClick={removeInputFields}>
                                            Remove
                                        </Button>
                                    ) : (
                                        ''
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                    );
                })}
                <Grid item xs={2}>
                    <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={addInputField}>
                        Thêm
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <AnimateButton>
                        <Button disableElevation fullWidth size="large" onClick={() => onSubmit()} variant="contained" color="primary">
                            {recordForEdit ? 'Sửa' : 'Tạo'}
                        </Button>
                    </AnimateButton>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BillForm;
