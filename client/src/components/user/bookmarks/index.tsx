import React, { useState } from 'react';
import { sentenceCase } from 'change-case';
import { omit } from 'ramda';

import { DataMessage } from 'components/page/message';
import { useTabBar } from 'components/tab-bar';
import { User, UserBookmark } from 'types';
import { Select } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import Bookmark from './link';
import useUpdateBookmark from './update';

const INPUT_WIDTH = 300;

const tabs = [
  {
    id: 'quick-links',
    text: 'Bookmarks',
  },
];

interface Props {
  id: number;
  showReadMessages: boolean;
  user: User;
}

const UserBookmarks = ({ id, showReadMessages, user }: Props) => {
  const {
    actions: { add, create, update, cancel },
    categories,
    filterBookmarks,
    handleDelete,
    handleEdit,
    handleUpsert,
    newLink,
    bookmarks,
    updateComponents,
  } = useUpdateBookmark(user, showReadMessages, true, INPUT_WIDTH);

  const { TabBar } = useTabBar({
    tabs,
  });

  const [selectedCategory, setSelectedCategory] = useState(
    categories[0] || 'All',
  );

  const handleSortChange = (
    updatedLink: UserBookmark,
    direction: 'up' | 'down',
  ) => {
    const links = updatedLink.category && filterBookmarks(updatedLink.category);

    if (!links) {
      return;
    }
    const index = links.findIndex((link) => link.id === updatedLink.id);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newLinks = [...links];

    newLinks.splice(index, 1);
    newLinks.splice(newIndex, 0, updatedLink);

    handleUpsert({
      variables: {
        userBookmarks: newLinks.map((link, idx) => ({
          ...omit(['nodeId', '__typename'], link),
          sortOrder: idx + 1,
          userId: id,
        })),
      },
    });
  };

  return (
    <>
      <l.Flex justifyBetween mb={th.spacing.lg}>
        <TabBar />
        <l.Flex>
          {newLink ? (
            <>
              {cancel}
              {newLink.id > 0 ? update : add}
            </>
          ) : (
            create
          )}
        </l.Flex>
      </l.Flex>
      {bookmarks.length > 0 || newLink ? (
        <>
          {newLink && (
            <ty.BodyText mb={th.spacing.lg}>
              {newLink.id === 0 ? 'New' : 'Edit'} Bookmark:
            </ty.BodyText>
          )}
          {!newLink && (
            <>
              <ty.SmallText secondary mb={th.spacing.sm}>
                Category
              </ty.SmallText>
              <Select
                mb={th.spacing.lg}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedCategory(e.target.value)
                }
                value={selectedCategory}
                width={INPUT_WIDTH}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category ? sentenceCase(category) : ''}
                  </option>
                ))}
              </Select>
            </>
          )}
          {newLink
            ? updateComponents
            : selectedCategory === 'All'
            ? categories.map((category, idx) => {
                const filteredLinks = filterBookmarks(category || '');
                return (
                  filteredLinks.length > 0 && (
                    <l.Div key={category} mb={th.spacing.lg}>
                      {idx > 0 && (
                        <ty.CaptionText mb={th.spacing.sm} secondary>
                          {sentenceCase(category || '')}
                        </ty.CaptionText>
                      )}
                      {filteredLinks.map((link, idx) => (
                        <Bookmark
                          handleDelete={() => {
                            handleDelete(link.id);
                          }}
                          handleEdit={() => {
                            handleEdit(link);
                          }}
                          handleSortChange={handleSortChange}
                          isFirst={idx === 0}
                          isLast={idx === filteredLinks.length - 1}
                          key={link.id}
                          link={link}
                        />
                      ))}
                    </l.Div>
                  )
                );
              })
            : filterBookmarks(selectedCategory).map((link, idx) => (
                <Bookmark
                  handleDelete={() => {
                    handleDelete(link.id);
                  }}
                  handleSortChange={handleSortChange}
                  handleEdit={() => {
                    handleEdit(link);
                  }}
                  isFirst={idx === 0}
                  isLast={idx === filterBookmarks(selectedCategory).length - 1}
                  key={link.id}
                  link={link}
                />
              ))}
        </>
      ) : (
        <l.Div mt={66}>
          <DataMessage
            data={bookmarks}
            error={null}
            loading={false}
            emptyProps={{
              header: 'No bookmarks found',
            }}
          />
        </l.Div>
      )}
    </>
  );
};

export default UserBookmarks;
