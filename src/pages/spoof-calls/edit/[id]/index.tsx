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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getSpoofCallById, updateSpoofCallById } from 'apiSdk/spoof-calls';
import { Error } from 'components/error';
import { spoofCallValidationSchema } from 'validationSchema/spoof-calls';
import { SpoofCallInterface } from 'interfaces/spoof-call';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ClientInterface } from 'interfaces/client';
import { PhoneNumberInterface } from 'interfaces/phone-number';
import { getClients } from 'apiSdk/clients';
import { getPhoneNumbers } from 'apiSdk/phone-numbers';

function SpoofCallEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SpoofCallInterface>(
    () => (id ? `/spoof-calls/${id}` : null),
    () => getSpoofCallById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SpoofCallInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSpoofCallById(id, values);
      mutate(updated);
      resetForm();
      router.push('/spoof-calls');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SpoofCallInterface>({
    initialValues: data,
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
            Edit Spoof Call
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(SpoofCallEditPage);
