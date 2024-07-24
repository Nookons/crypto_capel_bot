import * as React from 'react';
import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const iOSBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

export const IOSSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#0a84ff' : '#007bff',
    height: 8,
    padding: '8px 0',
    '& .MuiSlider-thumb': {
        height: 0,
        width: 0,
        backgroundColor: '#f0c850',
        boxShadow: '3px 3px 0 0px rgba(0, 0, 0, 0.85)',
        '&:focus, &:hover, &.Mui-active': {
            boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                boxShadow: iOSBoxShadow,
            },
        },
        '&:before': {
            boxShadow:
                '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
        },
    },
    '& .MuiSlider-valueLabel': {
        fontSize: 12,
        fontWeight: 'normal',
        top: -6,
        backgroundColor: 'unset',
        color: theme.palette.text.primary,
        '&::before': {
            display: 'none',
        },
        '& *': {
            background: 'transparent',
            color: theme.palette.mode === 'dark' ? '#fff' : '#000',
        },
    },
    '& .MuiSlider-track': {
        border: 'none',
        height: 8,
    },
    '& .MuiSlider-rail': {
        opacity: 1,
        boxShadow: 'inset 0px 0px 4px -2px #000',
        backgroundColor: '#d0d0d0',
    },
}));

export const ClaimSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#0a84ff' : '#007bff',
    height: 45,
    padding: '0px 0',
    '& .MuiSlider-thumb': {
        height: 0,
        width: 0,
        backgroundColor: '#f0c850',
        boxShadow: '0px 0px 8px 2px rgba(0, 0, 0, 0.5)',
        '&:focus, &:hover, &.Mui-active': {
            boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.3)',
            '@media (hover: none)': {
                boxShadow: iOSBoxShadow,
            },
        },
        '&:before': {
            boxShadow:
                '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
        },
    },
    '& .MuiSlider-valueLabel': {
        fontSize: 14,
        fontWeight: 'bold',
        top: -10,
        backgroundColor: 'unset',
        color: theme.palette.text.primary,
        '&::before': {
            display: 'none',
        },
        '& *': {
            background: 'transparent',
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
        },
    },
    '& .MuiSlider-track': {
        border: 'none',
        height: 45,
        backgroundColor: theme.palette.mode === 'dark' ? '#007bff' : '#171717',
    },
    '& .MuiSlider-rail': {
        opacity: 0.5,
        height: 45,
        backgroundColor: '#4d4d4d',
    },
}));