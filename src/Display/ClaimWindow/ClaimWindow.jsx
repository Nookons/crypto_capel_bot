import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import startClaim from "../../utils/Claim/StartClaim";
import {useSelector} from "react-redux";

const ClaimWindow = ({open, setOpen}) => {
    const user = useSelector((state) => state.user)

    const onClose = () => {
        setOpen({
            isOpen: false,
            currentItem: {}
        });
    }

    const onStartClaim = async () => {
        try {
            const currentItem = open.currentItem
            const response = await startClaim({currentItem, user})
        } catch (err) {
            console.log(err);
        } finally {
            setOpen({
                isOpen: false,
                currentItem: {}
            });
        }
    }

    return (
        <Dialog
            open={open.isOpen}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {`Начать клейм ${open.currentItem.name}?`}
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
                <Button onClick={onClose}>Disagree</Button>
                <Button onClick={onStartClaim} autoFocus>Agree</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ClaimWindow;