import PropTypes from 'prop-types';
import { RadioGroup } from 'devextreme-react/radio-group';
import Box, { Item } from 'devextreme-react/box';

export const EpFormFieldISimple = ({
  title,
  radioGroupData,
  stateField,
  value,
  setForm,
  field,
  blocked,
}) => {
  const onRbChange = (e) => {
    setForm((prevState) => {
      const prevField = prevState[stateField];

      return ({
        ...prevState,
        [stateField]: {
          ...prevField,
          [field]: {
            general: e.value,
          },
        },
      });
    });
  };

  const defaultRadioValue = value?.[stateField]?.[field]?.general;

  return (
    <Box direction="row" width="100%" align="center">
      <Item ratio={0} baseSize={'70%'}>
        <span>{title}</span>
      </Item>
      <Item ratio={0} baseSize={'30%'}>
        <RadioGroup
          dataSource={radioGroupData}
          layout="horizontal"
          onValueChanged={onRbChange}
          value={defaultRadioValue}
          disabled={blocked}
        />
      </Item>
    </Box>
  );
};

EpFormFieldISimple.propTypes = {
  title: PropTypes.string,
  radioGroupData: PropTypes.array,
  field: PropTypes.string,
  stateField: PropTypes.string,
  setForm: PropTypes.func,
  value: PropTypes.object,
  blocked: PropTypes.bool,
};
