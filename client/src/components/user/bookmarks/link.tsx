import React from 'react';

import { BasicModal } from 'components/modal';
import SortControl from 'components/sort-control';
import { UserBookmark } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const Bookmark = ({
  handleDelete,
  handleEdit,
  handleSortChange,
  isFirst,
  isLast,
  link,
}: {
  handleDelete: () => void;
  handleEdit: () => void;
  handleSortChange: (bookmark: UserBookmark, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
  link: UserBookmark;
}) => (
  <l.Div mb={th.spacing.sm}>
    <l.AreaLink
      title={`${link.linkDescription} - ${link.linkUrl}`}
      to={link.linkUrl || ''}
    >
      <l.Cell
        alignCenter
        display="flex"
        justifyBetween
        px={th.spacing.sm}
        py={th.spacing.xs}
      >
        <l.Flex alignCenter>
          <SortControl
            disableDown={isLast}
            disableUp={isFirst}
            onDown={(e) => {
              e.preventDefault();
              handleSortChange(link, 'down');
            }}
            onUp={(e) => {
              e.preventDefault();
              handleSortChange(link, 'up');
            }}
          />
          <ty.BodyText ellipsis ml={th.spacing.md}>
            {link.linkDescription}
          </ty.BodyText>
        </l.Flex>
        <l.Flex alignCenter>
          <b.Warning
            mr={th.spacing.sm}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              handleEdit();
            }}
            small
          >
            Edit
          </b.Warning>
          <l.Div
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <BasicModal
              title="Confirm Delete Bookmark"
              content={
                <ty.BodyText>
                  Are you sure you want to delete this bookmark?
                </ty.BodyText>
              }
              confirmText="Delete"
              handleConfirm={handleDelete}
              confirmProps={{ status: th.colors.status.error }}
              triggerProps={{
                small: true,
                status: th.colors.status.error,
              }}
              triggerText="Del"
            />
          </l.Div>
        </l.Flex>
      </l.Cell>
    </l.AreaLink>
  </l.Div>
);

export default Bookmark;
