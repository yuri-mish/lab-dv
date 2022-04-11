/* eslint-disable no-unused-vars */
import { Button } from 'devextreme-react/button';
import styles from './version-check.module.scss';
import { appInfo } from 'app-info';
import { useMessageVars, useMessageHandler } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';


const checkVersion = (version, minRequiredVersion) => {
  const [ majorVersion, minorVersion ] = version.split('.');
  const [ minMajorVersion, minMinorVersion ] = minRequiredVersion.split('.');
  return ((majorVersion * 1000) + minorVersion) >=
    ((minMajorVersion * 1000) + minMinorVersion);
};

const reload = () => {
  window.location.reload();
};

export const VersionCheck = () => {
  const [ toastHidden, setToastHidden ] = useState(false);
  const [ minVersion ] = useMessageVars([ 'minVersion' ]);
  const msgHandler = useMessageHandler();

  const isVersionOk = useMemo(
    () => checkVersion(appInfo.version, minVersion),
    [ minVersion ],
  );

  useEffect(() => {
    if (isVersionOk) {
      msgHandler.removeByType('newVersion');
    } else {
      toast.error(
        <>
          <span className={styles.mainMsg}>Версія застаріла.</span>
          <br />
          <span>Натисніть щоб оновити.</span>
        </>,
        {
          onClose: () => setToastHidden(true),
          onClick: reload,
          autoClose: false,
          hideProgressBar: true,
        },
      );
    }
  }, [ isVersionOk ]);

  return (!isVersionOk && toastHidden ?
    <Button icon='warning' className={styles.button}
      type='danger'
      text='Версія'
      onClick={reload}
    /> : null
  );
};

