import { MouseEvent } from 'react';
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface TablePaginationActionsProps {
    count: number;
    onPageChange: (event: MouseEvent<HTMLButtonElement>, newPage: number) => void;
    page: number;
    rowsPerPage: number;
}

export const TablePaginationActions = ({ count, onPageChange, page, rowsPerPage }: TablePaginationActionsProps): JSX.Element => {
    const theme = useTheme();

    const handleFirstPageButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'ltr' ? <FirstPage /> : <LastPage />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'ltr' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'ltr' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'ltr' ? <LastPage /> : <FirstPage /> }
            </IconButton>
        </Box>
    );
}
