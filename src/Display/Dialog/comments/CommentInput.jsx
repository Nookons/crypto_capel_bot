import React, {useState} from 'react';
import {Backdrop, Box, Button, CircularProgress, IconButton, TextField} from "@mui/material";
import {useSelector} from "react-redux";
import addComment from "../../../utils/Comments/Add";
import {Add} from "@mui/icons-material";

const CommentInput = ({currentItem}) => {
    const user = useSelector((state) => state.user);
    const [value, setValue] = useState("");

    const [isSending, setIsSending] = useState(false);

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

    return (
        <Box sx={{display: "grid", gap: 1, alignItems: "center", gridTemplateColumns: "1fr 0.15fr", mb: 1}}>
            <Backdrop sx={{zIndex: 99}} open={isSending}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <TextField
                multiline={true}
                value={value}
                onInput={(event) => setValue(event.target.value)}
                id="standard-basic"
                label="Feedback"
                variant="outlined"
            />
            <IconButton onClick={onAddComment} aria-label="add">
                <Add/>
            </IconButton>
        </Box>
    );
};

export default CommentInput;