import PropTypes from 'prop-types';
//components
import { TextLine } from '../components/text-line';
import { CheckItem } from '../components/check-item';


export const Forms = ({
  data = {},
  handleCheckItem = () => {},
}) => (
  <>
    <TextLine text={'Результати перевірки'} />
    <CheckItem
      text={'Характеристики негативного впливу на навколишнє ' +
      'природне середовище'}
      status={data?.co2_environmental_impact?.status}
      handleClick={() => {
        handleCheckItem({
          text: 'Характеристики негативного впливу на навколишнє ' +
            'природне середовище',
          field: 'co2_environmental_impact',
        });
      }}
    />
  </>
);

Forms.propTypes = {
  data: PropTypes.object,
  handleCheckItem: PropTypes.func,
};
export default Forms;
