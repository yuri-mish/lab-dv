import PropTypes from 'prop-types';
import { mockText, file_img_types, file_accept } from 'moks/moksData';
import Validator, { RequiredRule } from 'devextreme-react/validator';
import { required } from 'pages/ep-main/constants';
//components
import { TextLine } from '../components/text-line';
import { SingleFileUploader } from 'components';
import { FormField } from 'components/form-field/form-field';
import { maxFileSize2MB } from 'app-constants';

const BLANKS_BUCKET_URL = process.env.REACT_APP_BLANKS_BUCKET_URL;

export const Files = ({
  data = {},
  setData = () => {},
}) => (
  <>
    <TextLine text={'Файли'} />
    <FormField textWidth="270px" text={mockText?.foto_check_res}>
      <SingleFileUploader
        bucketUrl={BLANKS_BUCKET_URL}
        accept={file_accept}
        allowedFileExtensions={file_img_types}
        maxFileSize={maxFileSize2MB}
        uploadedFileUrl={data?.foto_check_res}
        disabled={!data?.draft}
        onFileUploaded={(file) => {
          setData((prev) => ({
            ...prev,
            foto_check_res: file.url,
          }));
        }}
        onFileDeleted={() => {
          setData((prev) => ({
            ...prev,
            foto_check_res: '',
          }));
        }}
      >
        <Validator>
          {!data?.foto_check_res &&
          (<RequiredRule
            message={`${mockText?.foto_check_res
              } - ${required}`}
          />)
          }
        </Validator>
      </SingleFileUploader>
    </FormField>
    <br />
    <FormField textWidth="270px"
      text={mockText?.foto_technical_passport_1}>
      <SingleFileUploader
        bucketUrl={BLANKS_BUCKET_URL}
        accept={file_accept}
        allowedFileExtensions={file_img_types}
        maxFileSize={maxFileSize2MB}
        uploadedFileUrl={data?.foto_technical_passport_1}
        disabled={!data?.draft}
        onFileUploaded={(file) => {
          setData((prev) => ({
            ...prev,
            foto_technical_passport_1: file.url,
          }));
        }}
        onFileDeleted={() => {
          setData((prev) => ({
            ...prev,
            foto_technical_passport_1: '',
          }));
        }}
      >
        <Validator>
          {!data?.foto_technical_passport_1 &&
          (<RequiredRule
            message={`${mockText?.foto_technical_passport_1
              } - ${required}`}
          />)
          }
        </Validator>
      </SingleFileUploader>
    </FormField>
    <br />
    <FormField textWidth="270px"
      text={mockText?.foto_technical_passport_2}>
      <SingleFileUploader
        bucketUrl={BLANKS_BUCKET_URL}
        accept={file_accept}
        allowedFileExtensions={file_img_types}
        maxFileSize={maxFileSize2MB}
        uploadedFileUrl={data?.foto_technical_passport_2}
        type={'required'}
        message={'Choose a file'}
        disabled={!data?.draft}
        onFileUploaded={(file) => {
          setData((prev) => ({
            ...prev,
            foto_technical_passport_2: file.url,
          }));
        }}
        onFileDeleted={() => {
          setData((prev) => ({
            ...prev,
            foto_technical_passport_2: '',
          }));
        }}
      >
        <Validator>
          {!data?.foto_technical_passport_2 &&
          (<RequiredRule
            message={`${mockText?.foto_technical_passport_2
              } - ${required}`}
          />)
          }
        </Validator>
      </SingleFileUploader>
    </FormField>
    <br />
    <FormField textWidth="270px" text={mockText?.foto_auto_general}>
      <SingleFileUploader
        bucketUrl={BLANKS_BUCKET_URL}
        accept={file_accept}
        allowedFileExtensions={file_img_types}
        maxFileSize={maxFileSize2MB}
        uploadedFileUrl={data?.foto_auto_left}
        disabled={!data?.draft}
        onFileUploaded={(file) => {
          setData((prev) => ({
            ...prev,
            foto_auto_left: file.url,
          }));
        }}
        onFileDeleted={() => {
          setData((prev) => ({
            ...prev,
            foto_auto_left: '',
          }));
        }}
      >
        <Validator>
          {!data?.foto_auto_left &&
          (<RequiredRule
            message={`${mockText?.foto_auto_left
              } - ${required}`}
          />)
          }
        </Validator>
      </SingleFileUploader>
    </FormField>
    <br />
    <FormField textWidth="270px" text={mockText?.foto_norms}>
      <SingleFileUploader
        bucketUrl={BLANKS_BUCKET_URL}
        accept={file_accept}
        allowedFileExtensions={file_img_types}
        maxFileSize={maxFileSize2MB}
        uploadedFileUrl={data?.foto_norms}
        disabled={!data?.draft}
        onFileUploaded={(file) => {
          setData((prev) => ({
            ...prev,
            foto_norms: file.url,
          }));
        }}
        onFileDeleted={() => {
          setData((prev) => ({
            ...prev,
            foto_norms: '',
          }));
        }}
      >
        <Validator>
          {!data?.foto_norms &&
          (<RequiredRule
            message={`${mockText?.foto_norms
              } - ${required}`}
          />)
          }
        </Validator>
      </SingleFileUploader>
    </FormField>
    <br />
  </>
);

Files.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
};
export default Files;
