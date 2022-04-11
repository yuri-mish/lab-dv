import { StickyBar, Video } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { loadFile } from 'utils/load-file';
import { manuals } from 'manuals';
import { Menu } from 'devextreme-react';
import styles from './manuals.module.scss';
import { buildClass } from 'utils/build-classname';

const CUT_LENGTH = 20;

const normalizeName = (name) => (
  name.length > CUT_LENGTH ?
    `${name.slice(0, CUT_LENGTH - 1)}..` :
    name + '\u00A0'.repeat(CUT_LENGTH - name.length)
);

export const ManualPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [ mdFile, setMdFile ] = useState('');
  const { current, prev, next } = useMemo(() => {
    const currentIndex = manuals.findIndex((man) => man.pageId === id);
    return {
      current: manuals[currentIndex],
      next: manuals[currentIndex + 1],
      prev: manuals[currentIndex - 1],
    };
  }, [ id ]);

  const pageClass = buildClass(
    'otk-doc-container otk-doc-form dx-card',
    styles.page,
  );

  const url = window.location.origin;
  const baseUrl = `${url}/manuals/`;

  useEffect(async () => {
    const marked = await import('marked');
    marked.setOptions({
      baseUrl,
      silent: true,
    });

    loadFile(`${baseUrl}${current.manualPath}`)
      .then((res) => {
        setMdFile(marked.parse(res));
      }).catch(() => {});
  }, [ current ]);

  return (
    <div>
      <StickyBar>
        <Menu
          cssClass={styles.menu}
          activeStateEnabled={false}
          onItemClick={(e) => {
            switch (e.itemData.id) {
            case 'prev':
              history.push(`/manual/${prev.pageId}`);
              break;
            case 'next': {
              history.push(`/manual/${next.pageId}`);
              break;
            }
            case 'toMOC': {
              history.push('/manuals-moc');
              break;
            }
            default:
            }
          }}
          dataSource={[
            {
              text: prev ? normalizeName(prev.name) : '',
              icon: 'chevronprev',
              id: 'prev',
              visible: !!prev,
            },
            {
              text: next ? normalizeName(next.name) : '',
              icon: 'chevronright',
              id: 'next',
              visible: !!next,
            },
            {
              text: 'До списку',
              icon: 'orderedlist',
              id: 'toMOC',
            },
          ]}
        />
      </StickyBar>

      <div className='content-block otk-content-block'>
        <div className={pageClass}>
          <h1 className={styles.name}>{current.name}</h1>
          <div dangerouslySetInnerHTML={{ __html: mdFile }}></div>
          {current?.videoId &&
            <Video
              videoId={current.videoId}
              resolution={{ w: '640', h: '480' }}
              previewType='hq'
            />
          }
        </div>
      </div>
    </div>
  );
};
