import { Download } from '@mui/icons-material'
import { Box, Container, Button, Grid } from '@mui/material';
import { FirmsTableComponent } from '~/components';

export const FirmsPageComponent = (): JSX.Element => {
    return (
        <Container sx={{ marginTop: '20px' }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box component="h3" sx={{ textAlign: 'center' }}>Производители/поставщики</Box>
                </Grid>
                <Grid item xs={12}>
                    <FirmsTableComponent  entriesType="approved" />
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end '}}>
                        <Button color="success" variant="contained" startIcon={<Download />}>Выгрузить данные</Button>
                    </Box>
                </Grid>
                <Grid item xs={12}></Grid>
            </Grid>
        </Container>
    );
};
