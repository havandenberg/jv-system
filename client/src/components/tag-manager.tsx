import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { pluck } from 'ramda';

import Add from 'assets/images/plus-in-circle';
import Remove from 'assets/images/minus-in-circle';
import usePrevious from 'hooks/use-previous';
import {
  CommonPackTypeTag,
  CommonSizeTag,
  CommonSpeciesTag,
  CommonVarietyTag,
} from 'types';
import l, { DivProps } from 'ui/layout';
import th from 'ui/theme';
import ty, { TextProps } from 'ui/typography';

import EditableCell from './editable-cell';

const TagWrapper = styled(l.Flex)(
  ({
    active,
    editing,
    selecting,
  }: {
    active?: boolean;
    editing?: boolean;
    selecting?: boolean;
  }) => ({
    background: th.colors.brand.containerBackground,
    border: active ? th.borders.primary : th.borders.secondary,
    borderRadius: th.borderRadii.default,
    cursor: selecting && !editing ? 'pointer' : 'default',
    marginBottom: th.spacing.sm,
    marginRight: th.spacing.md,
    opacity: active ? 1 : th.opacities.disabled,
    padding: `${th.spacing.tn} ${th.spacing.sm}`,
    transition: th.transitions.default,
  }),
);

type TagProps = {
  active?: boolean;
  containerStyles?: DivProps;
  editing?: boolean;
  onChange: (updatedText: string) => void;
  onRemove: () => void;
  selecting?: boolean;
  tagText: string;
  textStyles?: TextProps;
  toggleActive?: () => void;
};

const Tag = ({
  active,
  containerStyles,
  editing,
  onChange,
  onRemove,
  selecting,
  tagText,
  textStyles,
  toggleActive,
}: TagProps) => (
  <TagWrapper
    active={active}
    border={th.borders.disabled}
    editing={editing}
    selecting={selecting}
    onClick={selecting && !editing ? toggleActive : undefined}
    {...containerStyles}
  >
    <>
      <EditableCell
        content={{ dirty: false, value: tagText }}
        defaultChildren={<ty.BodyText {...textStyles}>{tagText}</ty.BodyText>}
        editing={!!editing}
        inputProps={{ autoFocus: !tagText, width: 100 }}
        onChange={(e) => onChange(e.target.value)}
      />
      {editing && (
        <l.HoverButton ml={th.spacing.sm} onClick={onRemove}>
          <Remove height={th.sizes.xs} width={th.sizes.xs} />
        </l.HoverButton>
      )}
    </>
  </TagWrapper>
);

export type CommonProductTag =
  | CommonPackTypeTag
  | CommonSizeTag
  | CommonSpeciesTag
  | CommonVarietyTag;

type TagManagerProps = {
  commonProductId: string;
  editing?: boolean;
  handleChange: (tags: CommonProductTag[]) => void;
  productIdKey:
    | 'commonPackTypeId'
    | 'commonSizeId'
    | 'commonSpeciesId'
    | 'commonVarietyId';
  selecting?: boolean;
  tags: CommonProductTag[];
};

const TagManager = ({
  commonProductId,
  editing,
  handleChange,
  productIdKey,
  selecting,
  tags,
}: TagManagerProps) => {
  const [selectedTags, setSelectedTags] = useState(tags);
  const previousTagsLength = usePrevious(tags.length);
  const hasTags = tags.length > 0;

  const [newTagNextId, setNewTagNextId] = useState(-1);

  const handleAddTag = () => {
    handleChange([
      ...tags,
      {
        [productIdKey]: commonProductId,
        nodeId: `${newTagNextId}`,
        tagText: '',
      },
    ] as CommonProductTag[]);
    setNewTagNextId(newTagNextId - 1);
  };

  const handleChangeTag = (updatedTag: CommonProductTag) => {
    handleChange(
      tags.map((tag) => (tag.nodeId === updatedTag.nodeId ? updatedTag : tag)),
    );
  };

  const handleRemoveTag = (nodeId: string) => {
    handleChange(tags.filter((tag) => tag.nodeId !== nodeId));
  };

  const selectAll = () => {
    setSelectedTags(tags);
  };

  const selectNone = () => {
    setSelectedTags([]);
  };

  const toggleSelectTag = (tag: CommonProductTag) => {
    setSelectedTags(
      pluck('nodeId', selectedTags).includes(tag.nodeId)
        ? selectedTags.filter((t) => t.nodeId !== tag.nodeId)
        : [...selectedTags, tag],
    );
  };

  useEffect(() => {
    if (tags.length !== previousTagsLength) {
      setSelectedTags(tags);
    }
  }, [previousTagsLength, tags]);

  return (
    <>
      <l.Flex alignCenter height={42}>
        <ty.BodyText bold mb={11} mr={th.spacing.lg}>
          Tags:
        </ty.BodyText>
        {hasTags || editing ? (
          <l.Flex flexWrap="wrap">
            {tags.map((tag) => (
              <Tag
                active={
                  editing || !!selectedTags.find((t) => t.nodeId === tag.nodeId)
                }
                editing={editing}
                selecting={selecting}
                key={tag.nodeId}
                onChange={(updatedText: string) => {
                  handleChangeTag({ ...tag, tagText: updatedText });
                }}
                onRemove={() => {
                  handleRemoveTag(tag.nodeId);
                }}
                tagText={tag.tagText}
                toggleActive={() => {
                  toggleSelectTag(tag);
                }}
              />
            ))}
            {editing && (
              <l.HoverButton mb="9px" ml={th.spacing.md} onClick={handleAddTag}>
                <Add height={th.sizes.xs} width={th.sizes.xs} />
              </l.HoverButton>
            )}
          </l.Flex>
        ) : (
          <ty.BodyText mb={11} secondary>
            No tags
          </ty.BodyText>
        )}
      </l.Flex>
      {!editing && hasTags && selecting && (
        <l.Flex ml={75}>
          <l.HoverButton dark mr={th.spacing.md} onClick={selectAll}>
            <ty.SmallText color={th.colors.brand.primaryAccent}>
              Select All
            </ty.SmallText>
          </l.HoverButton>
          <l.HoverButton dark onClick={selectNone}>
            <ty.SmallText color={th.colors.brand.primaryAccent}>
              Select None
            </ty.SmallText>
          </l.HoverButton>
        </l.Flex>
      )}
    </>
  );
};

export default TagManager;
