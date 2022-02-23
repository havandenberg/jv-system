import React, { useState } from 'react';

import { BasicModal, BasicModalProps } from 'components/modal';
import { TextArea } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

interface Props extends Omit<BasicModalProps, 'handleConfirm'> {
  handleApprove: (message: string) => void;
  handleReject?: (message: string) => void;
}

const ShipperProjectionsReviewModal = ({
  handleApprove,
  handleReject,
  ...rest
}: Props) => {
  const [value, setValue] = useState('');

  return (
    <BasicModal
      title={`${handleReject ? 'Review Shipper' : 'Submit'} Projection`}
      content={
        <>
          <ty.BodyText mb={th.spacing.lg}>
            Add comments for {handleReject ? 'shipper' : 'Jac Vandenberg'} below
            (optional).
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
      confirmText={handleReject ? 'Approve' : 'Confirm Submit'}
      cancelText={handleReject ? 'Request Changes' : 'Cancel'}
      triggerText={handleReject ? 'Review' : 'Submit'}
      confirmProps={{ status: th.colors.status.success, width: 180 }}
      cancelProps={{ status: th.colors.status.error, width: 180 }}
      onCancel={handleReject ? () => handleReject(value) : undefined}
      handleConfirm={() => handleApprove(value)}
      {...rest}
    />
  );
};

export default ShipperProjectionsReviewModal;
