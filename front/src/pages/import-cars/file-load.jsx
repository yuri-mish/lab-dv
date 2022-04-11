import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { loader } from 'graphql.macro';
import { useApolloClient } from '@apollo/client';
import { showError } from 'utils/notify.js';
import { normalizeData } from './normalize-data/normalize-data';
//components
import { ProgressBar } from 'devextreme-react/progress-bar';
import { FileUploader } from 'devextreme-react/file-uploader';
import { Button } from 'devextreme-react/button';

const getBrands = loader('./gql/getCarBrands.graphql');
const setCars = loader('./gql/setCars.graphql');
const appendCarBrand = loader('./gql/appendCarBrand.graphql');

export const FileLoad = () => {
  const gqlClient = useApolloClient();
  const [ brands, setBrands ] = useState([]);
  const [ progress, setProgress ] = useState(0);
  const [ file, setFile ] = useState(null);
  const chunkSize = 30000; // 30000 ~ 100 rows

  const addCarBrand = async (brand) => {
    console.log(brand);
    brands.push(brand);
    await gqlClient
      .mutate({
        mutation: appendCarBrand,
        variables: { brand },
      })
      .catch((error) => {
        console.log('error addCarBrand', error);
      });
  };
  const sendCarsData = (data, step) => {
    const newData = normalizeData(data, addCarBrand, brands);
    gqlClient
      .query({
        query: setCars,
        variables: { input: newData },
      })
      .then((response) => {
        const res = response;
        if (res) {
          console.log('import res', res);
        }
      })
      .catch((error) => {
        console.log('error', error);
        showError(`помилка запису ${progress}% ${error?.message || ''}`);
      }).finally(() => {
        setProgress((prev) => ((prev + step) > 100 ? 100 : (prev + step)));
      });
  };
  const uploadFileData = async () => {
    setProgress(0);
    if (file) {
      const steps = (file?.size || 1) / chunkSize;
      const step = 100 / steps;
      Papa?.parse(file, {
        worker: true,
        header: true,
        chunkSize,
        chunk: async (chunk) => {
          await sendCarsData(chunk?.data, step);
        },
        error: (error) => {
          console.log('file parse error', error);
        },
      });
    }
  };
  const getBrandsData = () => {
    gqlClient
      .query({
        query: getBrands,
        variables: {},
      })
      .then((response) => {
        const res = response?.data?.car_brand;
        if (res) {
          setBrands(res?.map((item) => item?.name) || []);
        }
      })
      .catch((error) => {
        showError('getBrands error', error);
      });
  };
  useEffect(() => {
    getBrandsData();
  }, []);
  return (
    <>
      <ProgressBar min={0} max={100} value={progress?.toFixed(2)} />
      <FileUploader
        allowedFileExtensions={[ '.csv' ]}
        onValueChanged={() => setFile(null)}
        uploadFile={(file) => setFile(file)} // run after onValueChanged
      />
      <br />
      <Button disabled={!file || (progress > 0 && progress < 100)}
        onClick={uploadFileData}>Вигрузити дані</Button>
    </>
  );
};
export default FileLoad;

