import { StickyBar } from 'components';
import { manuals } from 'manuals';
import { useHistory } from 'react-router';
import styles from './manuals.module.scss';

export const ManualMOC = () => {
  const history = useHistory();
  return (
    <div>
      <StickyBar>
        <div className='otk-info-bar'>Довідка</div>
      </StickyBar>

      <div className='content-block otk-content-block'>
        <div className='otk-doc-container otk-doc-form dx-card'>
          <ul>
            {manuals.map((manual) => (
              <li className={styles.mocItem} key={manual.pageId}>
                <a
                  className={styles.manualLink}
                  onClick={() => history.push(`/manual/${manual.pageId}`)}
                >
                  {manual.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
