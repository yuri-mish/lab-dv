import { useState, useRef } from 'react';
import { FileUploader } from 'devextreme-react/file-uploader';
import { Button } from 'devextreme-react';
import { v4 as uuid_v4 } from 'uuid';
import { useApolloClient, gql } from '@apollo/client';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import { openDoc } from 'utils/open-doc';

import './styles.scss';
import styles from './styles.module.scss';
import { watermark } from './waretmark';


const GET_UPLOAD_URL = gql`
  query ($uploadFileName: String) { 
    getNewFileUrl(fileName: $uploadFileName) 
  }
`;


export const SingleImageFileUploader = ({
  onFileUploaded = () => {},
  onFileDeleted = () => {},
  uploadedFileUrl = '',
  disabled = false,
  width = '100%',
  showImg = false,
  ...props
}) => {
  const [ file, setFile ] = useState([]);
  const gqlClient = useApolloClient();

  const fileUploaderRef = useRef();
  const humanFileName = uploadedFileUrl?.substring?.(
    uploadedFileUrl.lastIndexOf('|') === -1 ?
      uploadedFileUrl.lastIndexOf('/') + 1 :
      uploadedFileUrl.indexOf('|') + 1,
  ) || '';
  const uploadFile = async (file, progressCb) => {
    const watermarkText = dayjs().format('DD-MM-YYYY');
    const newFile = await watermark({ file, watermarkText });
    const uploadFileName = `${uuid_v4()}|${file.name}`;

    const qlResponse = await gqlClient.query({
      query: GET_UPLOAD_URL,
      variables: {
        uploadFileName,
      },
    });

    if (qlResponse.errors) {
      console.log('failed to get upload url');
      return Promise.reject();
    }

    const uploadUrl = qlResponse.data.getNewFileUrl;
    if (!uploadUrl) {
      console.log('invalid upload url');
      return Promise.reject();
    }

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);

    const uploadResult = new Promise((resolve, reject) => {
      xhr.upload.onprogress = (e) => {
        progressCb(e.loaded, e.total);
      };
      xhr.onload = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            file.url = props.bucketUrl + uploadFileName;
            file.newName = uploadFileName;
            resolve();
          } else {
            reject();
          }
        }
      };
      xhr.onerror = () => {
        console.log(`failed to upload ${uploadFileName}`);
        reject();
      };
    });
    // xhr.send(file);
    xhr.send(newFile);
    return uploadResult;

  };

  const removeFileAfter = (delay = 0) => {
    setTimeout(() => setFile([]), delay);
  };
  const handleFolderButtonClick = () => {
    try {
      fileUploaderRef.current.instance._isCustomClickEvent = true;
      const el = fileUploaderRef.current.instance._$content[0]
        .querySelectorAll('.dx-fileuploader-button')[0];
      let evt;
      if (document.createEvent) {
        evt = document.createEvent('MouseEvents');
        // eslint-disable-next-line function-call-argument-newline
        evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0,
          false, false, false, false, 0, null,
        );
      }
      evt ? el.dispatchEvent(evt) : el.click && el.click();
    // eslint-disable-next-line no-empty
    } catch {}
  };

  return (
    <div
      className={styles?.container}
      style={{
        width,
      }}
    >

      <Button
        className={styles?.folderButton}
        icon='folder'
        disabled={disabled}
        onClick={handleFolderButtonClick}
        hint={uploadedFileUrl ? '?????????????? ????????' : '?????????????? ????????'}
      />

      {file.length === 0 &&
        (uploadedFileUrl ?
          <>
            <div
              className=
                {`${styles?.removeButton} dx-icon-remove`}
              title='???????????????? ????????'
              disabled={disabled}
              onClick={(e) => {
                if (uploadedFileUrl) {
                  onFileDeleted(e);
                }
              }}
            />
            <a
              className={styles?.uploaderLink}
              title={humanFileName}
              href={uploadedFileUrl}
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => {
                openDoc(uploadedFileUrl);
              }}
            >
              {showImg ? (<img className={styles?.imagePreview}
                src={uploadedFileUrl} alt={humanFileName}/>) :
                <span className={styles?.uploaderLinkText}>
                  {humanFileName}
                </span>}
            </a>
          </> :
          <div
            className={styles?.nofileText}
          >
            ???????? ???? ????????????????????????
          </div>
        )
      }
      <FileUploader
        {...props}
        ref={fileUploaderRef}
        value={file}
        disabled={disabled}
        className={
          `single-file-uploader ${file.length > 0 && 'hide-fileuploader-input'}`
        }
        labelText=''
        showFileList={!!file}
        uploadFile={
          uploadFile
        }
        onUploadError={() => {
          removeFileAfter(6000);
        }}
        onUploaded={(e) => {
          removeFileAfter(3000);
          onFileUploaded(e.file);
        }}
        selectButtonText={uploadedFileUrl ? '?????????????? ????????' : '?????????????? ????????'}
        onValueChanged={(e) => {
          setFile(e.value || []);
        }}
        width={width}
      >
      </FileUploader>
    </div>
  );
};

SingleImageFileUploader.propTypes = {
  onFileUploaded: PropTypes.func,
  onFileDeleted: PropTypes.func,
  uploadedFileUrl: PropTypes.string,
  disabled: PropTypes.bool,
  showImg: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  accept: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  bucketUrl: PropTypes.string.isRequired,
};
