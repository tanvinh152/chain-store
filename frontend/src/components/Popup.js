import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

const Popup = (props) => {
    const { title, children, openPopup, setOpenPopup, onClose } = props;
    return (
        <Dialog maxWidth="md" open={openPopup} onClose={onClose} fullWidth>
            <DialogTitle>
                <div>
                    <Typography variant="h4" component="div">
                        {title}
                    </Typography>
                </div>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>{children}</DialogContent>
        </Dialog>
    );
};

export default Popup;
