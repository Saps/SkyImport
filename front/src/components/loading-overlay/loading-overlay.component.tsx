import { Box, CircularProgress } from '@mui/material';

export const LoadingOverlay = (): JSX.Element => {
  return (
    <Box
      component="div"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.6)',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
};
