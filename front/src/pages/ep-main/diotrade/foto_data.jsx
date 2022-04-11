import PropTypes from 'prop-types';

import { mockText } from 'moks/moksData';
import { TextLine } from '../components/text-line';
import { ImageField } from './image_field';

export const FotoData = ({ data }) => (<>
  <TextLine text={''}/>
  <ImageField
    text={mockText?.foto_technical_passport_1}
    path={data?.foto_technical_passport_1}
  />
  <ImageField
    text={mockText?.foto_technical_passport_2}
    path={data?.foto_technical_passport_2}
  />
  <ImageField
    text={mockText?.foto_auto_left}
    path={data?.foto_auto_left}
  />
  <ImageField
    text={mockText?.foto_auto_right}
    path={data?.foto_auto_right}
  />
  <ImageField
    text={mockText?.foto_odometr}
    path={data?.foto_odometr}
  />
  <ImageField
    text={mockText?.foto_vin}
    path={data?.foto_vin}
  />
  <ImageField
    text={'Фото реглоскопу'}
    path={data?.windows_headlights?.photo?.photo_relogoskop}
  />
  <ImageField
    // text={'Фото таблички (Характеристики негативного впливу ' +
    //     'на навколишнє природне середовище)'}
    // path={data?.environmental_impact?.photo.photo_table}
    text={'Фото таблички'}
    path={data?.photo_table}
  />
</>);
FotoData.propTypes = {
  data: PropTypes.object,
};
export default FotoData;
