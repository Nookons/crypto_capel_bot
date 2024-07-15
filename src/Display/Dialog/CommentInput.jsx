import React, {useState} from 'react';
import {Box, Button, TextField} from "@mui/material";
import MyButton from "../../components/MyButton";
import {useSelector} from "react-redux";
import addComment from "../../utils/Comments/Add";

const CommentInput = ({currentItem}) => {
    const user = useSelector((state) => state.user);
    const [value, setValue] = useState("");

    const onAddComment = async () => {
        if (value.length) {
            const response = await addComment({user, value, currentItem});
        } else {
            alert("Вы не можете оправлять пустой коментарий")
        }
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end"}}>
            <TextField
                value={value}
                onChange={(e) => setValue(e.target.value)}
                fullWidth
                d="outlined-basic"
                label={<article>Comment</article>}
                variant="outlined"
                multiline={true}
            />
            <MyButton click={onAddComment}>Add</MyButton>
        </Box>
    );
};

export default CommentInput;