import { useScreenSize } from 'utils/media-query';
import PropsTypes from 'prop-types';
import styles from './doc-info-block.module.scss';


export const DocInfoBlock = (props) => {
  const { isXSmall } = useScreenSize();
  return (
    <div
      className={`${styles.container} ${isXSmall ? styles.small : ''}`}
    >
      <div className={styles.content}>
        {props.lines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        <div>
          {props.children}
        </div>
      </div>
    </div>
  );
};

DocInfoBlock.propTypes = {
  children: PropsTypes.node,
  lines: PropsTypes.arrayOf(PropsTypes.string),
};
