import { useState } from 'react';
import { Button } from 'devextreme-react';
import PropTypes from 'prop-types';
import { Tooltip } from 'devextreme-react/tooltip';

export const CopyButton = (props) => {
  const [ showSuccess, setShowSuccess ] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.value)
      .then(() => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <Tooltip
        style={{ position: 'absolute' }}
        target='#copyButton'
        visible={showSuccess}
        position={{ my: 'left', at: 'right' }}
      >
        <div>скопійовано</div>
      </Tooltip>
      <Button
        id='copyButton'
        icon={showSuccess ? 'check' : 'copy'}
        visible={!!props.value}
        focusStateEnabled={false}
        hint={props.hint}
        onClick={copyToClipboard}
      />
    </div>
  );
};

CopyButton.propTypes = {
  value: PropTypes.string,
  hint: PropTypes.string,
};

