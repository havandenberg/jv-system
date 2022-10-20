import React, { useState } from 'react';
import styled from '@emotion/styled';
import OutsideClickHandler from 'react-outside-click-handler';
import { useLocation } from 'react-router-dom';

import BookmarkImg from 'assets/images/bookmark';
import BookmarkOutlineImg from 'assets/images/bookmark-outline';
import { User, UserBookmark } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import useUpdateBookmark from './update';

const Wrapper = styled(l.Cell)({
  background: '#F3F4F6',
  border: th.borders.primary,
  boxShadow: th.shadows.box,
  ':hover': {
    backgroundColor: '#F3F4F6',
    border: th.borders.primary,
  },
});

type Props = {
  user: User;
};

const AddBookmark = ({ user }: Props) => {
  const { pathname, search } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const bookmarks = (user.userBookmarks.nodes || []) as UserBookmark[];
  const bookmark = bookmarks.find(
    (link) => link.linkUrl && `${pathname}${search}`.includes(link.linkUrl),
  );

  const Bookmark = !!bookmark ? BookmarkImg : BookmarkOutlineImg;

  const {
    actions: { add, update },
    updateComponents,
  } = useUpdateBookmark(user, false, false, 260);

  return (
    <l.Div relative>
      <OutsideClickHandler
        onOutsideClick={() => {
          setIsOpen(false);
        }}
      >
        <l.HoverButton
          active={isOpen}
          dark
          height={20}
          mr={th.spacing.md}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          width={20}
        >
          <Bookmark height={20} width={20} />
        </l.HoverButton>
        {isOpen && (
          <Wrapper
            clickable={false}
            px={th.spacing.md}
            pt={th.spacing.sm}
            pb={th.spacing.md}
            position="absolute"
            left={-264}
            top={`calc(${th.spacing.sm} + ${th.sizes.fill})`}
            width={264}
          >
            <l.Flex alignCenter justifyBetween mb={th.spacing.md}>
              <ty.CaptionText>Add Bookmark:</ty.CaptionText>
              <l.Flex
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                {!!bookmark ? update : add}
              </l.Flex>
            </l.Flex>
            {updateComponents}
          </Wrapper>
        )}
      </OutsideClickHandler>
    </l.Div>
  );
};

export default AddBookmark;
