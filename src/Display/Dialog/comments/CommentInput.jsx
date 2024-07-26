import React, {useState} from 'react';
import {Backdrop, Box, Button, CircularProgress, IconButton, TextField} from "@mui/material";
import {useSelector} from "react-redux";
import addComment from "../../../utils/Comments/Add";
import {Add} from "@mui/icons-material";

import styles from './Comment.module.css'

const CommentInput = ({currentItem}) => {
    const user = useSelector((state) => state.user);
    const [value, setValue] = useState("");

    const [isSending, setIsSending] = useState(false);

    const [isFocus, setIsFocus] = useState(false);

    const onAddComment = async () => {
        if (value.length) {
            try {
                setIsSending(true);
                const response = await addComment({user, value, currentItem});
                setValue("")
            } catch (error) {
                console.log(error);
            } finally {
                setTimeout(() => {
                    setIsSending(false);
                }, 250)
            }
        } else {
            alert("Вы не можете оправлять пустой коментарий")
        }
    }

    if (!isFocus) {
        return (
            <Box className={styles.Comment_input_body_unFocus}>
                <TextField
                    fullWidth={true}
                    multiline={true}
                    onFocus={() => setIsFocus(true)}
                    size={"small"}
                    value={value}
                    onInput={(event) => setValue(event.target.value)}
                    id="standard-basic"
                    placeholder="Add a comment"
                    variant="standard"
                />
            </Box>
        )
    }

    return (
        <Box className={styles.Comment_input_body_unFocus}>
            <Backdrop sx={{zIndex: 99}} open={isSending}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <TextField
                fullWidth={true}
                multiline={true}
                onFocus={() => setIsFocus(true)}
                size={"small"}
                value={value}
                onInput={(event) => setValue(event.target.value)}
                id="standard-basic"
                placeholder="Add a comment"
                variant="standard"
            />
            <Box>

                <Button onClick={onAddComment} size={"small"} variant="contained" sx={{my: 2, borderRadius: 8}}>
                    <article style={{color: "white"}}>Reply</article>
                </Button>
            </Box>
        </Box>
    );
};

export default CommentInput;