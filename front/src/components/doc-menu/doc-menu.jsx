import { Menu } from 'devextreme-react';
import { messages } from 'messages';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';
import { showError, showSuccess } from 'utils/notify';
import { openDoc } from 'utils/open-doc';

export const DocMenu = ({
  printItems = [],
  allowSaving = true,
  ...props
}) => {
  const history = useHistory();
  const path = useLocation().pathname;
  const basePath = path.substring(0, path.lastIndexOf('/'));

  const items = useMemo(() => [
    {
      id: 'ok',
      text: 'Зберегти і закрити',
      icon: 'save',
      disabled: !allowSaving,
    },
    {
      id: 'close',
      text: 'Закрити',
      icon: 'close',
    },
    {
      id: 'save',
      text: 'Зберегти',
      icon: 'save',
      disabled: !allowSaving,
    },

    ...(printItems.length > 0 ?
      [
        {
          text: 'Друк',
          icon: 'print',
          items: printItems.map((item) => ({ ...item, id: 'print' })),
          disabled: printItems.every((item) => item.disabled),
        },
      ] :
      []
    ),
  ], [ allowSaving, printItems ]);

  return (
    <Menu
      id='MainMenu'
      onItemClick={(e) => {
        switch (e.itemData.id) {
        case 'ok': {
          props.onSave()
            .then(() => {
              showSuccess(messages.DOC_SAVED);
              history.goBack();
            })
            .catch((e) => showError(e));
          break;
        }
        case 'save': {
          props.onSave()
            .then((ref) => {
              showSuccess(messages.DOC_SAVED);
              if (props.isDocNew) {
                history.replace(`${basePath}/${ref}`);
              }
            })
            .catch((e) => showError(e));
          break;
        }
        case 'close': {
          history.goBack();
          break;
        }
        case 'print': {
          if (e.itemData?.onClick) {
            e.itemData.onClick();
          } else {
            openDoc(e.itemData?.url ?? '');
          }
          break;
        }
        default:
        }
      }}
      dataSource={items}>
    </Menu>
  );
};

DocMenu.propTypes = {
  onSave: PropTypes.func.isRequired,
  isDocNew: PropTypes.bool.isRequired,
  allowSaving: PropTypes.bool,
  printItems: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    url: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
  })),
};
