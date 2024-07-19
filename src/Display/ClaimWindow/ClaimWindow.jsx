import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

const ClaimWindow = ({open, setOpen}) => {

    const onClose = () => {
        setOpen(false);
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Начать клейм?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <p>
                        Клейм это время которое есть в приложениях что бы вы не забывали заходить в них и собирать монеты или токены.
                        Наш бот помогает вам отслеживать это время и напомнит вам когда и что нужно будет забрать,
                    </p>
                    <p style={{color: "gray", marginTop: 14}}>Команда "Capel Crypto" желает вам удачи</p>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button>Disagree</Button>
                <Button autoFocus>Agree</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ClaimWindow;