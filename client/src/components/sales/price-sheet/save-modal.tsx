import React, { useState } from 'react';

import { BasicModal } from 'components/modal';
import { TextArea } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

interface Props {
  handleSave: (message: string) => void;
  sendNotification: boolean;
  updateLoading: boolean;
}

const PriceSheetSaveModal = ({
  handleSave,
  sendNotification,
  updateLoading,
}: Props) => {
  const [value, setValue] = useState('');
  return (
    <BasicModal
      title="Update Message"
      content={
        <>
          <ty.BodyText mb={th.spacing.lg}>
            Describe your price sheet updates, or leave blank.
          </ty.BodyText>
          <l.Flex justifyCenter>
            <TextArea
              autoFocus
              onChange={(e) => {
                setValue(e.target.value);
              }}
              cols={100}
              rows={10}
              value={value}
            />
          </l.Flex>
        </>
      }
      confirmLoading={updateLoading}
      confirmText="Save & Send Update"
      handleConfirm={() =>
        handleSave(sendNotification ? `<br/><br/><pre>${value}</pre>` : '')
      }
      shouldConfirm={sendNotification}
      triggerProps={{
        status: th.colors.status.success,
        width: 88,
      }}
      triggerText={sendNotification ? 'Next' : 'Save'}
    />
  );
};

export default PriceSheetSaveModal;
