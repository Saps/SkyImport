import { useState } from 'react';
import { Box, Container, Tabs, Tab } from '@mui/material';
import { FirmsTableComponent } from '~/components';

import { GroupParsingComponent } from '../group-parsing/group-parsing.component';

interface TabPanelProps {
    children: JSX.Element;
    value: number;
    index: number;
}

const TabPanel = (props: TabPanelProps): JSX.Element => {
    const { children, value, index } = props;

    return (
        <Box component="div" sx={{ display: value === index ? 'block': 'none' }}>
            {value === index ? children : null}
        </Box>
    );
};

export const ModeratorPageComponent = (): JSX.Element => {
    const [activeTab, setActiveTab] = useState<number>(0);

    const handleTabChange = (e: React.SyntheticEvent, value: number) => {
        setActiveTab(value);
    };

    return (
        <Container sx={{ marginTop: '20px' }}>
            <Box component="h3" sx={{ textAlign: 'center', marginBottom: '2rem' }}>Рабочее место модератора</Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '1rem' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Основная база" />
                    <Tab label="Премодерация" />
                    <Tab label="Парсинг данных" />
                </Tabs>
            </Box>
            <TabPanel value={activeTab} index={0}>
                <FirmsTableComponent entriesType="approved" />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
                <FirmsTableComponent entriesType="premoderated"/>
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
                <GroupParsingComponent />
            </TabPanel>
        </Container>
    );
};
