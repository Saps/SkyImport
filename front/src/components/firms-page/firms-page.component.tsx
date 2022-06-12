import { FirmsTableComponent } from '../firms-table/firms-table.component';
import { Box, Container } from '@mui/material';


export const FirmsPageComponent = (): JSX.Element => {
    return (
        <Container sx={{ marginTop: '20px' }}>
            <Box component="h3" sx={{ textAlign: 'center', marginBottom: '2rem' }}>Производители/поставщики</Box>
            <FirmsTableComponent  entriesType="approved" />
        </Container>
    );
};
