import React from 'react';
import styled from '@emotion/styled';
import Tooltip from 'react-tooltip';

import Chevron from 'assets/images/chevron';
import { baseDataTransforms } from 'components/base-data';
import { LabelInfo } from 'components/column-label';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import Expandable from './expandable';

const Wrapper = styled(l.Flex)({
  '& .show': {
    border: th.borders.disabled,
    opacity: '1 !important',
  },
});

const ListItem = <T extends {}>({
  content,
  data,
  gridTemplateColumns,
  highlightColor,
  hoverable,
  index,
  isHighlight,
  isHalfHighlight,
  listLabels,
  offsetTop,
  onClick,
  onSelectItem,
  rowKey,
  selected,
  to,
}: {
  content?: React.ReactNode;
  data: T;
  gridTemplateColumns: string;
  highlightColor?: string;
  hoverable?: boolean;
  index?: number;
  isHighlight?: boolean;
  isHalfHighlight?: boolean;
  listLabels: LabelInfo<T>[];
  offsetTop?: number;
  onClick?: () => void;
  onSelectItem?: () => void;
  rowKey?: string | number;
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
          <LineItemCheckbox
            checked={selected}
            onChange={onSelectItem}
            status="warning"
          />
        </l.Flex>
      )}
      {listLabels.map(
        (
          {
            allowClick,
            allowOverflow,
            key,
            getValue,
            rowKey: itemRowKey,
            transformKey,
          },
          idx,
        ) => {
          const value = transformKey
            ? baseDataTransforms[transformKey](data[key])
            : getValue
            ? getValue(data)
            : data[key];
          const localRowKey = itemRowKey ? itemRowKey(data) : rowKey;
          const keyIndex = `${String(key)}-${idx}-${localRowKey}`;
          return (
            <Wrapper
              alignCenter
              key={keyIndex}
              overflow={allowOverflow ? 'visible' : 'hidden'}
              px={th.spacing.sm}
              py={th.spacing.xs}
            >
              <l.Div data-tip data-for={keyIndex} width={th.sizes.fill}>
                <ty.BodyText
                  nowrap
                  onClick={(e: React.MouseEvent) => {
                    !content &&
                      (!onClick || !allowClick) &&
                      e.stopPropagation();
                  }}
                  width={th.sizes.fill}
                >
                  {value || '-'}
                </ty.BodyText>
              </l.Div>
              {localRowKey && (
                <Tooltip
                  id={keyIndex}
                  backgroundColor={th.colors.background}
                  effect="solid"
                  offset={{ top: offsetTop ? -offsetTop : 0 }}
                  place={index === 0 ? 'bottom' : 'top'}
                  type="light"
                >
                  <l.Div
                    pb={index === 0 ? undefined : th.spacing.xs}
                    pt={index === 0 ? th.spacing.xs : undefined}
                  >
                    {value || '-'}
                  </l.Div>
                </Tooltip>
              )}
            </Wrapper>
          );
        },
      )}
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
      hoverable={hoverable}
      highlightColor={highlightColor}
      isHighlight={isHighlight}
      isHalfHighlight={isHalfHighlight}
      selected={selected}
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
