import React, { useState, useCallback, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { Table, TableBody, TableContainer, TableRow, TableCell, TableHead } from '@mui/material';
import { Grid } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { Container } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { Checkbox } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { TextField } from '@mui/material';
import { debounce } from 'lodash';
import type { Firm, FirmsFilterParams } from '~/types';
import { getFirms } from '~/api';

import { useFormik, FormikProps } from 'formik';

import _regions from './regions.json';

const regions: Region[] = _regions as Region[];

interface Manufacturer extends Firm {}

interface Category {
  id: number;
  name: string;
}

interface Region {
  id: number;
  name: string;
}

interface FiltersValue {
  categories: Category[];
  region: Region;
  search: string;
}

const categories: Category[] = [
  { id: 1, name: 'Бытовая техника' },
  { id: 2, name: 'Продукты питания' },
  { id: 3, name: 'Стройматериалы' },
  { id: 4, name: 'Косметика' },
];

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const getManufacturers = async (filterParams: FirmsFilterParams = {}, offset: number = 0, limit: number = 15): Promise<Manufacturer[]> => {
  const data: Manufacturer[] = await getFirms(filterParams, offset, limit);

  return data;
}

const loadManufacturersView = async (filterParams: FirmsFilterParams = {}, currentPage: number, perPage: number, setManufacturersView: React.Dispatch<React.SetStateAction<Manufacturer[]>>) => {
  const view: Manufacturer[] = await getManufacturers(filterParams, currentPage * perPage, perPage);
  setManufacturersView(view);
};

export const ProductsPageComponent = (): JSX.Element => {
  const perPage: number = 15;
  console.log('render ProductsPageComponent');
  const [manufacturersView, setManufacturersView] = useState<Manufacturer[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { errors, handleBlur, handleChange, handleSubmit, isValid, setFieldValue, setValues, values }: FormikProps<FiltersValue> = useFormik<FiltersValue>({
    initialValues: { categories: [], region: { id: -1, name: '' }, search: '' },
    
    onSubmit: values => {
      console.log('handleFiltersChange', values);
      loadManufacturersView(
        { name: values.search, categories: values.categories.map(c => c.id), ...(values.region.id >= 0 ? { region: values.region.id } : {}) },
        currentPage,
        perPage,
        setManufacturersView,
      );
    },
  });

  const handleCategoriesChange = (e: React.SyntheticEvent, value: Category[]): void => {
    console.log('handleCategories change', value);
    handleChange(e);
    setFieldValue('categories', value);
    submitWithDebounce();
  };

  const handleRegionChange = (e: React.SyntheticEvent, value: Region | null): void => {
    handleChange(e);
    setFieldValue('region', value ? value : { id: -1, name: '' });
    submitWithDebounce();
  };

  const handleSearchChange = (e: React.SyntheticEvent): void => {
    handleChange(e);
    setFieldValue('search', (e.target as HTMLInputElement).value);
    submitWithDebounce();
  };


  useEffect(() => {
    loadManufacturersView({}, currentPage, perPage, setManufacturersView);
  }, [currentPage, perPage, setManufacturersView]);

  const submitWithDebounce = useCallback(debounce(handleSubmit, 1500), [handleSubmit]);

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
                    getOptionLabel={option => option.name}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          checked={selected}
                          style={{ marginRight: 8 }}
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
                      <TextField {...params} label="Регион" placeholder="Выберите регион..." variant="standard" />
                    )}
                    onChange={handleRegionChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <TableContainer component={Paper}>
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
                {manufacturersView.map(row => (
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
        </Grid>
        
      </Grid>
    </Container>
  );
};
