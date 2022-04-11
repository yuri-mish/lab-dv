import PropTypes from 'prop-types';
import { TextLine } from '../components/text-line';
import { Field } from './field';

export const CheckData = ({ data }) => (<>
  <TextLine text="Гальмівна система РГС" />
  <Field text={'Загальна питома гальмівна сила'}
    tValue={data?.braking_systems?.form?.brakingSystemRGS}/>
  <Field text={'Коефіцієнт нерівномірності гальмівних сил коліс осі, %'}
    tValue={null}>
    <div style={{ display: 'flex', marginBottom: -20 }}>
      <Field tValue={data?.braking_systems?.form?.unevenBrakingForces?.first}
        tWidth={'45px'} text={null}/>
      <Field tValue={data?.braking_systems?.form?.unevenBrakingForces?.second}
        tWidth={'45px'} text={null}/>
      <Field tValue={data?.braking_systems?.form?.unevenBrakingForces?.third}
        tWidth={'45px'} text={null}/>
      <Field tValue={data?.braking_systems?.form?.unevenBrakingForces?.fourth}
        tWidth={'45px'} text={null}/>
    </div>
  </Field>
  <Field text={'Тривалість спрацювання, с'}
    tValue={data?.braking_systems?.form?.responseTime}/>
  <Field text={'Зусилля на органі керування, Н (РГС)'}
    tValue={data?.braking_systems?.form?.controlEffortsRGS?.value}/>
  <TextLine text="Гальмівна система СГС" />
  <Field text={'Загальна питома гальмівна сила'}
    tValue={data?.braking_systems?.form?.brakingSystemSGS}/>
  <Field text={'Зусилля на органі керування, Н'}
    tValue={data?.braking_systems?.form?.controlEffortsSGS?.value}/>
  <TextLine />
  <br />
  <TextLine text={'Характеристики негативного впливу на навколишнє ' +
      'природне середовище'}/>
  {data?.environmental_impact?.concentrationCO2?.contentCO?.resultNMin && <>
    <TextLine text={'Концентрація оксиду вуглицю, вуглеводнів у спалинах ТЗ' +
        ' з двигунами, що жвиляться бензином або газовим паливом' +
        ' до 01.04.2009'}/>
    <Field text={'Вміст CO,% (Результат n мін)'}
      tValue={data?.environmental_impact?.concentrationCO2?.contentCO
        ?.resultNMin}/>
    <Field text={'Вміст CO,% (Результат n підв)'}
      tValue={data?.environmental_impact?.concentrationCO2?.contentCO
        ?.resultNPidv}/>
    <Field text={'Вміст CH, млн-1 (Результат n мін)'}
      tValue={data?.environmental_impact?.concentrationCO2?.contentCH
        ?.resultNMin}/>
    <Field text={'Вміст CH, млн-1 (Результат n підв)'}
      tValue={data?.environmental_impact?.concentrationCO2?.contentCH
        ?.resultNPidv}/>
  </>}
  {data?.environmental_impact?.concentrationCO2Values?.airOverdimension && <>
    <TextLine text={'Концентрація оксиду вуглицю, вуглеводнів у спалинах ' +
        'ТЗ з двигунами, що жвиляться бензином або газовим паливом після ' +
        '01.04.2009'}/>
    <Field text={'СО, об`ємна частка, % (n мін)'}
      tValue={data?.environmental_impact?.concentrationCO2Values?.volumeCO
        ?.resultNMin}/>
    <Field text={'СО, об`ємна частка, % (n підв)'}
      tValue={data?.environmental_impact?.concentrationCO2Values?.volumeCO
        ?.resultNPidv}/>
    <Field text={'λ(Коефіцієнт надміру повітря)'}
      tValue={data?.environmental_impact?.concentrationCO2Values
        ?.airOverdimension}/>
  </>}
  {data?.environmental_impact?.averageKM1 && <>
    <TextLine text={'Димність спалин ТЗ з дизелем або газодизелем'}/>
    <Field text={'K, m-1 (Середнє значення)'}
      tValue={data?.environmental_impact?.contentCarbonsBurns?.averageKM1}/>
    <Field text={'K, m-1 (Скориговане значення для двигуна КТЗ)'}
      tValue={data?.environmental_impact?.contentCarbonsBurns
        ?.engineKTZValue?.value}/>
  </>}
  <TextLine />
  <br />
  <TextLine text={'Стекла'}/>
  <Field text={'Світлопропускання вітрове скло'}
    tValue={data?.windows_headlights?.checkedParams
      ?.lightTransmissionWindshield?.result}/>
  <Field text={'Світлопропускання 1-го бокового Лівого скла'}
    tValue={data?.windows_headlights?.checkedParams
      ?.lightTransmissionFirstLeftSideWindow?.result}/>
  <Field text={'Світлопропускання 1-го бокового Правого  скла'}
    tValue={data?.windows_headlights?.checkedParams
      ?.lightTransmissionFirstRightSideWindow?.result}/>
  <Field text={'Світлопропускання 2-го бокового Правого скла'}
    tValue={data?.windows_headlights?.checkedParams
      ?.lightTransmissionSecondRightSideWindow?.result}/>
  <Field text={'Світлопропускання 2-го бокового Лівого скла'}
    tValue={data?.windows_headlights?.checkedParams
      ?.lightTransmissionSecondLeftSideWindow?.result}/>
  <Field text={'Світлопропускання заднього скла'}
    tValue={data?.windows_headlights?.checkedParams
      ?.lightTransmissionBackWindow?.result}/>
</>);
CheckData.propTypes = {
  data: PropTypes.object,
};
export default CheckData;
