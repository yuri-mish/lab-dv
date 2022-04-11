// import './style.scss';
import PropTypes from 'prop-types';
import styles from '../styles/style.module.scss';
import { Button } from 'devextreme-react/button';
export const setValueForAll = ({
  elements = [],
  setData = () => {},
  stateField,
  val = 'Нз',
}) => {
  const fields = {};
  elements
    ?.forEach((item) => { fields[item.field] = { general: val }; });
  stateField ? setData((prev) => ({ ...prev, [stateField]: { ...fields } })) :
    setData((prev) => ({ ...prev, ...fields }));
};
export const SetAllValues = ({
  elements = [],
  setData = () => {},
  blocked = false,
  buttons = [ 'Так', 'Ні', 'Нз' ],
  stateField,
  ...props
}) => (
  <div className={styles.set_all_wrap} {...props}>
    <span>Задати для всіх: </span>
    {buttons?.map((item, index) => <Button
      key={index}
      text={item}
      onClick={() => setValueForAll({
        elements, setData, stateField, val: item })}
      disabled={blocked}
    />)}
  </div>
);

SetAllValues.propTypes = {
  elements: PropTypes.array,
  setData: PropTypes.func,
  blocked: PropTypes.bool,
  buttons: PropTypes.array,
  stateField: PropTypes.string,
};
