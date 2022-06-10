import React from 'react';
import { ReactSVG } from 'react-svg';

import './header.component.scss';

export const HeaderComponent = (): JSX.Element => {
    return (
        <>
            <header className="app-header">
                <ReactSVG className="app-header__logo-wrapper" src="logo.svg" />
            </header>
        </>
    )
}
