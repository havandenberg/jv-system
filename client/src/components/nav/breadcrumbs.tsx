import React from 'react';
import { useLocation } from 'react-router-dom';

import Chevron from 'assets/images/chevron';
import { NavItem } from 'components/nav/secondary';
import l from 'ui/layout';
import th from 'ui/theme';
import ty, { TextProps } from 'ui/typography';

export interface BreadcrumbProps {
  active?: boolean;
  text: string;
  to?: string;
}

const Breadcrumbs = ({
  breadcrumbs,
  customStyles,
}: {
  breadcrumbs: BreadcrumbProps[];
  customStyles?: { text?: TextProps };
}) => {
  const { pathname } = useLocation();
  return (
    <l.Flex alignCenter>
      {breadcrumbs.map(({ active, text, to }, idx) => {
        const isActive =
          active === undefined
            ? !!to && pathname.split('?')[0] === to.split('?')[0]
            : active;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <Chevron height={10} />}
            <l.AreaLink to={to || '#'}>
              <NavItem
                active={isActive}
                disabled={!to || active}
                pl={idx ? th.spacing.sm : 0}
                pr={th.spacing.sm}
              >
                <ty.CaptionText {...customStyles?.text}>{text}</ty.CaptionText>
              </NavItem>
            </l.AreaLink>
          </React.Fragment>
        );
      })}
    </l.Flex>
  );
};

export default Breadcrumbs;
