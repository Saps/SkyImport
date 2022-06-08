import React from 'react';
import './footer.component.scss';

export const FooterComponent = (): JSX.Element => {
    return (
        <footer>
            <span>© {new Date().getFullYear()} SkyDev, все права защищены</span>
        </footer>
    );
}
