import * as yup from 'yup';

export const spoofCallValidationSchema = yup.object().shape({
  status: yup.string().required(),
  client_id: yup.string().nullable().required(),
  phone_number_id: yup.string().nullable().required(),
});
