import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { AuthorizationWrapper } from '~/authorization-wrapper';
import { FooterComponent, HeaderComponent, LoginComponent, MainComponent } from '~/components';
import { store } from '~/store/store';

import './index.scss';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0458fe'
        },
        secondary: {
            main: '#24314a'
        },
        info: {
            main: '#e1e4f4'
        },
        error: {
            main: '#ff1f55'
        },
        success: {
            main: '#28a745'
        },
        warning: {
            main: '#ffc107'
        },
    },
    typography: {
        fontFamily: '\'TTFirs\',sans-serif'
    }
});

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <Routes>
                    <Route path="/login" element={<LoginComponent />} />
                </Routes>
                <Fragment>
                    <HeaderComponent />
                    <div className="main-container">
                        <AuthorizationWrapper>
                            <Routes>
                                <Route path="/" element={<MainComponent />} />
                            </Routes>
                        </AuthorizationWrapper>
                    </div>
                    <FooterComponent />
                </Fragment>
            </ThemeProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
