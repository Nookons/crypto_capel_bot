import React, {useEffect, useState} from 'react';
import './Main.css'
import {collection, query, where, onSnapshot} from "firebase/firestore";
import {Link, useNavigate} from "react-router-dom";
import {POST_PAGE_ROUTE} from "../utils/Routes";
import {db} from "../firebase";
import {
    Avatar, Box,
    Button, ButtonGroup, Chip, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Divider, Drawer, FormControlLabel, FormGroup, Rating, Stack, Switch,
    ToggleButton,
    ToggleButtonGroup, Typography
} from "@mui/material";
import {FormatAlignCenter, FormatAlignJustify, FormatAlignLeft, FormatAlignRight} from "@mui/icons-material";

import FavoriteIcon from '@mui/icons-material/Favorite';

import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';


const Main = () => {
    const [projectsData, setProjectsData] = useState([]);
    const [dialogItem, setDialogItem] = useState();

    const [isDialog, setIsDialog] = useState({
        isOpen: false,
        id: 0,
    });

    const [alignment, setAlignment] = React.useState('web');

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (id) => {
        setIsDialog({isOpen: true, id: id});
    };
    const handleClose = () => {
        setIsDialog(prevState => ({...prevState, isOpen: false}));
    };

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
        handleClose();
    };

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    useEffect(() => {
        if (isDialog.id) {
            const founded = projectsData.find(item => item.id === isDialog.id)
            setDialogItem(founded);
        }
    }, [isDialog]);

    useEffect(() => {
        const path = query(collection(db, "projects"));

        const unsubscribe = onSnapshot(path, (querySnapshot) => {
            const projects = [];
            querySnapshot.forEach((doc) => {
                projects.push(doc.data());
            });
            setProjectsData(projects);
        });
    }, []);

    const onProjectClick = (link) => {
        window.location.href = link;
        toggleDrawer(false);
    }

    if (!projectsData.length) {
        return (
            <div className={"snackbar"}>

            </div>
        )
    }

    const DrawerList = (
        <Box sx={{ width: "100%", p: 1, height: "100dvh"}} role="presentation" onClick={toggleDrawer(false)}>
            <Avatar sx={{width: "100%", height: 158}} variant={"rounded"} src={dialogItem?.imgPath}>N</Avatar>
            <Stack
                my={1}
                direction="row"
                divider={<Divider orientation="vertical" flexItem/>}
                spacing={2}
                sx={{alignItems: "center"}}
            >
                <h4>{dialogItem?.name}</h4>
                <Box style={{display: "flex", gap: 4}}><FavoriteIcon fontSize={"small"}/> <p>{dialogItem?.likes.toLocaleString()}</p></Box>
                <Rating value={4} readOnly name="simple-controlled"/>
            </Stack>
            <br/>
            <p>{dialogItem?.description}</p>
            <ButtonGroup
                variant={"outlined"}
                aria-label="outlined primary button group"
                size={"small"} color={"secondary"} sx={{my: 2}}>

                <Button><BookmarkAddIcon /></Button>
                <Button><ThumbUpIcon /></Button>
                <Button><ThumbDownIcon /></Button>
            </ButtonGroup>
            <Typography sx={{position: "fixed", bottom: 0, left: 0, right: 0, p: 1}} variant="caption" display="block" gutterBottom>
                <p style={{color: "gray"}}>Created: {dialogItem?.createdTime}</p>
                <p style={{color: "gray"}}>Updated: {dialogItem?.updatedTime}</p>
            </Typography>
        </Box>
    );

    return (
        <div>
            <Drawer sx={{width: "100%"}} open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
            <div style={{
                margin: "14px 0",
                display: "flex",
                flexWrap: "wrap",
                gap: 4
            }}>
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                    size={"small"}>

                    <ToggleButton value="web"><p>Launch</p></ToggleButton>
                    <ToggleButton value="android"><p>Favorite</p></ToggleButton>
                    <ToggleButton value="ios"><p>News</p></ToggleButton>
                </ToggleButtonGroup>
            </div>
            {isDialog.isOpen &&
                <Dialog
                    open={true}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2
                    }} id="alert-dialog-title">
                        <Avatar sx={{
                            width: 75,
                            height: 75
                        }} src={dialogItem?.imgPath}>N</Avatar>
                        <h3>{dialogItem?.name}</h3>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <div style={{
                                display: "flex",
                                gap: 8,
                                flexWrap: "wrap"
                            }}>
                                <Chip label="Coin" variant="outlined" size={"small"}/>
                                <Chip label="Solana" variant="outlined" size={"small"}/>
                            </div>
                            <br/>
                            <p>{dialogItem?.description}</p>
                            <br/>
                            <p>{dialogItem?.updatedTime}</p>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleDrawer(true)}>More</Button>
                        <Button onClick={() => onProjectClick(dialogItem.link)} variant="contained" sx={{my: 2}}>
                            Launch
                        </Button>
                    </DialogActions>
                </Dialog>


            }
            <div className={"Display"}>
                {projectsData.map((el, index) => {

                    return (
                        <div
                            style={{
                                background: `url(${el.imgPath})`
                            }}
                            onClick={() => handleClickOpen(el.id)}
                            key={index}
                        >
                            {/*<img alt={el.name} src={el.imgPath}/>*/}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Main;