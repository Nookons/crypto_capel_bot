import React, {useState} from 'react';
import {
    AppBar,
    Avatar,
    Box,
    Dialog,
    Divider,
    IconButton,
    Slide,
    Stack,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import styles from "../Comment.module.css";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ShortTextIcon from "@mui/icons-material/ShortText";
import AddCommentIcon from "@mui/icons-material/AddComment";
import addReply from "../../../../utils/Comments/AddChildComment";
import {useSelector} from "react-redux";
import Comment from "../Comment";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ReplyDialog = ({open, currentItem, comment, setOpen}) => {
    const user = useSelector(state => state.user)

    const [value, setValue] = useState("");

    const handleClose = () => {
        setOpen(false);
    };

    const onAddClick = async () => {
        try {
            const parentCommentId = comment.comment_id
            const response = await addReply({ user, value, currentItem, parentCommentId });
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{
                position: 'relative',
            }}>
                <Toolbar sx={{
                    position: 'relative',
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                    backgroundColor: "black"
                }}>
                    <Box className={styles.Comment_header}>
                        <Box className={styles.Comment_header_user_info}>
                            <Avatar sx={{w: 16, h: 16}}>N</Avatar>
                            <h6 style={{color: "white"}}>{comment.user}</h6>
                            <p style={{color: "white"}}>{dayjs(comment.timestamp).fromNow()}</p>
                        </Box>
                    </Box>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box className={styles.Comment_bottom}>
                <Stack
                    my={1}
                    sx={{border: "1px solid gray", borderRadius: 4}}
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem/>}
                    spacing={2}
                >
                    <IconButton sx={{gap: 1}} aria-label="add">
                        <ArrowUpwardIcon/> <h6>{comment?.likes?.toLocaleString()}</h6>
                    </IconButton>
                    <IconButton aria-label="add">
                        <ArrowDownwardIcon/>
                    </IconButton>
                </Stack>
                <IconButton sx={{gap: 1}} aria-label="add">
                    <ShortTextIcon/> <h6>{comment?.comments_count?.toLocaleString()}</h6>
                </IconButton>
            </Box>
            <Typography sx={{px: 2}} variant="subtitle1" gutterBottom component="div">
                <p>{comment.body}</p>
            </Typography>
            <Divider/>
            <Box sx={{display: "grid", gridTemplateColumns: "1fr 0.15fr", gap: 1, p: 2}}>
                <TextField
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    multiline={true}
                    size={"small"}
                    id="outlined-basic"
                    label="You're reply"
                    variant="outlined"
                />
                <IconButton onClick={onAddClick} aria-label="add">
                    <AddCommentIcon/>
                </IconButton>
            </Box>
            <Box sx={{px: 2, display: "flex", flexDirection: "column", gap: 1, mb: 16}}>
                {comment?.childes?.map((comment, index) => {

                    return (
                        <Comment key={index} comment={comment} currentItem={currentItem}/>
                    )
                })}
            </Box>
        </Dialog>
    );
};

export default ReplyDialog;