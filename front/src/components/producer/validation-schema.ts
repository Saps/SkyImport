import * as Yup from 'yup';
import { formModel } from './form-model';

const { producerName, inn, region, commodityGroup, site, csvInfo } = formModel;

export const validationSchema = [
    Yup.object().shape({
        [producerName.name]: Yup.string().required(producerName.requiredErrorMsg),
        [inn.name]: Yup.string().required(inn.requiredErrorMsg).matches(/^\d{16}$/, inn.invalidErrorMsg),
        [region.name]: Yup.string().required(region.requiredErrorMsg),
        [commodityGroup.name]: Yup.string().required(commodityGroup.requiredErrorMsg),
        [site.name]: Yup.string().required(site.requiredErrorMsg),
    }),
    Yup.object().shape({
        [csvInfo.name]: Yup.string().required(csvInfo.requiredErrorMsg),
    }),
];
