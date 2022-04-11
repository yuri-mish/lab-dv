import React from 'react';
import { FileLoad } from './file-load';
import styles from './styles/style.module.scss';
export const ImportCars = () => (
  <div className={styles?.container}>
    <h2>Для імпорту виберіть файл з розширенням .csv</h2>
    <FileLoad/>
  </div>
);
export default ImportCars;
