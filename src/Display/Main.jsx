import React, {useEffect, useState} from 'react';
import './Main.css'
import {collection, query, where, onSnapshot} from "firebase/firestore";
import {Link, useNavigate} from "react-router-dom";
import {POST_PAGE_ROUTE} from "../utils/Routes";
import {db} from "../firebase";
import {
    Avatar,
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import {FormatAlignCenter, FormatAlignJustify, FormatAlignLeft, FormatAlignRight} from "@mui/icons-material";


const Main = () => {
    const [projectsData, setProjectsData] = useState([]);
    const [dialogItem, setDialogItem] = useState();

    const [isDialog, setIsDialog] = useState({
        isOpen: false,
        id: 0,
    });

    const [alignment, setAlignment] = React.useState('web');

    const [open, setOpen] = React.useState(true);

    const handleClickOpen = (id) => {
        setIsDialog({isOpen: true, id: id});
    };
    const handleClose = () => {
        setIsDialog(prevState => ({...prevState, isOpen: false}));
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
    }

    if (!projectsData.length) {
        return (
            <div className={"snackbar"}>

            </div>
        )
    }

    return (
        <div>
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
                            <p>{dialogItem?.description}</p>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button>More</Button>
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