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
import { createSpoofCall } from 'apiSdk/spoof-calls';
import { Error } from 'components/error';
import { spoofCallValidationSchema } from 'validationSchema/spoof-calls';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ClientInterface } from 'interfaces/client';
import { PhoneNumberInterface } from 'interfaces/phone-number';
import { getClients } from 'apiSdk/clients';
import { getPhoneNumbers } from 'apiSdk/phone-numbers';
import { SpoofCallInterface } from 'interfaces/spoof-call';

function SpoofCallCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SpoofCallInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSpoofCall(values);
      resetForm();
      router.push('/spoof-calls');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SpoofCallInterface>({
    initialValues: {
      status: '',
      client_id: (router.query.client_id as string) ?? null,
      phone_number_id: (router.query.phone_number_id as string) ?? null,
    },
    validationSchema: spoofCallValidationSchema,
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
            Create Spoof Call
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
            <FormLabel>Status</FormLabel>
            <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
            {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
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
          <AsyncSelect<PhoneNumberInterface>
            formik={formik}
            name={'phone_number_id'}
            label={'Select Phone Number'}
            placeholder={'Select Phone Number'}
            fetcher={getPhoneNumbers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.number}
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
    entity: 'spoof_call',
    operation: AccessOperationEnum.CREATE,
  }),
)(SpoofCallCreatePage);
