import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { MoreVert } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { RootState } from '~/store/rootReducer';
import { logoutAction } from '~/store/user/actions';

import './header.component.scss';

const menuItems = [
    {
        id: 'menu-item-logout',
        value: 'Выйти из системы',
    },
];

export const HeaderComponent = (): JSX.Element => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

    const handleCloseMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(null);
        if (event.currentTarget.id === 'menu-item-logout') {
            handleLogout();
        }
    };

    const handleLogout = async () => {
        await dispatch(logoutAction());
        history.replace('/login');
    };

    return (
        <header className="app-header">
            <ReactSVG className="app-header__logo-wrapper" src="logo.svg" />
            <Typography variant="body1" component="div" sx={{ flexGrow: 1, textAlign: 'right' }}>
                {user.username}
            </Typography>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls="long-menu"
                aria-expanded={!!anchorEl}
                aria-haspopup="true"
                onClick={handleClickMenu}
            >
                <MoreVert />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{ 'aria-labelledby': 'long-button' }}
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleCloseMenu}
            >
                {menuItems.map(option => (
                    <MenuItem id={option.id} key={option.id} onClick={handleCloseMenu}>
                        {option.value}
                    </MenuItem>
                ))}
            </Menu>
        </header>
    )
}
