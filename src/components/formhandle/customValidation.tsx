/* eslint-disable prettier/prettier */
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

type ValidationSchema = {
  [key: string]: {
    validate: (value: string | File | any) => string | File | null | any;
  };
};

type Values = {
  [key: string]: string;
};

type Errors = {
  [key: string]: string;
};

type Touched = {
  [key: string]: boolean;
};

type useFormProps = {
  initialValues: Values;
  validationSchema: ValidationSchema;
  onSubmit: (values: Values) => void;
};

const useForm = ({
  initialValues,
  validationSchema,
  onSubmit,
}: useFormProps) => {
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    const newValue: any = files ? files[0] : value;
    setValues({
      ...values,
      [name]: newValue,
    });
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const handleBlur = (event: ChangeEvent<any>) => {
    const { name } = event.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    validateForm();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    validateForm();
    setIsSubmitting(true);
  };

  const validateForm = () => {
    const validationErrors: Errors = {};
    Object.keys(validationSchema).forEach((key) => {
      const fieldValue = values[key];
      const fieldRules = validationSchema[key];
      const fieldError = fieldRules.validate(fieldValue);
      if (fieldError) {
        validationErrors[key] = fieldError;
      }
    });
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Effect to handle form submission
  useEffect(() => {
    if (isSubmitting) {
      if (Object.keys(errors).length === 0) {
        onSubmit(values);
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
      }
    }
  }, [errors, isSubmitting, onSubmit, values]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  };
};

export default useForm;
