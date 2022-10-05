import React from 'react';

import Chevron from 'assets/images/chevron';
import { baseDataTransforms } from 'components/base-data';
import { LabelInfo } from 'components/column-label';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import Expandable from './expandable';

const ListItem = <T extends {}>({
  content,
  data,
  gridTemplateColumns,
  highlightColor,
  isHighlight,
  isHalfHighlight,
  listLabels,
  onClick,
  onSelectItem,
  selected,
  to,
}: {
  content?: React.ReactNode;
  data: T;
  gridTemplateColumns: string;
  highlightColor?: string;
  isHighlight?: boolean;
  isHalfHighlight?: boolean;
  listLabels: LabelInfo<T>[];
  onClick?: () => void;
  onSelectItem?: () => void;
  selected?: boolean;
  to?: string;
}) => {
  const clickable = !!onClick || !!to;

  const [isOpen, setIsOpen] = React.useState(false);

  const toggleIsOpen = () => setIsOpen(!isOpen);

  const header = (
    <l.Grid gridTemplateColumns={gridTemplateColumns}>
      {onSelectItem && (
        <l.Flex justifyStart centered height={th.sizes.fill}>
          <LineItemCheckbox checked={selected} onChange={onSelectItem} />
        </l.Flex>
      )}
      {listLabels.map(({ allowClick, key, getValue, transformKey }, idx) => (
        <l.Flex
          alignCenter
          key={`${String(key)}-${idx}`}
          overflow="hidden"
          px={th.spacing.sm}
          py={th.spacing.xs}
        >
          <ty.BodyText
            nowrap
            onClick={(e: React.MouseEvent) => {
              !content && (!onClick || !allowClick) && e.stopPropagation();
            }}
            width={th.sizes.fill}
          >
            {(transformKey
              ? baseDataTransforms[transformKey](data[key])
              : getValue
              ? getValue(data)
              : data[key]) || '-'}
          </ty.BodyText>
        </l.Flex>
      ))}
      {clickable && (
        <l.Flex centered height={th.sizes.fill}>
          <Chevron height={th.spacing.md} />
        </l.Flex>
      )}
    </l.Grid>
  );

  const components = (
    <l.Cell
      clickable={clickable || !!content}
      highlightColor={highlightColor}
      isHighlight={isHighlight}
      isHalfHighlight={isHalfHighlight}
    >
      {content ? (
        <Expandable
          header={header}
          content={content}
          isOpen={isOpen}
          toggleIsOpen={toggleIsOpen}
        />
      ) : (
        header
      )}
    </l.Cell>
  );

  return (
    <l.Div mb={th.spacing.sm} width={th.sizes.fill}>
      {onClick || !to ? (
        <l.Div onClick={onClick}>{components}</l.Div>
      ) : (
        <l.AreaLink to={to ? to : '#'}>{components}</l.AreaLink>
      )}
    </l.Div>
  );
};

export default ListItem;
