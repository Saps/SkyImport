import { ChangeEvent, MouseEvent, SyntheticEvent, useState, useCallback, useEffect } from 'react';
import { FormikProps, useFormik } from 'formik';
import { debounce } from 'lodash';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import {
    Autocomplete, Box, Button, ButtonGroup, Card, CardContent, Checkbox, Grid, Paper, Table,
    TableBody, TableContainer, TableRow, TableCell, TableHead, TablePagination, TextField,
} from '@mui/material';
import { approveItem, getFirms, getGroups, getRegions, rejectItem } from '~/api';
import { LoadingOverlay, RejectModalComponent } from '~/components';
import type { CommodityGroup, Firm, FirmView, Region } from '~/types';
import { TablePaginationActions } from './table-pagination-actions';

import './firms-table.component.scss';

interface FiltersValue {
    category: CommodityGroup;
    region: Region;
    name: string;
    prodname: string;
}

interface FirmsTableComponentProps {
    entriesType: 'approved' | 'premoderated';
}

export const FirmsTableComponent = ({ entriesType = 'approved' }: FirmsTableComponentProps): JSX.Element => {
    const [alternativeCategories, setAlternativeCategories] = useState<CommodityGroup[]>([]);
    const [categories, setCategories] = useState<CommodityGroup[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [firmsView, setFirmsView] = useState<Firm[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPageLoading, setPageIsLoading] = useState<boolean>(false);
    const [itemsCount, setItemsCount] = useState<number>(0);
    const [perPage, setPerPage] = useState<number>(5);
    const [regions, setRegions] = useState<Region[]>([]);
    const [rejectModalId, setRejectModalId] = useState<number>(-1);

    const { handleChange, handleSubmit, setFieldValue, values }: FormikProps<FiltersValue> = useFormik<FiltersValue>({
        initialValues: {
            category: { id: -1, tov_class: '', tov_group: '' },
            region: { id: -1, name: '', kladr_id: -1, type: '' },
            name: '',
            prodname: '',
        },
        onSubmit: async (values) => {
            setIsLoading(true);

            try {
                const filterParams = {
                    name: values.name,
                    prodname: values.prodname,
                    ...(values.category.id > -1 ? { category: values.category.id } : {}),
                    ...(values.region.id > -1 ? { region: values.region.id } : {}),
                };
                const view: FirmView = await getFirms(entriesType, filterParams, currentPage * perPage, perPage);

                setFirmsView(view.items);
                setItemsCount(view.count);
            } catch (e) {
            } finally {
                setIsLoading(false);
            }
        },
    });

    const applyNewFilter = (): void => {
        setCurrentPage(0);
        submitWithDebounce();
    };

    const handleCategoryChange = (e: SyntheticEvent, value: CommodityGroup | null): void => {
        handleChange(e);
        setFieldValue('category', value ?? { id: -1, tov_class: '', tov_group: '' });
        setAlternativeCategories(value && value.id > 0 ? categories.filter(c => c.tov_class === value.tov_class) : []);
        applyNewFilter();
    };

    const handleRegionChange = (e: SyntheticEvent, value: Region | null): void => {
        handleChange(e);
        setFieldValue('region', value ?? { id: -1, name: '' });
        applyNewFilter();
    };

    const handleNameChange = (e: SyntheticEvent): void => {
        handleChange(e);
        setFieldValue('name', (e.target as HTMLInputElement).value);
        applyNewFilter();
    };

    const handleProductNameChange = (e: SyntheticEvent): void => {
        handleChange(e);
        setFieldValue('prodname', (e.target as HTMLInputElement).value);
        applyNewFilter();
    };

    const handlePageChange = (e: MouseEvent<HTMLButtonElement> | null, page: number): void => {
        setCurrentPage(page);
        handleSubmit();
    };

    const handleRowsPerPageChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
        setPerPage(+e.target.value);
        setCurrentPage(0);
        handleSubmit();
    }

    const handleApproveItem = async (id: number): Promise<void> => {
        const result = await approveItem(id);

        if (result) {
            handleSubmit();
        }
    }

    const handleRejectItem = async (id: number, message: string): Promise<void> => {
        setRejectModalId(-1);

        const result = await rejectItem(id, message);

        if (result) {
            handleSubmit();
        }
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

    const loadCategories = async () => {
        setCategoriesLoading(true);

        try {
            const categories: CommodityGroup[] = await getGroups();

            setCategories(categories);
        } catch(e) {
        } finally {
            setCategoriesLoading(false);
        }
    };

    useEffect(() => {
        loadRegions();
        loadCategories();
        submitWithDebounce();
    }, [submitWithDebounce]);

    return (
        <Grid container spacing={2} className="FirmsTableComponent">
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    value={values.region}
                                    options={regions}
                                    getOptionLabel={option => option.name}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            label="Регион"
                                            placeholder="Выберите регион..."
                                            variant="standard"
                                        />
                                    )}
                                    onChange={handleRegionChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="standard"
                                    placeholder="Производитель/поставщик..."
                                    fullWidth
                                    value={values.name}
                                    onChange={handleNameChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="standard"
                                    placeholder="Продукт..."
                                    fullWidth
                                    value={values.prodname}
                                    onChange={handleProductNameChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    value={values.category}
                                    options={categories}
                                    groupBy={option => option.tov_class}
                                    getOptionLabel={option => option.tov_group}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                checkedIcon={<CheckBox fontSize="small" />}
                                                checked={selected}
                                                icon={<CheckBoxOutlineBlank fontSize="small" />}
                                                style={{ marginRight: 8 }}
                                            />
                                            {option.tov_group}
                                        </li>
                                    )}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            multiline
                                            label="Группы товаров"
                                            placeholder="Выберите группу..."
                                            variant="standard"
                                        />
                                    )}
                                    onChange={handleCategoryChange}
                                />
                            </Grid>
                            {alternativeCategories.length > 0 && (
                                <Grid item xs={12}>
                                    <Box sx={{ fontWeight: 'bold' }}>Похожая продукция</Box>
                                    <ButtonGroup orientation="vertical">
                                        {alternativeCategories.map(c =>
                                            <Button
                                                key={c.id}
                                                size="small"
                                                onClick={e => handleCategoryChange(e, c)}
                                                disabled={values.category.id === c.id}
                                            >
                                                {c.tov_group}
                                            </Button>
                                        )}
                                    </ButtonGroup>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>
                {(isLoading || isPageLoading) && <LoadingOverlay />}
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
                                    <TableCell component="th">Телефон</TableCell>
                                    <TableCell component="th">E-mail</TableCell>
                                    {entriesType === 'premoderated' && <TableCell component="th">Управление</TableCell>}
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
                                        <TableCell component="td">{row.phone}</TableCell>
                                        <TableCell component="td">{row.email}</TableCell>
                                        {entriesType === 'premoderated' && (
                                            <TableCell component="td">
                                                <Grid container spacing={1}>
                                                    <Grid item><Button variant="contained" onClick={() => handleApproveItem(row.id)}>Утвердить</Button></Grid>
                                                    <Grid item><Button variant="outlined" onClick={() => setRejectModalId(row.id)}>Отклонить</Button></Grid>
                                                </Grid>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        ActionsComponent={TablePaginationActions}
                        component="div"
                        count={itemsCount}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        page={currentPage}
                        rowsPerPage={perPage}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                    {(categoriesLoading || isLoading || isPageLoading) && <LoadingOverlay />}
                    {rejectModalId > -1 && (
                        <RejectModalComponent
                            info="Вы действительно отклонить заявку?"
                            onClose={() => setRejectModalId(-1)}
                            onSubmit={message => handleRejectItem(rejectModalId, message)}
                        />
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};
