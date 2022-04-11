import PropTypes from 'prop-types';

import { RadioGroup } from 'devextreme-react/radio-group';
import { Tooltip } from 'devextreme-react/tooltip';
import Box, { Item } from 'devextreme-react/box';

export const LightFieldsRB = ({
  title,
  radioGroupData,
  value,
  setForm,
  field,
  blocked,
  tooltipText = '',
}) => {
  const defaultValue = value[field]?.general;

  const onRbChange = (e) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: {
        general: e.value,
      },
    }));
  };

  return (
    <>
      <Box direction="row" width="100%" align="center">
        <Item ratio={0} baseSize={'60%'}>
          {tooltipText && <Tooltip target={ `#id_tool_${field}` }
            contentRender={() => <p>{tooltipText}</p>}
            position="right"
            showEvent="dxhoverstart"
            hideEvent="dxhoverend"
          />}
          <span id={ `id_tool_${field}` } style={{ width: 'fit-content' }}>
            {title}
          </span>
        </Item>
        <Item ratio={0} baseSize={'40%'}>
          <RadioGroup
            dataSource={radioGroupData}
            layout="horizontal"
            value={defaultValue}
            onValueChanged={onRbChange}
            disabled={blocked}
          />
        </Item>
      </Box>
    </>
  );
};

LightFieldsRB.propTypes = {
  title: PropTypes.string,
  radioGroupData: PropTypes.array,
  field: PropTypes.string,
  tooltipText: PropTypes.string,
  setForm: PropTypes.func,
  value: PropTypes.object,
  codeInconsistency: PropTypes.array,
  disabled: PropTypes.bool,
  blocked: PropTypes.bool,
  placeholder: PropTypes.string,
};
