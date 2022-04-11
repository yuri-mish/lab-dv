import PropTypes from 'prop-types';
import { PrintPDFbtn } from './printPDF';
import { PrintTahoPDFbtn } from './printTahograph';
import { PrintCO2btn } from './printCO2';

export const PrintBTNadapter = ({
  data = {},
  handlePdfLoading = () => {},
  ...props
}) => {
  const { type } = data;
  switch (type) {
  case 'ОТК':
    return <PrintPDFbtn {...props} data={data}
      handlePdfLoading={handlePdfLoading}/>;
  case 'Taho':
    return <PrintTahoPDFbtn {...props} data={data}
      handlePdfLoading={handlePdfLoading}/>;
  case 'CO2':
    return <PrintCO2btn {...props} data={data}
      handlePdfLoading={handlePdfLoading}/>;
  default:
    return <div style={{ height: 9 }}/>;
  }
};


PrintBTNadapter.propTypes = {
  data: PropTypes.object,
  handlePdfLoading: PropTypes.func,
};
export default PrintBTNadapter;
