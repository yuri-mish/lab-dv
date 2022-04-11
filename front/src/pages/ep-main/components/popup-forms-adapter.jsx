// import './style.scss';
import PropTypes from 'prop-types';
//forms
import { GeneralCharacteristics } from './forms/general-characteristics';
import { ProtectiveDevices } from './forms/protective-devices';
import { EngineSystems } from './forms/engine-systems';
import { ControlSystem } from './forms/control-system';
import { TyresWheels } from './forms/tyres-wheels';
import { BrakingSystems } from './forms/braking-system';
import { WindowsHeadlights } from './forms/windows-headlights';
import { OtherEquipments } from './forms/other-equipment';
import { EnvironmentalImpact } from './forms/environmental-impact';
import { CO2EnvironmentalImpact } from './forms/co2-environmental-impact';
import { NoiseLevel } from './forms/noise-level';
import { FirstDodatok } from './forms/dodatok-1';
import { SecondDodatok } from './forms/dodatok-2';
import { ThirdDodatok } from './forms/dodatok-3';
import { FourthDodatok } from './forms/dodatok-4';
import { FifthDodatok } from './forms/dodatok-5';
import { SixthDodatok } from './forms/dodatok-6';

import { CheckingAdaptation } from './forms/checking-adaptation';
import { RejectionPath } from './forms/rejection-path';
import { RegistrationSpeed } from './forms/registration-speed';
import { DeviationTime } from './forms/deviation-time';

export const PopupFormsAdapter = ({
  target = '',
  handleChange = () => {},
  handlePopupClose = () => {},
  data = {},
  blocked = false,
  number_doc = '',
  category_KTZ = '',
  fuel_type = '',
  cylinders = '',
  first_registration_date = '',
  ecological = '',
  ...props
}) => {
  const mainData = {
    data, blocked, number_doc, handleChange, handlePopupClose,
  };
  return (
    <div {...props}>
      {target === 'general_characteristics' && (
        <GeneralCharacteristics {...mainData} category_KTZ = {category_KTZ}/>
      )}
      {target === 'protective_devices' && (<ProtectiveDevices {...mainData}/>)}
      {target === 'engine_systems' && (<EngineSystems {...mainData}/>)}
      {target === 'control_system' && (
        <ControlSystem
          {...mainData}
          category_KTZ = {category_KTZ}
          first_registration_date = {first_registration_date}
        />
      )}
      {target === 'tyres_wheels' && (
        <TyresWheels {...mainData} category_KTZ = {category_KTZ}/>
      )}
      {target === 'braking_systems' && (<BrakingSystems {...mainData}
        first_registration_date = {first_registration_date}
        category_KTZ = {category_KTZ}
      />)}
      {target === 'windows_headlights' && (<WindowsHeadlights {...mainData}
        category_KTZ = {category_KTZ} />)}
      {target === 'other_equipments' && (
        <OtherEquipments
          {...mainData}
          fuel_type = {fuel_type}
          category_KTZ = {category_KTZ}
        />
      )}
      {target === 'environmental_impact' && (
        <EnvironmentalImpact
          {...mainData}
          first_registration_date = {first_registration_date}
          cylinders = {cylinders}
          fuel_type = {fuel_type}
          ecological = {ecological}
        />
      )}
      {target === 'co2_environmental_impact' && (
        <CO2EnvironmentalImpact
          {...mainData}
          first_registration_date = {first_registration_date}
          cylinders = {cylinders}
          fuel_type = {fuel_type}
        />
      )}
      {target === 'noise_level' && (<NoiseLevel {...mainData}/>)}

      {target === 'dodatok_1' && (<FirstDodatok {...mainData}/>)}
      {target === 'dodatok_2' && (<SecondDodatok {...mainData}/>)}
      {target === 'dodatok_3' && (<ThirdDodatok {...mainData}/>)}
      {target === 'dodatok_4' && (<FourthDodatok {...mainData} />)}
      {target === 'dodatok_5' && (<FifthDodatok {...mainData}/>)}
      {target === 'dodatok_6' && (<SixthDodatok {...mainData} />)}

      {target === 'checking_adaptation' && (
        <CheckingAdaptation {...mainData}/>
      )}
      {target === 'rejection_path' && (<RejectionPath {...mainData}/>)}
      {target === 'registration_speed' && (<RegistrationSpeed {...mainData}/>)}
      {target === 'deviation_time' && (<DeviationTime {...mainData}/>)}
    </div>
  );
};

PopupFormsAdapter.propTypes = {
  target: PropTypes.string,
  data: PropTypes.object,
  blocked: PropTypes.bool,
  number_doc: PropTypes.string,
  category_KTZ: PropTypes.string,
  fuel_type: PropTypes.string,
  cylinders: PropTypes.string,
  first_registration_date: PropTypes.string,
  ecological: PropTypes.string,
  handleChange: PropTypes.func,
  handlePopupClose: PropTypes.func,
  children: PropTypes.oneOfType([ PropTypes.node, PropTypes.element ]),
};
