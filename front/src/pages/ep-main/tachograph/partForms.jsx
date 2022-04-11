import PropTypes from 'prop-types';

import { TextLine } from '../components/text-line';
import { CheckItem } from '../components/check-item';
import { check_taho_list } from 'moks/moksData';
import styles from '../styles/ep-main.module.scss';

export const PartForms = ({
  data = {},
  handleCheckItem = () => {},
}) => (
  <>
    <TextLine text={'Результати перевірки'} />
    <div className={`${styles?.df_space_around} ${styles?.df_wrap}`}>
      {check_taho_list &&
        check_taho_list.map((item, index) => (
          <CheckItem
            style={{ width: 300 }}
            description={false}
            key={index}
            text={item?.text}
            status={data[item?.field]?.status}
            handleClick={() => handleCheckItem(item)}
            textWrap={true}
          />
        ))}
    </div>
  </>
);
PartForms.propTypes = {
  data: PropTypes.object,
  handleCheckItem: PropTypes.func,
};
export default PartForms;
