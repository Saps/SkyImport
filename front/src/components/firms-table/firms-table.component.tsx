import React, { useState, useCallback, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import {
    Autocomplete, Box, Button, ButtonGroup, Card, CardContent, Checkbox, Grid, Table,
    TableBody, TableContainer, TableRow, TableCell, TableHead, TablePagination, TextField,
} from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { FormikProps, useFormik } from 'formik';
import { debounce } from 'lodash';
import { getFirms, getRegions, getGroups, approveItem, rejectItem } from '~/api';
import { LoadingOverlay, RejectModalComponent } from '~/components';
import type { Firm, FirmsFilterParams, Region, FirmView, CommodityGroup } from '~/types';
import { TablePaginationActionsComponent } from './table-pagination-actions.component';

interface FiltersValue {
    category: CommodityGroup;
    region: Region;
    name: string;
    productname: string;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const loadFirmsView = async (
    type: 'approved' | 'premoderated' = 'approved',
    filterParams: FirmsFilterParams = {},
    currentPage: number,
    perPage: number,
    setFirmsView: React.Dispatch<React.SetStateAction<Firm[]>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setItemsCount: React.Dispatch<React.SetStateAction<number>>,
): Promise<void> => {
    setIsLoading(true);

    try {
        const view: FirmView = await getFirms(type, filterParams, currentPage * perPage, perPage);

        setFirmsView(view.items);
        setItemsCount(view.count);
    } catch (e) {
    } finally {
        setIsLoading(false);
    }
};

interface FirmsTableComponentProps {
    entriesType: 'approved' | 'premoderated';
}

export const FirmsTableComponent = (props: FirmsTableComponentProps = { entriesType: 'approved' }): JSX.Element => {
    const [perPage, setPerPage] = useState<number>(5);
    const [rejectModalId, setRejectModalId] = useState<number>(-1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPageLoading, setPageIsLoading] = useState<boolean>(false);
    const [firmsView, setFirmsView] = useState<Firm[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [regions, setRegions] = useState<Region[]>([]);
    const [categories, setCategories] = useState<CommodityGroup[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
    const [itemsCount, setItemsCount] = useState<number>(0);
    const [alternativeCategories, setAlternativeCategories] = useState<CommodityGroup[]>([]);

    const { handleChange, handleSubmit, setFieldValue, values }: FormikProps<FiltersValue> = useFormik<FiltersValue>({
        initialValues: {
            category: { id: -1, tov_class: '', tov_group: '' },
            region: { id: -1, name: '', kladr_id: -1, type: '' },
            name: '',
            productname: '',
        },

        onSubmit: values => {
            loadFirmsView(
                props.entriesType,
                {
                    name: values.name,
                    productname: values.productname,
                    ...(values.category.id >= 0 ? { category: values.category.id } : {}),
                    ...(values.region.id >= 0 ? { region: values.region.id } : {}),
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

    const handleCategoryChange = (e: React.SyntheticEvent, value: CommodityGroup | null): void => {
        console.log('handleCategoryChange', value);
        handleChange(e);
        setFieldValue('category', value ? value : { id: -1, tov_class: '', tov_group: '' });
        updateAlternativeCategories(value);
        applyNewFilter();
    };

    const updateAlternativeCategories = (selectedCategory: CommodityGroup | null) => {
        console.log('category', selectedCategory);

        if (!selectedCategory || selectedCategory.id < 0) {
            setAlternativeCategories([]);

            return;
        }

        setAlternativeCategories(categories.filter(c => c.tov_class === (selectedCategory as CommodityGroup).tov_class));
    };

    const handleRegionChange = (e: React.SyntheticEvent, value: Region | null): void => {
        handleChange(e);
        setFieldValue('region', value ? value : { id: -1, name: '' });
        applyNewFilter();
    };

    const handleNameChange = (e: React.SyntheticEvent): void => {
        handleChange(e);
        setFieldValue('name', (e.target as HTMLInputElement).value);
        applyNewFilter();
    };

    const handleProductNameChange = (e: React.SyntheticEvent): void => {
        handleChange(e);
        setFieldValue('productname', (e.target as HTMLInputElement).value);
        applyNewFilter();
    };

    const handlePageChange = (e: React.MouseEvent<HTMLButtonElement> | null, page: number): void => {
        setCurrentPage(page);
        handleSubmit();
    };

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
        setPerPage(+e.target.value as number);
        setCurrentPage(0);
        handleSubmit();
    }

    const handleApproveItem = async (id: number): Promise<void> => {
        const result = await approveItem(id);

        if (result) {
            handleSubmit();
        }
    }

    const handleRejectItem = async (id: number, comment: string): Promise<void> => {
        setRejectModalId(-1);

        const result = await rejectItem(id, comment);

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

    const somethingIsLoading = () => categoriesLoading || isPageLoading || isLoading;

    useEffect(() => {
        loadRegions();
        loadCategories();
        submitWithDebounce();
    }, [submitWithDebounce]);

    return (
        <Grid container spacing={2}>
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
                                    value={values.productname}
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
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                checked={selected}
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
                            {alternativeCategories.length ?
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
                            : null}
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
                                    {props.entriesType === 'premoderated' ?
                                        <TableCell component="th">Управление</TableCell>
                                    : null}
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
                                        {props.entriesType === 'premoderated' ?
                                            <TableCell component="td">
                                                <Grid container spacing={1}>
                                                    <Grid item><Button variant="contained" onClick={() => handleApproveItem(row.id)}>Утвердить</Button></Grid>
                                                    <Grid item><Button variant="outlined" onClick={() => setRejectModalId(row.id)}>Отклонить</Button></Grid>
                                                </Grid>
                                            </TableCell>
                                        : null}
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
                        ActionsComponent={TablePaginationActionsComponent}
                    />
                    {somethingIsLoading() && <LoadingOverlay />}
                    {rejectModalId > -1 && (
                        <RejectModalComponent
                            info={'Вы действительно отклонить заявку?'}
                            onClose={() => setRejectModalId(-1)}
                            onSubmit={message => handleRejectItem(rejectModalId, message)}
                        />
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};
