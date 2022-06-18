import { Box, CircularProgress } from '@mui/material';

export const LoadingOverlay = (): JSX.Element => (
    <Box
        component="div"
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '4px',
        }}
    >
        <CircularProgress/>
    </Box>
);
