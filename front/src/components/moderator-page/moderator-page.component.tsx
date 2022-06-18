import { SyntheticEvent, useState } from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import { FirmsTableComponent, GroupParsingComponent } from '~/components';

export const ModeratorPageComponent = (): JSX.Element => {
    const [activeTab, setActiveTab] = useState<number>(0);
    return (
        <Container sx={{ marginTop: '20px' }}>
            <Box component="h3" sx={{ textAlign: 'center', marginBottom: '2rem' }}>Рабочее место модератора</Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '1rem' }}>
                <Tabs value={activeTab} onChange={(e: SyntheticEvent, value: number) => setActiveTab(value)}>
                    <Tab label="Основная база" />
                    <Tab label="Премодерация" />
                    <Tab label="Парсинг данных" />
                </Tabs>
            </Box>
            <Box component="div" sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
                {activeTab === 0 && <FirmsTableComponent entriesType="approved" />}
            </Box>
            <Box component="div" sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
                {activeTab === 1 && <FirmsTableComponent entriesType="premoderated" />}
            </Box>
            <Box component="div" sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
                {activeTab === 2 && <GroupParsingComponent />}
            </Box>
        </Container>
    );
};
