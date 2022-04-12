import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';

import Modal, { BasicModalProps } from 'components/modal';
import { TextArea } from 'ui/input';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

interface Props extends Omit<BasicModalProps, 'handleConfirm'> {
  handleConfirm: (message: string, reviewStatus?: number) => void;
  isPortal: boolean;
  mismatchedProductCount?: number;
  unmatchedProductCount?: number;
}

const ShipperProjectionsReviewModal = ({
  confirmLoading,
  handleConfirm,
  isPortal,
  triggerDisabled,
  mismatchedProductCount,
  unmatchedProductCount,
}: Props) => {
  const [value, setValue] = useState('');

  return (
    <Modal
      trigger={(show) => (
        <b.Status
          disabled={confirmLoading || triggerDisabled}
          onClick={show}
          status={th.colors.status.warning}
        >
          {confirmLoading ? (
            <l.Flex alignCenter justifyCenter>
              <ClipLoader
                color={th.colors.brand.secondary}
                size={th.sizes.xs}
              />
            </l.Flex>
          ) : isPortal ? (
            'Submit'
          ) : (
            'Review'
          )}
        </b.Status>
      )}
    >
      {({ hide }) => (
        <>
          <ty.TitleText>{`${
            isPortal ? 'Submit' : 'Review Shipper'
          } Projection`}</ty.TitleText>
          <ty.BodyText>
            Add comments for {isPortal ? 'Jac Vandenberg' : 'shipper'} below
            (optional).
          </ty.BodyText>
          {unmatchedProductCount && (
            <ty.BodyText color={th.colors.status.warning} mt={th.spacing.sm}>
              Unmatched products: {unmatchedProductCount}
            </ty.BodyText>
          )}
          {mismatchedProductCount && (
            <ty.BodyText color={th.colors.status.warning} mt={th.spacing.sm}>
              Mismatched products: {mismatchedProductCount}
            </ty.BodyText>
          )}
          {unmatchedProductCount === 0 && mismatchedProductCount === 0 && (
            <ty.BodyText color={th.colors.status.success} mt={th.spacing.sm}>
              All products matched!
            </ty.BodyText>
          )}
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
          <l.Flex justifyBetween mt={th.spacing.xl}>
            <b.Status
              onClick={() => {
                !isPortal && handleConfirm(value, 0);
                hide();
              }}
              status={th.colors.status.error}
              width={180}
            >
              {isPortal ? 'Cancel' : 'Request Changes'}
            </b.Status>
            <>
              {!isPortal && (
                <b.Status
                  disabled={confirmLoading}
                  ml={th.spacing.lg}
                  onClick={() => {
                    handleConfirm(value, 1);
                    hide();
                  }}
                  status={th.colors.status.warning}
                  width={180}
                >
                  {confirmLoading ? (
                    <l.Flex alignCenter justifyCenter>
                      <ClipLoader
                        color={th.colors.brand.secondary}
                        size={th.sizes.xs}
                      />
                    </l.Flex>
                  ) : (
                    'Save'
                  )}
                </b.Status>
              )}
              <b.Status
                disabled={confirmLoading}
                ml={th.spacing.lg}
                onClick={() => {
                  handleConfirm(value, 2);
                  hide();
                }}
                status={th.colors.status.success}
                width={180}
              >
                {confirmLoading ? (
                  <l.Flex alignCenter justifyCenter>
                    <ClipLoader
                      color={th.colors.brand.secondary}
                      size={th.sizes.xs}
                    />
                  </l.Flex>
                ) : isPortal ? (
                  'Confirm Submit'
                ) : (
                  'Approve'
                )}
              </b.Status>
            </>
          </l.Flex>
        </>
      )}
    </Modal>
  );
};

export default ShipperProjectionsReviewModal;
