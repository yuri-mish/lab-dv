import { forwardRef, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import {
  Form,
  DateBox,
  TextArea,
} from 'devextreme-react';
import { loader } from 'graphql.macro';
import { SimpleItem } from 'devextreme-react/form';
import PropTypes from 'prop-types';
import {
  DEFAULT_DATE_VALUE,
  DX_DATE_DISPLAY_FORMAT,
  FORM_STYLING_MODE,
} from 'app-constants';
import { Popup, ToolbarItem } from 'devextreme-react/popup';

const getPartnerInfo = loader('./getPartnerInfo.graphql');

export const PartnerInfoPanel = forwardRef((props, ref) => {
  const gqlClient = useApolloClient();
  const [ data, setData ] = useState();
  const [ currentPage, setCurrentPage ] = useState(1);

  const load = async (ref) => gqlClient.query({
    query: getPartnerInfo,
    variables: { ref },
  })
    .then((response) => {
      const data = response?.data?.infoapi;
      if (data) {
        setData(data);
      }
    })
    .catch(() => {});


  const pageNum = data?.length || 0;
  const hasContracts = pageNum > 0;

  useEffect(() => {
    if (props?.partner?.ref) {
      load(props.partner.ref);
    }
  }, [ props.partner ]);

  const moreThanOne = pageNum > 1;
  const pageInfo = hasContracts ? `${currentPage}/${pageNum}` : '';
  const title = `Договір ${pageInfo}`;

  const pageData = data?.[currentPage - 1];

  return (
    <Popup
      {...props}
      ref={ref}
      maxWidth={400}
      height='auto'
      title={title}
      closeOnOutsideClick
      dragEnabled={false}
      resizeEnabled={false}
    >
      <ToolbarItem
        widget='dxButton'
        toolbar='top'
        location='before'
        visible={moreThanOne}
        options={{
          icon: 'chevronleft',
          focusStateEnabled: false,
          onClick: () => {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
          },
        }}
      />
      <ToolbarItem
        widget='dxButton'
        toolbar='top'
        location='before'
        visible={moreThanOne}
        options={{
          icon: 'chevronnext',
          focusStateEnabled: false,
          onClick: () => {
            setCurrentPage((prev) => Math.min(prev + 1, pageNum));
          },
        }}
      />
      <div className='otk-content-block'>
        <Form
          formData={pageData}
          colCount={2}
          visible={hasContracts}
          height='fit-content'
        >
          <SimpleItem
            itemType='dxTextBox'
            dataField='name'
            label={{ text: 'Назва' }}
            editorOptions={{
              readOnly: true,
              stylingMode: FORM_STYLING_MODE,
            }}
          />

          <SimpleItem
            itemType='dxTextBox'
            dataField='number'
            label={{ text: 'Номер' }}
            editorOptions={{
              readOnly: true,
              stylingMode: FORM_STYLING_MODE,
            }}
          />

          <SimpleItem
            label={{ text: 'Дата' }}
          >
            <DateBox
              readOnly
              value={pageData?.date === DEFAULT_DATE_VALUE ?
                null :
                pageData?.date
              }
              displayFormat={DX_DATE_DISPLAY_FORMAT}
              stylingMode={FORM_STYLING_MODE}
            />
          </SimpleItem>

          <SimpleItem
            label={{ text: 'Термін дії' }}
          >
            <DateBox
              readOnly
              value={pageData?.valid_before === DEFAULT_DATE_VALUE ?
                null :
                pageData?.valid_before
              }
              displayFormat={DX_DATE_DISPLAY_FORMAT}
              stylingMode={FORM_STYLING_MODE}
            />
          </SimpleItem>

          <SimpleItem
            colSpan={2}
            itemType='dxCheckBox'
            dataField='cont'
            label={{ text: 'Пролонгація', location: 'left' }}
            editorOptions={{
              readOnly: true,
              stylingMode: FORM_STYLING_MODE,
            }}
          />

          <SimpleItem
            colSpan={2}
            itemType='dxTextBox'
            dataField='delay'
            label={{ text: 'Відстрочка' }}
            editorOptions={{
              readOnly: true,
              stylingMode: FORM_STYLING_MODE,
            }}
          />

          <SimpleItem
            colSpan={2}
            label={{ text: 'Опис' }}
          >
            <TextArea
              readOnly
              value={pageData?.description}
              stylingMode={FORM_STYLING_MODE}
              height={90}
            />
          </SimpleItem>
        </Form>

        {!hasContracts &&
          <span>Немає договорів</span>
        }
      </div>
    </Popup>
  );
});

PartnerInfoPanel.displayName = 'PartnerInfoPanel';

PartnerInfoPanel.propTypes = {
  ...Popup.propTypes,
  partner: PropTypes.shape({
    ref: PropTypes.string.isRequired,
  }),
};
