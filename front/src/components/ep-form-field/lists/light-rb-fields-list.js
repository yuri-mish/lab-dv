import { LightFieldsRB } from '../light-fields/ep-form-field-rb';

export const LightRbFieldsList = (props) => {
  const { fields, value, blocked, setForm, ...otherProps } = props;

  return (
    fields.map((item) => (
      <LightFieldsRB
        key={item.field}
        value={value}
        setForm={setForm}
        blocked={blocked}
        {...item}
        {...otherProps}
      />
    ))
  );
};
