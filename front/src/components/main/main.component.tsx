import React from 'react';
import { useSelector } from 'react-redux';
import { ModeratorPageComponent, ProducerPageComponent, ProductsPageComponent } from "~/components";
import { RootState } from '~/store/rootReducer';

export const MainComponent = (): JSX.Element => {
    const role = useSelector((state: RootState) => state.user.role);
    if (role === 'moderator') {
        return <ModeratorPageComponent />;
    } else if (role === 'producer') {
        return <ProducerPageComponent />;
    } else if (role === 'user') {
        return <ProductsPageComponent />;
    } else {
        return <h3 style={{ marginTop: 25, textAlign: 'center' }}>Page not found.</h3>;
    }
};
