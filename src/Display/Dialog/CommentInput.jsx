import React from 'react';
import {Box, Button, TextField} from "@mui/material";
import MyButton from "../../components/MyButton";

const CommentInput = () => {
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end"}}>
            <TextField
                fullWidth
                d="outlined-basic"
                label={<article>Comment</article>}
                variant="outlined"
                multiline={true}
            />
            <MyButton click={() => alert("Comming soon")}>Add</MyButton>
        </Box>
    );
};

export default CommentInput;