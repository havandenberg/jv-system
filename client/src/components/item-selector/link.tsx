import React from 'react';

import ColorPicker from 'components/color-picker';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

export interface ItemLink {
  color?: string | null;
  id: string;
  text: string;
  disabled?: boolean;
}

interface Props {
  active?: boolean;
  link: ItemLink;
}

const ItemLinkRow = ({ active, link: { color, id, text } }: Props) => {
  const isTextItemOnly = id === '-1';
  return (
    <l.Flex alignCenter>
      {color && (
        <l.Div ml={th.spacing.sm}>
          <ColorPicker
            activeColor={color || ''}
            color={color || ''}
            height={th.spacing.sm}
            onChange={() => ({})}
            readOnly
            width={th.spacing.sm}
          />
        </l.Div>
      )}
      <ty.CaptionText
        bold={active}
        italic={isTextItemOnly}
        pl={th.spacing.sm}
        secondary={isTextItemOnly}
      >
        {text}
      </ty.CaptionText>
    </l.Flex>
  );
};

export default ItemLinkRow;
