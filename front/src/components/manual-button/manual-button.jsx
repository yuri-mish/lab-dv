import { Button } from 'devextreme-react/button';
import { useHistory } from 'react-router-dom';
import styles from './manual-button.module.scss';

export const ManualButton = () => {
  const history = useHistory();

  return (
    <Button
      className={styles.button}
      focusStateEnabled={false}
      icon='help'
      hint={'Iнструкцiя'}
      onClick={() => history.push('/manuals-moc')}
    />
  );
};
