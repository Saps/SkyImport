import * as Yup from 'yup';
import { formModel } from './form-model';

const { producerName, inn, region, commodityGroup, site, fileInfo, email, telephone } = formModel;

export const validationSchema = [
    Yup.object().shape({
        [producerName.name]: Yup.string().required(producerName.requiredErrorMsg),
        [inn.name]: Yup.string().required(inn.requiredErrorMsg).matches(/^(\d{10}|\d{12})$/, inn.invalidErrorMsg),
        [region.name]: Yup.object().required(region.requiredErrorMsg),
        [commodityGroup.name]: Yup.array().min(1, commodityGroup.requiredErrorMsg),
        [site.name]: Yup.string().required(site.requiredErrorMsg),
        [email.name]: Yup.string().required(email.requiredErrorMsg).email(email.invalidErrorMsg),
        [telephone.name]: Yup.string().notRequired()
            .matches(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/, telephone.invalidErrorMsg),
    }),
    Yup.object().shape({
        [fileInfo.name]: Yup.mixed()
            .required(fileInfo.requiredErrorMsg)
            .test('isEmpty', fileInfo.requiredErrorMsg, (value) => value?.file)
            .test('fileSize', 'Размер файла больше 10Мб', (value) => value?.file?.size <= 10 * 1024 * 1024)
            .test('fileFormat', 'Неподдерживаемый формат', (value) => /\.(csv|xls|xlsx)$/.test(value?.file?.name ?? '')),
    }),
];
