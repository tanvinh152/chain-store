import React from 'react';
import { Dialog, Typography, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';
const ConfirmDialog = (props) => {
    const { title, subTitle, color, confirmDialog, setConfirmDialog } = props;
    return (
        <Dialog open={confirmDialog.isOpen}>
            <DialogTitle>
                <Typography variant="h4">{confirmDialog.title}</Typography>
            </DialogTitle>
            <DialogContent>
                <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} variant="contained" color="inherit">
                    No
                </Button>
                <Button variant="contained" color="error" onClick={confirmDialog.onConfirm}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
