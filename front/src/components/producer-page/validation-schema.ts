import * as Yup from 'yup';
import { formModel } from './form-model';

const { producerName, inn, region, commodityGroup, site, fileInfo } = formModel;

export const validationSchema = [
    Yup.object().shape({
        [producerName.name]: Yup.string().required(producerName.requiredErrorMsg),
        [inn.name]: Yup.string().required(inn.requiredErrorMsg).matches(/^\d{10,12}$/, inn.invalidErrorMsg),
        [region.name]: Yup.object().required(region.requiredErrorMsg),
        [commodityGroup.name]: Yup.string().required(commodityGroup.requiredErrorMsg),
        [site.name]: Yup.string().required(site.requiredErrorMsg),
    }),
    Yup.object().shape({
        [fileInfo.name]: Yup.mixed()
            .required(fileInfo.requiredErrorMsg)
            .test('isEmpty', fileInfo.requiredErrorMsg, (value) => value?.file)
            .test('fileSize', 'Размер файла больше 10Мб', (value) => value?.file?.size <= 10 * 1024 * 1024)
            .test('fileFormat', 'Неподдерживаемый формат', (value) => /\.(csv|xls|xlsx)$/.test(value?.file?.name ?? '')),
    }),
];
