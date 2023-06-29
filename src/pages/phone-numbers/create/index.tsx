import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPhoneNumber } from 'apiSdk/phone-numbers';
import { Error } from 'components/error';
import { phoneNumberValidationSchema } from 'validationSchema/phone-numbers';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ClientInterface } from 'interfaces/client';
import { getClients } from 'apiSdk/clients';
import { PhoneNumberInterface } from 'interfaces/phone-number';

function PhoneNumberCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PhoneNumberInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPhoneNumber(values);
      resetForm();
      router.push('/phone-numbers');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PhoneNumberInterface>({
    initialValues: {
      number: '',
      client_id: (router.query.client_id as string) ?? null,
    },
    validationSchema: phoneNumberValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Phone Number
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="number" mb="4" isInvalid={!!formik.errors?.number}>
            <FormLabel>Number</FormLabel>
            <Input type="text" name="number" value={formik.values?.number} onChange={formik.handleChange} />
            {formik.errors.number && <FormErrorMessage>{formik.errors?.number}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ClientInterface>
            formik={formik}
            name={'client_id'}
            label={'Select Client'}
            placeholder={'Select Client'}
            fetcher={getClients}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'phone_number',
    operation: AccessOperationEnum.CREATE,
  }),
)(PhoneNumberCreatePage);
