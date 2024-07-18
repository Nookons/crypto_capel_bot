import React, {useEffect, useState} from 'react';
import {
    AppBar,
    Box, Button, Chip,
    Dialog,
    IconButton,
    Slide, Toolbar
} from "@mui/material";
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import {useDispatch, useSelector} from "react-redux";
import {addToFavorite, removeFromFavorite} from "../../store/reducers/asyncActions/user/Favorite";
import {addUserLike, removeUserLike} from "../../store/reducers/asyncActions/project/Likes";
import MyButton from "../../components/MyButton";
import FaceIcon from '@mui/icons-material/Face';
import CommentInput from "./comments/CommentInput";
import DialogComments from "./comments/DialogComments";
import startClaim from "../../utils/Claim/StartClaim";
import ProjectClaim from "./Claim/ProjectClaim";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MyDialog = ({dialog, setDialog}) => {
    const user = useSelector(state => state.user)
    const projects = useSelector(state => state.projects)
    const dispatch = useDispatch();

    const [isFavorite, setIsFavorite]   = useState(false);
    const [isLiked, setIsLiked]         = useState(false);


    const [currentItem, setCurrentItem] = useState(null);

    useEffect(() => {
        if (currentItem && currentItem.id) {
            const isFavorite = user.favorite.includes(currentItem.id);
            const isLiked = currentItem.userLiked.includes(user.id);

            setIsFavorite(isFavorite);
            setIsLiked(isLiked)
        }
    }, [user.favorite, currentItem]);

    useEffect(() => {
        if (projects) {
            const founded = projects.find(item => item.id === dialog.id)
            setCurrentItem(founded)
        }
    }, [dialog, projects]);

    const onClose = () => {
        setCurrentItem(null)
        setDialog({isOpen: false, id: 0})
    }

    const onAddLike = async () => {
        const data = currentItem;
        dispatch(addUserLike({data, user}))
    }

    const onRemoveLike = async () => {
        const data = currentItem;
        dispatch(removeUserLike({data, user}))
    }

    const onAddFavorite = async () => {
        const id = currentItem.id;
        dispatch(addToFavorite({id, user}))
    }

    const onRemoveFromFavorite = async () => {
        const id =  currentItem.id
        dispatch(removeFromFavorite({id, user}))
    }

    const onStartClick = () => {
        onClose();
        window.location.href = currentItem.link
    }

    return (
        <Dialog
            fullScreen
            open={dialog.isOpen}
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative', background: `url(${currentItem?.imgPath})`, backgroundSize: "cover"}}>
                <Toolbar sx={{gap: 2, justifyContent: "space-between"}}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                        sx={{backgroundColor: "rgba(0,0,0, 0.25)", backdropFilter: "blur(3px)"}}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Box sx={{display: "flex", gap: 1}}>
                        {!isFavorite
                            ?   <MyButton click={onAddFavorite}><BookmarkAddIcon/></MyButton>
                            :   <MyButton click={onRemoveFromFavorite}><BookmarkRemoveIcon/></MyButton>
                        }
                        <MyButton click={onStartClick}><PlayCircleFilledIcon /></MyButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <List sx={{p: 1}}>
                <Box sx={{display: "flex",gap: 1, my: 2}}>
                    {!isLiked
                        ?   <Chip onClick={onAddLike} clickable icon={<FavoriteBorderIcon />} label={<p>{currentItem?.likes.toLocaleString()}</p>} />
                        :   <Chip onClick={onRemoveLike} clickable icon={<FavoriteIcon sx={{color: "red !important"}} />} label={<p>{currentItem?.likes.toLocaleString()}</p>} />
                    }
                    <Chip icon={<FaceIcon />} label={<p>Altcoin</p>} />
                    <Chip icon={<FaceIcon />} label={<p>Token</p>} />
                </Box>
                <ProjectClaim currentItem={currentItem} user={user}/>
                <Divider sx={{my: 1}}/>
                <p>{currentItem?.description}</p>
                <Divider sx={{my: 1}}/>
                <CommentInput currentItem={currentItem}/>
                <DialogComments currentItem={currentItem}/>
            </List>
        </Dialog>
    )
};

export default MyDialog;