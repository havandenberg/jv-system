import React from 'react';

import ArrowInCircle from 'assets/images/arrow-in-circle';
import l from 'ui/layout';
import th from 'ui/theme';

interface Props {
  content: React.ReactNode;
  disabled?: boolean;
  header: React.ReactNode;
  isOpen: boolean;
  toggleIsOpen: () => void;
}

const Expandable = ({
  content,
  disabled,
  header,
  isOpen,
  toggleIsOpen,
}: Props) => (
  <l.Div>
    <l.Flex
      alignCenter
      cursor={disabled ? 'default' : 'pointer'}
      onClick={disabled ? undefined : toggleIsOpen}
    >
      {disabled ? (
        <l.Div width={th.sizes.xs} />
      ) : (
        <l.Div
          transform={`translate(${isOpen ? 2 : -1}px,${
            isOpen ? 0 : -3
          }px) rotate(${isOpen ? -90 : 180}deg)`}
        >
          <ArrowInCircle height={th.sizes.xs} width={th.sizes.xs} />
        </l.Div>
      )}
      <l.Div flex={1} ml={th.spacing.sm}>
        {header}
      </l.Div>
    </l.Flex>
    {isOpen && content}
  </l.Div>
);

export default Expandable;
