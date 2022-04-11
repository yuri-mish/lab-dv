// import './style.scss';
import PropTypes from 'prop-types';
import styles from '../styles/style.module.scss';

export const CheckItem = ({
  text = '',
  status = '',
  description = true,
  activeFor,
  checkList = [],
  textWrap = '',
  handleClick = () => {},
  ...props
}) => {
  let active = !activeFor;
  activeFor?.forEach((element) => {
    if (checkList?.includes(element)) active = true;
  });
  return (
    <div
      className={`${styles?.check_item_wrap} ${styles[status]}
        ${active && styles?.active}`}
      {...props}
    >
      <div className={styles?.icon}
        onClick={() => { active && handleClick(); }}/>
      {text && (
        <span onClick={() => { active && handleClick(); }}
          className={textWrap && styles?.textWrap}>
          {text}
          {description && <span className={styles?.description}>{text}</span>}
        </span>
      )}
    </div>
  );
};

CheckItem.propTypes = {
  text: PropTypes.string,
  status: PropTypes.string,
  description: PropTypes.bool,
  textWrap: PropTypes.bool,
  activeFor: PropTypes.array,
  checkList: PropTypes.array,
  handleClick: PropTypes.func,
};
