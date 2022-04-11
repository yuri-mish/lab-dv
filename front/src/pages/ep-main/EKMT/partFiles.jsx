import PropTypes from 'prop-types';

//components
import { TextLine } from '../components/text-line';
import { SingleFileUploader } from 'components';
import { FormField } from 'components/form-field/form-field';

import { file_img_types, file_accept } from 'moks/moksData';
import { maxFileSize1MB } from 'app-constants';

const BLANKS_BUCKET_URL = process.env.REACT_APP_BLANKS_BUCKET_URL;

export const PartFiles = ({
  data = {},
  setData = () => {},
}) => (
  <>
    <TextLine text={'Файли'} />
    <FormField textWidth="150px" text={'Файл 1'}>
      <SingleFileUploader
        disabled={!data.draft}
        bucketUrl={BLANKS_BUCKET_URL}
        accept={file_accept}
        allowedFileExtensions={file_img_types}
        maxFileSize={maxFileSize1MB}
        uploadedFileUrl={data.file_1}
        onFileUploaded={(file) => {
          setData((prev) => ({
            ...prev,
            file_1: file.url,
          }));
        }}
        onFileDeleted={() => {
          setData((prev) => ({
            ...prev,
            file_1: '',
          }));
        }}
      />
    </FormField>
    <br />
    <FormField textWidth="150px" text={'Файл 2'}>
      <SingleFileUploader
        disabled={!data.draft}
        bucketUrl={BLANKS_BUCKET_URL}
        accept={file_accept}
        allowedFileExtensions={file_img_types}
        maxFileSize={maxFileSize1MB}
        uploadedFileUrl={data.file_2}
        onFileUploaded={(file) => {
          setData((prev) => ({
            ...prev,
            file_2: file.url,
          }));
        }}
        onFileDeleted={() => {
          setData((prev) => ({
            ...prev,
            file_2: '',
          }));
        }}
      />
    </FormField>
    <br />
  </>
);

PartFiles.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
};
export default PartFiles;
