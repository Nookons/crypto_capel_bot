import React from 'react';
import './ComponentsStyles.css'

const MyButton = ({children, props, click}) => {
    return (
        <button className={"MyButton"} {...props} onClick={click} ><h6>{children}</h6></button>
    );
};

export default MyButton;