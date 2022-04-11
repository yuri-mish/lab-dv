import PropTypes from 'prop-types';
import { Field } from './field';
import codesData from 'moks/codesData.json';

export const CodesData = ({ data }) => {
  const { codes_mismatch } = data;
  const codes = codes_mismatch?.replaceAll('; ', ';')
    ?.slice(0, -1)?.split(';') || [];
  const uniqCodes = [ ...new Set(codes) ];
  return (<>
    {uniqCodes?.map((item, index) => <div key={index}
      style={{ display: 'flex' }}>
      <Field text={null} tValue={item} tWidth={'75px'}/>
      <Field text={null} tValue={codesData[item]?.text} tWidth={'500px'}
        type="multiLine" />
    </div>)}
  </>);
};
CodesData.propTypes = {
  data: PropTypes.object,
};
export default CodesData;
