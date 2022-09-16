import React, { useState } from 'react';

import { BasicModal, BasicModalProps } from 'components/modal';
import { TextArea } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

interface Props extends Omit<BasicModalProps, 'handleConfirm'> {
  handleConfirm: (message: string) => void;
  salesUserEmail: string;
}

const OrderEntryReviewModal = ({
  confirmLoading,
  handleConfirm,
  salesUserEmail,
  triggerDisabled,
}: Props) => {
  const [value, setValue] = useState('');

  return (
    <BasicModal
      title="Request Order Entry Changes"
      content={
        <>
          <ty.BodyText>
            Comments will be sent to{' '}
            <ty.Span color={th.colors.brand.primaryAccent}>
              {salesUserEmail}
            </ty.Span>
            .
          </ty.BodyText>
          <l.Flex justifyCenter mt={th.spacing.lg}>
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
      confirmLoading={confirmLoading}
      confirmText="Send"
      confirmDisabled={confirmLoading || triggerDisabled}
      handleConfirm={() => {
        handleConfirm(value);
      }}
      triggerText="Request Changes"
      triggerProps={{ status: th.colors.status.warning }}
    />
  );
};

export default OrderEntryReviewModal;
