import React from 'react';
import './MyButton.css'

const MyButton = (props) => {
    return (
        <button {...props} className={'button' + props.className} />
    );
};

export default MyButton;