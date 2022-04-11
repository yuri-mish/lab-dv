import PropTypes from 'prop-types';
import styles from './Form-field.module.scss';

export const FormField = ({
  text = '',
  textWidth = '',
  fluid = false,
  mrBottom = false,
  dfGrow = false,
  wrapText = false,
  ...props
}) => {
  const styleFromProps = props.style;
  const style = {
    display: 'flex',
    alignItems: 'center',
    width: fluid ? '100%' : '',
  };
  return (
    <div
      className={`${mrBottom && styles?.mr_bottom} form-field-wrap`}
      style={props.style ? { ...styleFromProps, ...style } : style}
      {...props}
    >
      {text && (
        <div
          style={{
            width: textWidth ? textWidth : 'auto',
            minWidth: textWidth ? textWidth : 'auto',
            fontSize: '16px',
            overflow: textWidth ? 'hidden' : 'visible',
            alignSelf: 'initial',
            paddingTop: '5px',
          }}
          className={`${dfGrow && styles?.df_grow} ${wrapText &&
            styles?.wrap_text } dx-field-label`}
        >
          {text}
        </div>
      )}

      <div style={{ width: fluid ? '100%' : '' }}>{props.children}</div>
    </div>
  );
};

FormField.propTypes = {
  text: PropTypes.string,
  textWidth: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  fluid: PropTypes.bool,
  dfGrow: PropTypes.bool,
  wrapText: PropTypes.bool,
  mrBottom: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
  ]).isRequired,
};
