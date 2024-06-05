import React from 'react';

const MyButton = (props) => {
    return (
        <button {...props} className={'button' + props.className} />
    );
};

export default MyButton;