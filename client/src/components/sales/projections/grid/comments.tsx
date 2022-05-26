import React, { useState } from 'react';
import { format } from 'date-fns';
import OutsideClickHandler from 'react-outside-click-handler';

import CommentsImg from 'assets/images/comments';
import StatusIndicator from 'components/status-indicator';
import { Shipper, ShipperProjection } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

interface Props {
  currentProjectionId?: string;
  currentProjections: ShipperProjection[];
  selectedShipper: Shipper;
}

const CommentsModal = ({
  currentProjectionId,
  currentProjections,
  selectedShipper,
}: Props) => {
  const [show, setShow] = useState(false);

  const hasComments = currentProjections.reduce(
    (acc, projection) =>
      acc || !!projection.shipperComments || !!projection.jvComments,
    false,
  );

  const primaryContact =
    selectedShipper.personContactsByShipperPersonContactShipperIdAndPersonContactId?.nodes.filter(
      (personContact) => !!personContact?.isPrimary,
    )[0];

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setShow(false);
      }}
    >
      <l.Div relative>
        <l.HoverButton
          active={show || hasComments}
          onClick={() => {
            setShow(!show);
          }}
        >
          <CommentsImg />
        </l.HoverButton>
        {show && (
          <l.Div
            borderRadius={th.borderRadii.default}
            border={th.borders.secondary}
            bg={th.colors.white}
            boxShadow={th.shadows.box}
            height={500}
            p={th.spacing.md}
            position="absolute"
            left={`-${th.spacing.sm}`}
            top={`calc(${th.sizes.fill} + ${th.spacing.md})`}
            width={600}
            zIndex={5}
          >
            {primaryContact ? (
              <l.Div mb={th.spacing.lg}>
                <ty.CaptionText bold mb={th.spacing.sm}>
                  Primary Contact
                </ty.CaptionText>
                <l.Flex justifyBetween>
                  <l.Flex alignCenter>
                    <ty.CaptionText mr={th.spacing.sm} secondary>
                      Name:
                    </ty.CaptionText>
                    <ty.BodyText>
                      {primaryContact.firstName} {primaryContact.lastName}
                    </ty.BodyText>
                  </l.Flex>
                  <l.Flex alignCenter>
                    <ty.CaptionText mr={th.spacing.sm} secondary>
                      Email:
                    </ty.CaptionText>
                    <l.Anchor
                      href={`mailto:${primaryContact.email}`}
                      ml={th.spacing.xs}
                    >
                      {primaryContact.email}
                    </l.Anchor>
                  </l.Flex>
                </l.Flex>
              </l.Div>
            ) : (
              <ty.BodyText mb={th.spacing.lg}>
                No Primary Contact - view shipper to add a primary contact.
              </ty.BodyText>
            )}
            <l.Flex justifyBetween mb={th.spacing.md}>
              <ty.CaptionText bold>Shipper Comments</ty.CaptionText>
              <ty.CaptionText bold>JV Comments</ty.CaptionText>
            </l.Flex>
            <l.Div height={384} overflowY="auto" pr={th.spacing.sm}>
              {currentProjections.map((projection, idx) => (
                <l.Flex
                  column
                  borderTop="1px solid rgba(3,41,74,0.2)"
                  key={idx}
                >
                  {(projection.approvedAt || projection.rejectedAt) && (
                    <l.Flex
                      alignEnd
                      alignSelf="flex-end"
                      column
                      flexBasis="80%"
                    >
                      <l.Flex alignCenter my={th.spacing.md}>
                        <StatusIndicator
                          diameter={12}
                          status={
                            projection?.reviewStatus === 2
                              ? 'success'
                              : projection?.reviewStatus === 0
                              ? 'error'
                              : 'warning'
                          }
                        />
                        <ty.SmallText
                          bold={currentProjectionId === projection.id}
                          ml={th.spacing.sm}
                          secondary={currentProjectionId !== projection.id}
                        >
                          {format(
                            new Date(
                              projection?.reviewStatus === 2
                                ? projection.approvedAt
                                : projection.rejectedAt,
                            ),
                            'EE, MMM d, h:mm a',
                          )}
                        </ty.SmallText>
                      </l.Flex>
                      {projection.jvComments ? (
                        <ty.CaptionText
                          dangerouslySetInnerHTML={{
                            __html: projection.jvComments,
                          }}
                        ></ty.CaptionText>
                      ) : (
                        <ty.CaptionText disabled>(No comments)</ty.CaptionText>
                      )}
                    </l.Flex>
                  )}
                  <ty.SmallText
                    bold={currentProjectionId === projection.id}
                    mb={th.spacing.sm}
                    mt={th.spacing.md}
                    secondary={currentProjectionId !== projection.id}
                  >
                    {format(
                      new Date(projection.submittedAt),
                      'EE, MMM d, h:mm a',
                    )}
                  </ty.SmallText>
                  {projection.shipperComments ? (
                    <l.Div flexBasis="80%" mb={th.spacing.sm} p={th.spacing.sm}>
                      <ty.CaptionText
                        dangerouslySetInnerHTML={{
                          __html: projection.shipperComments,
                        }}
                      ></ty.CaptionText>
                    </l.Div>
                  ) : (
                    <ty.CaptionText
                      mb={th.spacing.sm}
                      p={th.spacing.sm}
                      disabled
                    >
                      (No comments)
                    </ty.CaptionText>
                  )}
                </l.Flex>
              ))}
            </l.Div>
          </l.Div>
        )}
      </l.Div>
    </OutsideClickHandler>
  );
};

export default CommentsModal;
