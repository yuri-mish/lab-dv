import styles from './status-cell-render.module.scss';

export const statusCellRender = (data, colorizeRules) => <div
  className={
    `${styles.status} otk-tag otk-status otk-status-${
      colorizeRules[data.value]
    }`
  }
>
  {data.displayValue}
</div>;


