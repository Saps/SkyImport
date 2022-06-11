import * as Yup from 'yup';
import { formModel } from './form-model';

const { producerName, inn, region, commodityGroup, nameOnCard, cardNumber, cvv } = formModel;
const innRegEx = /^\d{16}$/;
const visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;

export const validationSchema = [
  Yup.object().shape({
    [producerName.name]: Yup.string().required(producerName.requiredErrorMsg),
    [inn.name]: Yup.string().required(inn.requiredErrorMsg).matches(innRegEx, inn.invalidErrorMsg),
    [region.name]: Yup.string().required(region.requiredErrorMsg),
    [commodityGroup.name]: Yup.string().required(commodityGroup.requiredErrorMsg),
  }),
  Yup.object().shape({
    [nameOnCard.name]: Yup.string().required(nameOnCard.requiredErrorMsg),
    [cardNumber.name]: Yup.string()
      .required(cardNumber.requiredErrorMsg)
      .matches(visaRegEx, cardNumber.invalidErrorMsg),
    [cvv.name]: Yup.string()
      .required(cvv.requiredErrorMsg)
      .test('len', cvv.invalidErrorMsg, val => typeof val === 'string' && val.length === 3)
  })
];
