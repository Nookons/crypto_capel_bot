import React from 'react';
import styles from 'MyButton.css'

const MyButton = (props) => {
    return (
        <button {...props} className={styles.button} />
    );
};

export default MyButton;