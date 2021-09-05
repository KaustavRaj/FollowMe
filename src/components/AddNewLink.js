import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Stack,
  Input,
  Switch,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";

export default function AddNewLink({ isOpen, onSave, existing, title }) {
  let initialValues = { title: "", url: "", show: true };

  if (existing) {
    let { position, ...rest } = existing;
    initialValues = rest;
  }

  return (
    <Modal isCentered isOpen={isOpen} onClose={() => onSave()}>
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader>{title || "Add New Link"}</ModalHeader>
        <ModalCloseButton />

        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors = {};

            if (values.title.length === 0 || values.title.length > 20) {
              errors.title = "Title must between 1 to 20 characters";
            }

            if (values.url.length === 0 || values.url.length > 1024) {
              errors.url = "URL must between 1 to 1024 characters";
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            onSave(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <ModalBody py={0}>
                <Stack spacing={6}>
                  <Stack>
                    <Field name="title">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.title && form.touched.title}
                        >
                          <FormLabel htmlFor="title">Title</FormLabel>
                          <Input {...field} id="title" />
                          <FormErrorMessage>
                            {form.errors.title}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="url">
                      {({ field }) => (
                        <FormControl isInvalid={errors.url && touched.url}>
                          <FormLabel htmlFor="url">URL</FormLabel>
                          <Input {...field} id="url" />
                          <FormErrorMessage>{errors.url}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>

                  <Field name="show">
                    {({ field }) => (
                      <FormControl as={HStack} spacing={4}>
                        <FormLabel htmlFor="show" mb="0">
                          Link Visibility
                        </FormLabel>
                        <Switch
                          id="show"
                          {...field}
                          colorScheme="green"
                          defaultChecked={existing ? existing.show : true}
                        />
                      </FormControl>
                    )}
                  </Field>
                </Stack>
              </ModalBody>

              <ModalFooter>
                <Button type="submit" colorScheme="blue">
                  Save
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}
