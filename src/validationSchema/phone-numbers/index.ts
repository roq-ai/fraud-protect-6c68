import * as yup from 'yup';

export const phoneNumberValidationSchema = yup.object().shape({
  number: yup.string().required(),
  client_id: yup.string().nullable().required(),
});
