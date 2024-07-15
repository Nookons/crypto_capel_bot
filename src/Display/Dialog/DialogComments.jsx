import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import MyButton from "../../components/MyButton";


const Comment = ({ comment }) => {
    return (
        <div style={{ marginLeft: '5px', borderLeft: '1px solid #ccc', padding: '10px', marginBottom: '5px' }}>
            <div>{comment.body}</div>
            {comment.childsComments && comment.childsComments.length > 0 && (
                <div style={{ marginLeft: '20px' }}>
                    {comment.childsComments.map((childComment, index) => (
                        <Comment key={index} comment={childComment} />
                    ))}
                </div>
            )}
        </div>
    );
};

const DialogComments = ({ currentItem }) => {
    const projects = useSelector(state => state.projects);
    const users = useSelector(state => state.user);

    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (currentItem && currentItem.comments) {
            setComments(currentItem.comments);
        } else {
            setComments([]);
        }
    }, [currentItem]);

    if (!comments.length) {
        return <MyButton>Пока здесь нету ни одного коментария 😰</MyButton>;
    }

    return (
        <div>
            {comments.map((comment, index) => (
                <Comment key={index} comment={comment} />
            ))}
        </div>
    );
};

export default DialogComments;
