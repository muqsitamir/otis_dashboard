import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { useDispatch, useSelector} from 'react-redux';
import {selectSiteData} from "./site_data/siteDataSlice";
import {resetSnackBar} from "./site_data/siteDataSlice";


export default function MessageSnackbar () {
    const dispatch = useDispatch();
    const { show, message } = useSelector(selectSiteData);
    const handleClose = () => {
        dispatch(resetSnackBar);
    };

    const handleRequestClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch(resetSnackBar);
    };

    return (
        <Snackbar
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
            }}
            open={show}
            autoHideDuration={3000}
            onRequestClose={handleRequestClose}
            variant={"success"}
            message={message}
            onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" variant="filled" elevation={6}>
                {message}
            </Alert>
        </Snackbar>

    );
}


