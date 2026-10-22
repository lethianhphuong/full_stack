import type { FormEventHandler, ReactNode } from 'react';
import { FormProvider as RHFFormProvider } from 'react-hook-form';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

// ----------------------------------------------------------------------

type Props<TFieldValues extends FieldValues> = {
  children: ReactNode;
  methods: UseFormReturn<TFieldValues>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  id?: string;
};

export default function FormProvider<TFieldValues extends FieldValues>({ children, methods, onSubmit, id }: Props<TFieldValues>) {
  return (
    <RHFFormProvider {...methods}>
      <form id={id} onSubmit={onSubmit} noValidate>
        {children}
      </form>
    </RHFFormProvider>
  );
}
