import React, { Fragment, useEffect, useState } from 'react';
import { equals, isEmpty, pluck, values } from 'ramda';
import { sentenceCase } from 'sentence-case';

import Modal from 'components/modal';
import usePrevious from 'hooks/use-previous';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { LineItemCheckbox } from 'ui/checkbox';

import { SelectionState } from '.';

const SendEmailModal = ({
  selectedEmails,
}: {
  selectedEmails: SelectionState;
}) => {
  const flattenedEmails = values(selectedEmails).flat();
  const previousFlattenedEmails = usePrevious(flattenedEmails);
  const [finalEmails, setFinalEmails] = useState(
    pluck('email', flattenedEmails),
  );
  const isAllSelected =
    flattenedEmails.length > 0 && finalEmails.length === flattenedEmails.length;

  const toggleAll = () => {
    if (isAllSelected) {
      setFinalEmails([]);
    } else {
      setFinalEmails(pluck('email', flattenedEmails));
    }
  };

  const toggleEmail = (email: string) => {
    if (finalEmails.includes(email)) {
      setFinalEmails(finalEmails.filter((e) => e !== email));
    } else {
      setFinalEmails([...finalEmails, email]);
    }
  };

  useEffect(() => {
    if (!equals(previousFlattenedEmails, flattenedEmails)) {
      setFinalEmails(pluck('email', flattenedEmails));
    }
  }, [flattenedEmails, previousFlattenedEmails]);

  return (
    <Modal
      trigger={(show) => {
        const trigger = (
          <b.Primary
            disabled={isEmpty(flattenedEmails)}
            onClick={flattenedEmails.length > 1 ? show : undefined}
          >
            Send Email
          </b.Primary>
        );
        if (flattenedEmails.length === 1) {
          return (
            <l.Anchor href={`mailto:${flattenedEmails[0].email}`}>
              {trigger}
            </l.Anchor>
          );
        }
        return trigger;
      }}
    >
      {({ hide }) => (
        <>
          <ty.TitleText>Create New Email</ty.TitleText>
          <ty.BodyText mb={th.spacing.lg}>
            You have selected the following contacts to send an email to. You
            may edit your selection below and continue when ready.
          </ty.BodyText>
          <LineItemCheckbox
            checked={isAllSelected}
            label={
              <ty.CaptionText ml={th.spacing.md}>Select All</ty.CaptionText>
            }
            onChange={toggleAll}
          />
          <l.Flex column maxHeight={500} overflowY="auto">
            {Object.keys(selectedEmails).map((key) => {
              const items = selectedEmails[key as keyof SelectionState];
              if (isEmpty(items)) return null;
              return (
                <Fragment key={key}>
                  <ty.BodyText my={th.spacing.md}>
                    {sentenceCase(key)}
                  </ty.BodyText>
                  {items.map(({ description, email, id }) => (
                    <l.Div key={id} mb={th.spacing.sm}>
                      <LineItemCheckbox
                        checked={finalEmails.includes(email)}
                        label={
                          <l.Grid
                            gridTemplateColumns="1fr 1fr"
                            ml={th.spacing.md}
                            width={th.sizes.fill}
                          >
                            <ty.CaptionText>{email}</ty.CaptionText>
                            <ty.CaptionText>{description}</ty.CaptionText>
                          </l.Grid>
                        }
                        onChange={() => toggleEmail(email)}
                      />
                    </l.Div>
                  ))}
                </Fragment>
              );
            })}
          </l.Flex>
          <l.Flex justifyCenter mt={th.spacing.xl}>
            <b.Primary mr={th.spacing.md} onClick={hide}>
              Cancel
            </b.Primary>
            <l.Anchor
              href={
                finalEmails.length > 0 ? `mailto:${finalEmails.join(',')}` : '#'
              }
            >
              <b.Primary disabled={isEmpty(finalEmails)}>Continue</b.Primary>
            </l.Anchor>
          </l.Flex>
        </>
      )}
    </Modal>
  );
};

export default SendEmailModal;
