import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, IconButton,
    Skeleton
} from "@mui/material";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {Add} from "@mui/icons-material";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';

import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

const MyDialog = ({dialog, setDialog}) => {
    const [currentItem, setCurrentItem] = useState({
        isLoading: false,
        item: null,
        error: "",
    });

    useEffect(() => {
        async function getItem() {
            setCurrentItem((prevState) => ({...prevState, isLoading: true}))

            try {
                const docRef = doc(db, "projects", dialog.name);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCurrentItem({isLoading: false, item: docSnap.data(), error: ""})
                }
            } catch (error) {
                setCurrentItem({isLoading: false, item: null, error: error.toString()})
            }
        }

        if (dialog.name) {
            getItem();
        }
    }, [dialog]);

    const onClose = () => {
        setDialog({isOpen: false, id: 0})
        setTimeout(() => {
            setCurrentItem({
                isLoading: false,
                item: null,
                error: "",
            })
        }, 250)
    }

    const onAddLike = async () => {
        alert("Coming soon...")
    }
    const onAddFavorite = async () => {
        alert("Coming soon...")
    }

    const onStartClick = () => {
        window.location.href = currentItem.item.link
    }

    return (
        <Dialog
            open={dialog.isOpen}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={"xs"}>
            <DialogTitle id="alert-dialog-title">
                <p style={{color: "gray", display: "flex", alignItems: "center", gap: 6}}><ThumbUpIcon
                    sx={{fontSize: 14}}/> {currentItem.item?.likes.toLocaleString()}</p>

                {currentItem.item
                    ? <Avatar src={currentItem?.item.imgPath} variant={"rounded"}
                              sx={{width: "100%", height: 125, my: 2}}>N</Avatar>
                    : <Skeleton variant="rectangular" width={"100%"} height={125}/>
                }
                {currentItem.item ? <h4>{currentItem.item.name} </h4> : <Skeleton variant="text"/>}
            </DialogTitle>
            <DialogContent>
                {currentItem.item ? <p>{currentItem.item.description}</p> :
                    <Skeleton variant="rectangular" width={250} height={150}/>}
            </DialogContent>
            <DialogActions>
                <IconButton onClick={onAddLike} aria-label="add">
                    <FavoriteBorderIcon sx={{fontSize: 24}}/>
                </IconButton>
                <IconButton onClick={onAddFavorite} aria-label="add">
                    <BookmarkAddIcon sx={{fontSize: 24}}/>
                </IconButton>

                {currentItem.item
                    ?
                    <IconButton sx={{color: "green"}} onClick={onStartClick} aria-label="add">
                        <PlayCircleFilledIcon sx={{fontSize: 44}}/>
                    </IconButton>
                    : <Skeleton variant="rectangular" width={95} height={25}/>}
            </DialogActions>
        </Dialog>
    )
};

export default MyDialog;