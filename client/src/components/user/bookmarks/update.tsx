import React, { useCallback, useEffect, useState } from 'react';
import { sentenceCase } from 'change-case';
import { omit, pluck, sortBy, uniq } from 'ramda';
import { useLocation } from 'react-router-dom';

import api from 'api';
import useItemSelector from 'components/item-selector';
import usePrevious from 'hooks/use-previous';
import { User, UserBookmark } from 'types';
import b from 'ui/button';
import TextInput from 'ui/input';
import th from 'ui/theme';
import ty from 'ui/typography';

const useUpdateBookmark = (
  user: User,
  showReadMessages: boolean,
  isDashboard: boolean,
  inputWidth: number,
) => {
  const { pathname, search } = useLocation();
  const currentUrl = `${pathname}${search}`;
  const previousCurrentUrl = usePrevious(currentUrl);

  const bookmarks = (user.userBookmarks.nodes || []) as UserBookmark[];
  const bookmark = bookmarks.find(
    (link) => link.linkUrl && currentUrl.includes(link.linkUrl),
  );
  const previousBookmark = usePrevious(bookmark);

  const [handleDelete] = api.useDeleteUserBookmark(user.id, showReadMessages);
  const [handleUpsert] = api.useUpsertUserBookmarks(user.id, false);

  const newLinkInitialState = {
    category: 'All',
    id: 0,
    linkDescription: '',
    linkUrl: isDashboard ? '' : currentUrl,
    nodeId: '',
    sortOrder: -1,
    userId: user.id,
  };

  const [newLink, setNewLink] = useState<UserBookmark | undefined>(
    isDashboard ? undefined : bookmark || newLinkInitialState,
  );

  const categories = [
    'All',
    ...uniq(
      pluck('category', (user.userBookmarks.nodes || []) as UserBookmark[]),
    )
      .filter((cat) => cat !== 'All')
      .sort(),
  ] as string[];

  const filterBookmarks = (cat: string) =>
    sortBy(
      (link) => link.sortOrder,
      bookmarks.filter((link) => link.category === cat),
    );

  const handleDeleteLink = (deleteId: number) => {
    handleDelete({ variables: { id: deleteId } });
  };

  const handleEdit = (link: UserBookmark) => {
    setNewLink(link);
  };

  const handleSave = () => {
    if (newLink) {
      handleUpsert({
        variables: {
          userBookmarks: [
            omit(['nodeId', '__typename'], {
              ...newLink,
              userId: user.id,
              id: newLink.id > 0 ? newLink.id : undefined,
            }),
          ],
        },
      }).then(() => {
        isDashboard && setNewLink(undefined);
      });
    }
  };

  const handleChange = useCallback(
    (field: keyof UserBookmark, value: string) => {
      if (newLink) {
        setNewLink({ ...newLink, [field]: value });
      }
    },
    [newLink],
  );

  const oldLink = bookmarks.find((link) => link.id === newLink?.id);

  const isDirty = oldLink
    ? JSON.stringify(oldLink) !== JSON.stringify(newLink)
    : !!newLink;

  const { ItemSelector: CategorySelector, localSearch } = useItemSelector({
    allItems: () => categories.map((cat) => ({ id: cat })),
    closeOnSelect: true,
    disableClear: true,
    disableSearchQuery: true,
    errorLabel: 'categories',
    getItemContent: (item) => (
      <ty.BodyText ml={th.spacing.sm}>{sentenceCase(item.id)}</ty.BodyText>
    ),
    isDirty: !oldLink || oldLink.category !== newLink?.category,
    loading: false,
    nameKey: 'id',
    placeholder: '',
    selectItem: (item: any) => {
      handleChange('category', item['id']);
    },
    selectedItem: newLink?.category || '',
    width: inputWidth,
  });

  const previousLocalSearch = usePrevious(localSearch);

  useEffect(() => {
    if (previousLocalSearch !== localSearch) {
      handleChange('category', localSearch || '');
    }
  }, [handleChange, localSearch, previousLocalSearch]);

  useEffect(() => {
    if (previousCurrentUrl !== currentUrl) {
      handleChange('linkUrl', currentUrl || '');
    }
  }, [handleChange, currentUrl, previousCurrentUrl]);

  useEffect(() => {
    if (!previousBookmark && bookmark) {
      setNewLink(bookmark);
    }
  }, [bookmark, previousBookmark]);

  const updateComponents = (
    <>
      <ty.SmallText secondary mb={th.spacing.sm}>
        Category
      </ty.SmallText>
      {CategorySelector}
      <ty.SmallText
        secondary
        mb={th.spacing.sm}
        mt={isDashboard ? th.spacing.lg : th.spacing.md}
      >
        Description
      </ty.SmallText>
      <TextInput
        autoFocus={!isDashboard}
        isDirty={oldLink?.linkDescription !== newLink?.linkDescription}
        onChange={(e) => {
          handleChange('linkDescription', e.target.value);
        }}
        value={newLink?.linkDescription || ''}
        width={inputWidth}
      />
      <ty.SmallText
        secondary
        mb={th.spacing.sm}
        mt={isDashboard ? th.spacing.lg : th.spacing.md}
      >
        URL
      </ty.SmallText>
      <TextInput
        isDirty={oldLink?.linkUrl !== newLink?.linkUrl}
        onChange={(e) => {
          handleChange('linkUrl', e.target.value);
        }}
        value={newLink?.linkUrl || ''}
        width={inputWidth}
      />
    </>
  );

  return {
    actions: {
      create: (
        <b.Success
          onClick={() => {
            setNewLink({
              ...newLinkInitialState,
              sortOrder: bookmarks.length,
            });
          }}
          small
        >
          Create
        </b.Success>
      ),
      add: (
        <b.Success
          disabled={
            !isDirty ||
            !newLink?.linkDescription ||
            !newLink.linkUrl ||
            !newLink.category
          }
          onClick={handleSave}
          small
        >
          Add
        </b.Success>
      ),
      update: (
        <b.Warning
          disabled={
            !isDirty ||
            !newLink?.linkDescription ||
            !newLink.linkUrl ||
            !newLink.category
          }
          onClick={handleSave}
          small
        >
          Update
        </b.Warning>
      ),
      cancel: (
        <b.Error
          mr={th.spacing.md}
          onClick={() => {
            setNewLink(undefined);
          }}
          small
        >
          Cancel
        </b.Error>
      ),
    },
    categories,
    filterBookmarks,
    handleDelete: handleDeleteLink,
    handleEdit,
    handleUpsert,
    isDirty,
    newLink,
    bookmarks,
    updateComponents,
  };
};

export default useUpdateBookmark;
