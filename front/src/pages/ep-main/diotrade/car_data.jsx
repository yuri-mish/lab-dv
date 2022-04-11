import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { mockText } from 'moks/moksData';
import { Field } from './field';
import { dateShortFormatU } from 'utils/date-formats';

export const CarData = ({ data }) => (<>
  <Field text={mockText?.auto?.number} tValue={data?.car_number}/>
  <Field text={mockText?.auto?.manufacture_date}
    tValue={data?.manufacture_date ?
      dayjs(data?.manufacture_date)?.format('YYYY') : ''}/>
  <Field text={mockText?.auto?.first_registration_date}
    tValue={data?.first_registration_date ?
      dayjs(data?.first_registration_date)?.format(dateShortFormatU) : ''}/>
  <Field text={mockText?.auto?.last_registration_date}
    tValue={data?.last_registration_date ?
      dayjs(data?.last_registration_date)?.format(dateShortFormatU) : ''}/>
  <Field text={mockText?.auto?.car_brand} tValue={data?.car_brand}/>
  <Field text={mockText?.auto?.car_model} tValue={data?.car_model}/>
  <Field text={mockText?.auto?.category_KTZ}
    tValue={data?.category_KTZ_text}/>
  <Field text={mockText?.auto?.carrying} tValue={data?.carrying}/>
  <Field text={mockText?.auto?.ecological} tValue={data?.ecological}/>
  <Field text={mockText?.auto?.vin} tValue={data?.vin}/>
  <Field text={mockText?.auto?.odometer} tValue={data?.odometer}/>
  <Field text={mockText?.auto?.purpose} tValue={data?.purpose}/>
  <br />
  <Field text={mockText?.auto?.fuel_type} tValue={data?.fuel_type}/>
  <Field text={mockText?.auto?.car_color} tValue={data?.car_color}/>
  <Field text={mockText?.auto?.turbine_compressor}
    tValue={data?.turbine_compressor}/>
  <Field text={mockText?.auto?.cylinders} tValue={data?.cylinders}/>


</>);
CarData.propTypes = {
  data: PropTypes.object,
};
export default CarData;
