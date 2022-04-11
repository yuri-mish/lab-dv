import { useEffect, useRef } from 'react';
import { Button } from 'devextreme-react';
import { PropTypes } from 'prop-types';
import { useAuth } from 'contexts/auth';
import { CHAT_SCRIPT } from 'app-constants';

export const LiveChat = ({
  floating = false,
}) => {
  const scriptRef = useRef(null);
  const floatingRef = useRef(floating);
  const { user } = useAuth();

  const mountWidget = () => {
    const script = document.createElement('script');
    scriptRef.current = script;
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = CHAT_SCRIPT;

    document.body.appendChild(script);
    const widget = window.LiveChatWidget;
    widget.on('ready', () => {
      if (!floatingRef.current) {
        widget.call('hide');
      }
      widget.call('set_customer_name', user.email);
    });
    widget.on('visibility_changed', (data) => {
      if (!floatingRef.current && data.visibility === 'minimized') {
        widget.call('hide');
      }
    });
  };

  const unmountWidget = () => {
    window.LiveChatWidget.call('destroy');
  };


  const toggle = () => {
    const widget = window.LiveChatWidget;
    if (widget.get('state').visibility === 'hidden') {
      widget.call('maximize');
    } else {
      widget.call('hide');
    }
  };

  useEffect(() => {
    mountWidget();
    return () => {
      unmountWidget();
    };
  }, []);

  useEffect(() => {
    floatingRef.current = floating;
    const widget = window.LiveChatWidget;
    floating ? widget.call('minimize') : widget.call('hide');
  }, [ floating ]);

  return (
    <div>
      <Button
        onClick={toggle}
        stylingMode='text'
        icon='comment'
        hint=''
        visible={!floating}
      >
      </Button>
    </div>
  );
};

LiveChat.propTypes = {
  floating: PropTypes.bool,
};

