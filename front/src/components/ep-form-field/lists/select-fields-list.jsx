import { EpFormFieldSelect } from '../ep-form-field-select';

export const SelectFieldsList = (props) => {
  const {
    fields,
    form,
    blocked,
    setForm,
    validationGroup,
    ...otherProps
  } = props;

  return (
    fields.map((item) => {
      const { field } = item;
      const disabled = form[field]?.general !== 'Ні';

      return (
        <EpFormFieldSelect
          {...props}
          key={field}
          field={field}
          disabled={disabled}
          setForm={setForm}
          value={form[field]}
          blocked={blocked}
          {...item}
          {...otherProps}
          validationGroup={validationGroup}
        />
      );
    })
  );
};
