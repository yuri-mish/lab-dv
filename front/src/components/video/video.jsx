/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import styles from './video.module.scss';

export const Video = ({
  title = '',
  previewType = 'maxres',
  resolution = { w: '560', h: '315' },
  videoId: id,
}) => {
  const [ iframePlaceholder, setIframePlaceholder ] = useState(true);
  const videoSrcUrl = `https://www.youtube.com/embed/${id}/?rel=0&showinfo=0&autoplay=1`;
  const srcSetUrl = `https://i.ytimg.com/vi_webp/${id}/${previewType}default.webp`;
  const imgSrcUrl = `https://i.ytimg.com/vi/${id}/${previewType}default.jpg`;

  useEffect(() => {
    setIframePlaceholder(true);
  }, [ id ]);

  return (
    <div
      className={styles.video}
      style={{
        width: '100%',
        paddingBottom: `${(100 * resolution.h) / resolution.w}%`,
      }}
      onClick={() => setIframePlaceholder(false)}
    >
      {iframePlaceholder ?
        <>
          <picture>
            <source srcSet={srcSetUrl} type='image/webp' />
            <img src={imgSrcUrl} alt={title} />
          </picture>
          <button>
            <svg width='68' height='48' viewBox='0 0 68 48'>
              <path
                className={styles.shape}
                d='M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z' />
              <path className={styles.icon} d='M 45,24 27,14 27,34' />
            </svg>
          </button>
        </> :

        <iframe
          loading='lazy'
          width={resolution.w}
          height={resolution.h}
          src={videoSrcUrl}
          title={title}
          frameBorder="0"
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
      }
    </div>
  );
};

Video.propTypes = {
  videoId: PropTypes.string.isRequired,
  title: PropTypes.string,
  resolution: PropTypes.shape({
    w: PropTypes.string.isRequired,
    h: PropTypes.string.isRequired,
  }),
  previewType: PropTypes.oneOf([ 'maxres', 'hq' ]),
};
