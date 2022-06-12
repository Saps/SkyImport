import React, {useState, useCallback, useEffect} from 'react';
import Paper from '@mui/material/Paper';
import {
    Autocomplete, Card, CardContent, Checkbox, Container, Grid, Table, TableBody,
    TableContainer, TableRow, TableCell, TableHead, TablePagination, TextField,
} from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { FormikProps, useFormik } from 'formik';
import { debounce } from 'lodash';
import { getFirms, getRegions} from '~/api';
import { LoadingOverlay } from '~/components';
import type { Firm, FirmsFilterParams, Region, FirmView } from '~/types';

interface Category {
    id: number;
    name: string;
    parentId?: number;
}

interface FiltersValue {
    categories: Category[];
    region: Region;
    search: string;
}

const categories: Category[] = [
    { id: 1, name: 'Бытовая техника' },
    { id: 4, name: 'Пылесосы', parentId: 1 },
    { id: 5, name: 'Холодильники', parentId: 1 },
    { id: 6, name: 'Утюги', parentId: 1 },
    { id: 2, name: 'Продукты питания' },
    { id: 7, name: 'Фрукты', parentId: 2 },
    { id: 8, name: 'Овощи', parentId: 2 },
    { id: 9, name: 'Мясо', parentId: 2 },
    { id: 3, name: 'Стройматериалы' },
    { id: 10, name: 'Деревянные стройматериалы', parentId: 3 },
    { id: 11, name: 'Бетонные стройматериалы', parentId: 3 },
    { id: 12, name: 'Металлические изделия', parentId: 3 },
    { id: 4, name: 'Косметика' },
];

const loadFirmsView = async (
    filterParams: FirmsFilterParams = {},
    currentPage: number,
    perPage: number,
    setFirmsView: React.Dispatch<React.SetStateAction<Firm[]>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setItemsCount: React.Dispatch<React.SetStateAction<number>>,
) => {
    setIsLoading(true);

    try {
        const view: FirmView = await getFirms(filterParams, currentPage * perPage, perPage);

        setFirmsView(view.items);
        setItemsCount(view.count);
    } catch (e) {
    } finally {
        setIsLoading(false);
    }
};

export const ProductsPageComponent = (): JSX.Element => {
    const [perPage, setPerPage] = useState<number>(5);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPageLoading, setPageIsLoading] = useState<boolean>(false);
    const [firmsView, setFirmsView] = useState<Firm[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [regions, setRegions] = useState<Region[]>([]);
    const [itemsCount, setItemsCount] = useState<number>(0);

    const { handleChange, handleSubmit, setFieldValue, values }: FormikProps<FiltersValue> = useFormik<FiltersValue>({
        initialValues: {
            categories: [],
            region: { id: -1, name: '', kladr_id: -1, type: '' },
            search: ''
        },
        onSubmit: values => {
            loadFirmsView(
                {
                    name: values.search,
                    categories: values.categories.map(c => c.id),
                    ...(values.region.id >= 0 ? {region: values.region.id} : {})
                },
                currentPage,
                perPage,
                setFirmsView,
                setIsLoading,
                setItemsCount,
            );
        },
    });

    const applyNewFilter = (): void => {
        setCurrentPage(0);
        submitWithDebounce();
    };

    const handleCategoriesChange = (e: React.SyntheticEvent, value: Category[]): void => {
        handleChange(e);
        setFieldValue('categories', value);
        applyNewFilter();
    };

    const handleRegionChange = (e: React.SyntheticEvent, value: Region | null): void => {
        handleChange(e);
        setFieldValue('region', value || { id: -1, name: '', kladr_id: -1, type: '' });
        applyNewFilter();
    };

    const handleSearchChange = (e: React.SyntheticEvent): void => {
        handleChange(e);
        setFieldValue('search', (e.target as HTMLInputElement).value);
        applyNewFilter();
    };

    const handlePageChange = (e: React.MouseEvent<HTMLButtonElement> | null, page: number): void => {
        setCurrentPage(page);
        handleSubmit();
    };

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
        setPerPage(+e.target.value as number);
        handleSubmit();
    }

    const submitWithDebounce = useCallback(debounce(handleSubmit, 1500), [handleSubmit]);

    const loadRegions = async () => {
        setPageIsLoading(true);

        try {
            const regions: Region[] = await getRegions();

            setRegions(regions);
        } catch (e) {
        } finally {
            setPageIsLoading(false);
        }
    };

    useEffect(() => {
        loadRegions();
        submitWithDebounce();
    }, [submitWithDebounce]);

    return (
        <Container sx={{ marginTop: '20px' }}>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="standard"
                                        placeholder="Что вы хотите найти?"
                                        fullWidth
                                        value={values.search}
                                        onChange={handleSearchChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        value={values.categories}
                                        multiple
                                        options={categories}
                                        disableCloseOnSelect
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        getOptionLabel={option => option.name}
                                        renderOption={(props, option, { selected }) => (
                                            <li {...props}>
                                                <Checkbox
                                                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                    checked={selected}
                                                    style={{ marginRight: 8, marginLeft: option.parentId ? 8 : 0 }}
                                                />
                                                {option.name}
                                            </li>
                                        )}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label="Группы товаров"
                                                placeholder="Выберите группы..."
                                                variant="standard"
                                            />
                                        )}
                                        onChange={handleCategoriesChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        value={values.region}
                                        options={regions}
                                        getOptionLabel={option => option.name}
                                        renderInput={params => (
                                            <TextField {...params} label="Регион" placeholder="Выберите регион..." variant="standard"/>
                                        )}
                                        onChange={handleRegionChange}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    {(isLoading || isPageLoading) && <LoadingOverlay/>}
                </Grid>
                <Grid item xs={9}>
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell component="th">ID</TableCell>
                                        <TableCell component="th">ИНН</TableCell>
                                        <TableCell component="th">Название</TableCell>
                                        <TableCell component="th">Полное название</TableCell>
                                        <TableCell component="th">Сайт</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {firmsView.map(row => (
                                        <TableRow key={row.id}>
                                            <TableCell component="td">{row.id}</TableCell>
                                            <TableCell component="td">{row.inn}</TableCell>
                                            <TableCell component="td">{row.name}</TableCell>
                                            <TableCell component="td">{row.full_name}</TableCell>
                                            <TableCell component="td">{row.site}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={itemsCount}
                            rowsPerPage={perPage}
                            page={currentPage}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                        />
                        {(isLoading || isPageLoading) && <LoadingOverlay/>}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};
