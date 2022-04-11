import PropTypes from 'prop-types';

import { SelectBox } from 'devextreme-react/select-box';
import { TextArea } from 'devextreme-react/text-area';
import { TagBox } from 'devextreme-react';
import Box, { Item } from 'devextreme-react/box';
import Validator, { RequiredRule } from 'devextreme-react/validator';
import { onValueChanged } from '../../../utils/ep-form';
import { unexpectedCodeInconsistencyText } from 'pages/ep-main/constants';

export const LightFieldInconsistency = (props) => {
  const {
    title,
    placeholder,
    value,
    setForm,
    field,
    codeInconsistency,
    blocked = false,
    requiredRule = false,
    validationGroup,
    multiSelect = false,
  } = props;

  return (
    <Box direction="row" width="100%" crossAlign="center" align="space-between">
      <Item ratio={0} baseSize={'60%'}>
        <span>{title}</span>
      </Item>
      <Item ratio={0} baseSize={'40%'}>
        <div >
          { multiSelect ?
            <TagBox
              {...props}
              dataSource={codeInconsistency}
              onValueChanged={(e) => onValueChanged({ e, setForm, field })}
              value={value[field]}
              stylingMode={'outlined'}
              placeholder={placeholder}
              readOnly={blocked}
              width={'100%'}
              multiline={true}
              wrapItemText={true}
              applyValueMode={'useButtons'}
            >
              <Validator validationGroup={validationGroup}>
                {requiredRule &&
                  <RequiredRule
                    message={`Випадаючий список ${title} є обов'язковим полем`}
                  />
                }
              </Validator>
            </TagBox> :
            <SelectBox
              {...props}
              width={'100%'}
              dataSource={codeInconsistency}
              stylingMode={'outlined'}
              placeholder={placeholder}
              onValueChanged={(e) => onValueChanged({ e, setForm, field })}
              value={value[field]}
              disabled={blocked}
            >
              <Validator validationGroup={validationGroup}>
                {requiredRule && (
                  <RequiredRule
                    message={`Випадаючий список ${title} є обов'язковим полем`}
                  />
                )}
              </Validator>
            </SelectBox>
          }
          {(value[field] === unexpectedCodeInconsistencyText ||
          value[field]?.includes(unexpectedCodeInconsistencyText)) &&
          <TextArea
            {...props}
            style={{ width: '100%' }}
            onValueChange={(e) => onValueChanged(
              { e: { value: e }, setForm, field: 'description' })}
            value={value.description}
            disabled={blocked}
            stylingMode={'outlined'}
            placeholder={'Опис несправності'}
          >
            {requiredRule && <Validator validationGroup={validationGroup}>
              <RequiredRule
                message={`Опис несправності ${title} є обов'язковим полем`}
              />
            </Validator> }
          </TextArea>
          }
        </div>
      </Item>
    </Box>
  );
};

LightFieldInconsistency.propTypes = {
  title: PropTypes.string,
  field: PropTypes.string,
  setForm: PropTypes.func,
  value: PropTypes.object,
  codeInconsistency: PropTypes.array,
  disabled: PropTypes.bool,
  blocked: PropTypes.bool,
  requiredRule: PropTypes.bool,
  placeholder: PropTypes.string,
  validationGroup: PropTypes.string,
  multiSelect: PropTypes.bool,
};
