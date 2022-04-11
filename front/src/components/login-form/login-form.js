import { useState, useRef, useCallback } from 'react';
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
} from 'devextreme-react/form';

import LoadIndicator from 'devextreme-react/load-indicator';
import notify from 'devextreme/ui/notify';
import { useAuth } from 'contexts/auth';


import './login-form.scss';
import { useReactiveVar } from '@apollo/client';
import { serverIsAliveVar } from 'gql-client';
import { messages } from 'messages';

const emailEditorOptions = {
  stylingMode: 'filled',
  placeholder: 'Користувач',
};
const passwordEditorOptions = {
  stylingMode: 'filled',
  placeholder: 'Пароль',
  mode: 'password',
};
const rememberMeEditorOptions = {
  text: 'запам\'ятати мене',
  elementAttr: { class: 'form-text' },
};

export const LoginForm = () => {
  const { signIn } = useAuth();
  const [ loading, setLoading ] = useState(false);
  const formData = useRef({});
  const serverIsAlive = useReactiveVar(serverIsAliveVar);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { email, password } = formData.current;
    setLoading(true);

    const result = await signIn(email, password);
    if (!result.isOk) {
      setLoading(false);
      notify(
        serverIsAlive ? result.message : messages.SERVER_OR_NETWORK_DOWN,
        'error',
        2000,
      );
    }
  }, [ signIn, serverIsAlive ]);


  return (
    <form className={'login-form'} onSubmit={onSubmit}>
      <Form formData={formData.current} disabled={loading}>
        <Item
          dataField={'email'}
          editorType={'dxTextBox'}
          editorOptions={emailEditorOptions}
        >
          <RequiredRule message="заповнення обов'язкове" />
          <Label visible={false} />
        </Item>
        <Item
          dataField={'password'}
          editorType={'dxTextBox'}
          editorOptions={passwordEditorOptions}
        >
          <RequiredRule message="заповнення обов'язкове" />
          <Label visible={false} />
        </Item>
        <Item
          dataField={'rememberMe'}
          editorType={'dxCheckBox'}
          editorOptions={rememberMeEditorOptions}
        >
          <Label visible={false} />
        </Item>
        <ButtonItem>
          <ButtonOptions
            width={'100%'}
            type={'default'}
            useSubmitBehavior={true}
          >
            <span className="dx-button-text">
              {
                loading ?
                  <LoadIndicator
                    width={'24px'}
                    height={'24px'}
                    visible={true}
                  /> :
                  'Вхід'
              }
            </span>
          </ButtonOptions>
        </ButtonItem>
        <Item
          visible={!serverIsAlive}
        >
          <div className='serverDownMsg'>
            Виникли проблеми з підключенням до сервера
          </div>
        </Item>
      </Form>
    </form>
  );
};

