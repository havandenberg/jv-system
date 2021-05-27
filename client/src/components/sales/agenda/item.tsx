import React, { Fragment, useRef, useState } from 'react';
import JoditEditor, { JoditProps } from 'jodit-react';

import Modal from 'components/modal';
import SortControl from 'components/sort-control';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { AgendaItemProps } from './types';

const AgendaItem = ({
  handleChange,
  handleRemoveItem,
  handleSave,
  handleSortChange,
  hasChanges,
  item,
  isFirst,
  isLast,
  onCancel,
}: AgendaItemProps) => {
  const ref = useRef(null);
  const [editing, setEditing] = useState(item.id < 0);

  const config: Partial<JoditProps['config']> & any = {
    askBeforePasteHTML: false,
    autofocus: editing,
    showPlaceholder: false,
    spellcheck: false,
    showBrowserColorPicker: false,
    readonly: !editing,
    colorPickerDefaultTab: 'background',
    statusbar: false,
    buttonsMD: [
      'bold',
      'italic',
      'underline',
      '|',
      'ul',
      'ol',
      '|',
      'font',
      'fontsize',
      'brush',
      'paragraph',
      'indent',
      '|',
      'table',
      '|',
      'align',
      '|',
      'undo',
      'redo',
      '|',
      'hr',
      '|',
      'fullsize',
    ],
    style: {
      background: th.colors.background,
    },
    toolbar: editing,
    tabIndex: item.id,
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    onCancel(item.id);
  };

  return (
    <l.Div
      borderBottom={th.borders.disabled}
      pb={th.spacing.lg}
      mb={th.spacing.lg}
      minHeight={250}
      relative
    >
      <l.Div mr={175} overflow="hidden">
        <l.Div m={-1}>
          <JoditEditor
            ref={ref}
            value={item.content}
            key={`${item.id}-${item.sortOrder}`}
            config={config as JoditProps['config']}
            onBlur={(content) => handleChange([{ ...item, content }])}
          />
        </l.Div>
      </l.Div>
      {!editing && (
        <l.Div position="absolute" right={113} top={7}>
          <SortControl
            disableUp={isFirst}
            disableDown={isLast}
            onDown={() => {
              handleSortChange(item, 'down');
            }}
            onUp={() => {
              handleSortChange(item, 'up');
            }}
            sideLength={th.sizes.icon}
            arrowSideLength={21}
          />
        </l.Div>
      )}
      <l.Flex column position="absolute" right={0} top={0}>
        {editing ? (
          <Fragment key={0}>
            <Modal
              trigger={(show) => (
                <b.Primary
                  mb={th.spacing.md}
                  onClick={item.id < 0 || !hasChanges ? handleCancel : show}
                  width={100}
                >
                  Cancel
                </b.Primary>
              )}
            >
              {({ hide }) => (
                <>
                  <ty.TitleText>Confirm discard changes</ty.TitleText>
                  <ty.BodyText>
                    You will lose all unsaved agenda changes.
                  </ty.BodyText>
                  <l.Flex justifyCenter mt={th.spacing.xl}>
                    <b.Primary mr={th.spacing.lg} onClick={hide}>
                      Cancel
                    </b.Primary>
                    <b.Primary onClick={handleCancel}>Discard</b.Primary>
                  </l.Flex>
                </>
              )}
            </Modal>
            <b.Primary
              onClick={() => {
                handleSave(item.id, handleCancel);
              }}
              width={100}
            >
              Save
            </b.Primary>
          </Fragment>
        ) : (
          <Fragment key={1}>
            <b.Primary onClick={handleEdit} width={100}>
              Edit
            </b.Primary>
            <Modal
              trigger={(show) => (
                <b.Primary mt={th.spacing.md} onClick={show} width={100}>
                  Remove
                </b.Primary>
              )}
            >
              {({ hide }) => (
                <>
                  <ty.TitleText>Confirm remove item</ty.TitleText>
                  <ty.BodyText>
                    You will lose all unsaved agenda changes.
                  </ty.BodyText>
                  <l.Flex justifyCenter mt={th.spacing.xl}>
                    <b.Primary mr={th.spacing.lg} onClick={hide}>
                      Cancel
                    </b.Primary>
                    <b.Primary
                      onClick={() => {
                        handleRemoveItem(item.id, item.sortOrder);
                      }}
                    >
                      Remove
                    </b.Primary>
                  </l.Flex>
                </>
              )}
            </Modal>
          </Fragment>
        )}
      </l.Flex>
    </l.Div>
  );
};

export default AgendaItem;
