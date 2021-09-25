import React from 'react';
import { ApolloError } from '@apollo/client';
import { format } from 'date-fns';
import { groupBy, isEmpty, mapObjIndexed, values } from 'ramda';

import api from 'api';
import MessageRead from 'assets/images/message-read';
import MessageUnread from 'assets/images/message-unread';
import { DataMessage } from 'components/page/message';
import StatusIndicator from 'components/status-indicator';
import { UserMessage } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { hexColorWithTransparency } from 'ui/utils';
import { LineItemCheckbox } from 'ui/checkbox';

export const userMessagePriorityMap: {
  [index: number]: { status: keyof typeof th.colors.status; text: string };
} = {
  1: { status: 'error', text: 'Urgent' },
  2: { status: 'warning', text: 'Medium' },
  3: { status: 'success', text: 'Low' },
};

const Message = ({
  message: {
    actionLink,
    actionText,
    details,
    header,
    id,
    isRead,
    messageDate,
    priority,
  },
  showReadMessages,
  userId,
}: {
  message: UserMessage;
  showReadMessages: boolean;
  userId: number;
}) => {
  const [handleUpdate] = api.useUpdateUserMessage(userId, showReadMessages);

  const handleUpdateMessage = (isRead: boolean) => {
    handleUpdate({
      variables: {
        id,
        updates: { isRead },
      },
    });
  };

  return (
    <l.Flex
      alignCenter
      bg={
        priority === 1
          ? hexColorWithTransparency(th.colors.status.error, 0.2)
          : th.colors.brand.containerBackground
      }
      border={priority === 1 ? th.borders.error : th.borders.primary}
      borderRadius={th.borderRadii.default}
      justifyBetween
      mt={th.spacing.md}
      opacity={isRead ? th.opacities.secondary : 1}
      p={th.spacing.md}
    >
      <div>
        <l.Flex mb={th.spacing.sm} opacity={th.opacities.secondary}>
          <l.HoverButton
            onClick={() => {
              handleUpdateMessage(!isRead);
            }}
          >
            {isRead ? (
              <MessageRead height={th.sizes.xs} width={th.sizes.xs} />
            ) : (
              <MessageUnread height={th.sizes.xs} width={th.sizes.xs} />
            )}
          </l.HoverButton>
          <ty.CaptionText ml={th.spacing.md}>
            {format(new Date(messageDate), 'MM/dd h:mm a')}
          </ty.CaptionText>
        </l.Flex>
        <ty.BodyText>{header}</ty.BodyText>
        {details && (
          <ty.CaptionText mt={th.spacing.sm} secondary>
            {details}
          </ty.CaptionText>
        )}
      </div>
      <l.AreaLink to={actionLink || '#'}>
        <b.Primary
          onClick={() => {
            handleUpdateMessage(true);
          }}
        >
          {actionText}
        </b.Primary>
      </l.AreaLink>
    </l.Flex>
  );
};

interface Props {
  error?: ApolloError;
  loading: boolean;
  messages: UserMessage[];
  showReadMessages: boolean;
  setShowReadMessages: (show: boolean) => void;
  userId: number;
}

const UserMessages = ({
  error,
  loading,
  messages,
  showReadMessages,
  setShowReadMessages,
  userId,
}: Props) => {
  const groupedMessages = groupBy((message) => message.priority, messages);

  return (
    <l.Div width={700}>
      <l.Flex justifyEnd mb={th.spacing.md}>
        <LineItemCheckbox
          checked={showReadMessages}
          label={
            <ty.CaptionText ml={th.spacing.sm}>
              Show Read Messages
            </ty.CaptionText>
          }
          onChange={() => {
            setShowReadMessages(!showReadMessages);
          }}
        />
      </l.Flex>
      {!isEmpty(messages) ? (
        values(
          mapObjIndexed((messagesByPriority, priorityKey) => {
            const priority = userMessagePriorityMap[parseInt(priorityKey, 10)];
            return (
              <l.Div key={priorityKey} mb={th.spacing.lg}>
                <l.Flex alignCenter>
                  <StatusIndicator status={priority.status} />
                  <ty.BodyText ml={th.spacing.md}>
                    {priority.text} Priority
                  </ty.BodyText>
                </l.Flex>
                {messagesByPriority.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    showReadMessages={showReadMessages}
                    userId={userId}
                  />
                ))}
              </l.Div>
            );
          }, groupedMessages),
        )
      ) : (
        <DataMessage
          data={messages}
          error={error}
          loading={loading}
          emptyProps={{
            header: `No${showReadMessages ? '' : ' Unread'} Messages`,
          }}
        />
      )}
    </l.Div>
  );
};

export default UserMessages;
