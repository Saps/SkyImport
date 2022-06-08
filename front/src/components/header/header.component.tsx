import React from 'react';
import { ReactSVG } from 'react-svg';
import { Typography } from '@mui/material';

import './header.component.scss';

export const HeaderComponent = (): JSX.Element => {
    return (
        <>
            <header className="app-header">
                <ReactSVG className="app-header__logo-wrapper" src="logotype.svg" />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Startup Guide
                </Typography>
            </header>
        </>
    )
}
