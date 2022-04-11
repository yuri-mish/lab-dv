import {
  mockVehicle,
  mockVehicleCitiesSearch,
  mockVehicleTypesList,
} from './mockData';
export const testGetToken = () => {
  const headers = {};
  headers['Access-Control-Allow-Origin'] =
    'https://test.xsurance.com.ua/auth/token';
  // headers['Access-Control-Allow-Origin'] = `https://foo.'invalid`;
  headers['Access-Control-Allow-Credentials'] = 'true';
  headers['Access-Control-Expose-Headers'] = '*';
  const requestOptions = {
    method: 'POST',
    redirect: 'follow',
    // credentials: 'include',
    headers,
  };
  const res = {};
  fetch('https://test.xsurance.com.ua/auth/token?username=otk-service&password=Vqf7bLGxCkE6VJ', requestOptions)
    .then((response) => {
      res.response = response;
      return response.text();
    })
    .then((result) => {
      res.result = result;
      console.log(result);
    })
    .catch((error) => {
      res.error = error;
      console.log('error', error);
    });
  return res;
};
export const getVehicleByPlateNum = async (plateNumber) => {
  console.log('plateNumber', plateNumber);
  let res = null;
  if (plateNumber === 'АА0825РК') {
    res = mockVehicle;
  }
  return res;
};

export const getVehicleCitiesSearch = async (search) => {
  console.log('VehicleCitiesSearch', search);
  let res = null;
  if (search === '111') {
    res = mockVehicleCitiesSearch;
    console.log('mockVehicleCitiesSearch', mockVehicleCitiesSearch);
  }
  return res;
};
export const getVehicleTypesList = async () => {
  let res = null;
  res = mockVehicleTypesList.map((item) => ({
    title: `${item?.code} (${item?.name})`,
    value: item?.code }));
  console.log('mockVehicleTypesList', res);
  return res;
};

