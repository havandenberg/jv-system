import React from 'react';

import Chevron from 'assets/images/chevron';
import { baseDataTransforms } from 'components/base-data';
import { LabelInfo } from 'components/column-label';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const ListItem = <T extends {}>({
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
  const content = (
    <l.GridContainer
      gridTemplateColumns={gridTemplateColumns}
      highlightColor={highlightColor}
      isHighlight={isHighlight}
      isHalfHighlight={isHalfHighlight}
    >
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
              (!onClick || !allowClick) && e.stopPropagation();
            }}
          >
            {(transformKey
              ? baseDataTransforms[transformKey](data[key])
              : getValue
              ? getValue(data)
              : data[key]) || '-'}
          </ty.BodyText>
        </l.Flex>
      ))}
      <l.Flex centered height={th.sizes.fill}>
        <Chevron height={th.spacing.md} />
      </l.Flex>
    </l.GridContainer>
  );

  return (
    <l.Div mb={th.spacing.sm}>
      {onClick || !to ? (
        <l.Div cursor="pointer" onClick={onClick}>
          {content}
        </l.Div>
      ) : (
        <l.AreaLink to={to ? to : '#'}>{content}</l.AreaLink>
      )}
    </l.Div>
  );
};

export default ListItem;
