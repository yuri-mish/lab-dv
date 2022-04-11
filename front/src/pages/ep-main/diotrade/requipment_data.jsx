import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { mockText } from 'moks/moksData';
import { Field } from './field';
import { dateShortFormatU } from 'utils/date-formats';

export const RequipmentData = ({ data }) => (<>
  <Field text={mockText?.auto?.re_equipment_description}
    tValue={data?.re_equipment_description}/>
  <Field text={mockText?.auto?.re_equipment_name}
    tValue={data?.re_equipment_name}/>
  <Field text={mockText?.auto?.re_equipment_doc_number}
    tValue={data?.re_equipment_doc_number}/>
  <Field text={mockText?.auto?.re_equipment_date}
    tValue={data?.re_equipment_date ?
      dayjs(data?.re_equipment_date)?.format(dateShortFormatU) : ''}/>

</>);
RequipmentData.propTypes = {
  data: PropTypes.object,
};
export default RequipmentData;
