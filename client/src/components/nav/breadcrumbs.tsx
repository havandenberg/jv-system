import React from 'react';
import { useLocation } from 'react-router-dom';

import Chevron from 'assets/images/chevron';
import { NavItem } from 'components/nav/secondary';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

export interface BreadcrumbProps {
  text: string;
  to?: string;
}

const Breadcrumbs = ({ breadcrumbs }: { breadcrumbs: BreadcrumbProps[] }) => {
  const { pathname } = useLocation();
  return (
    <l.Flex alignCenter>
      {breadcrumbs.map(({ text, to }, idx) => {
        const active = !!to && pathname === to;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <Chevron height={10} />}
            <l.AreaLink to={active || !to ? '#' : to}>
              <NavItem
                active={active}
                disabled={!to}
                pl={idx ? th.spacing.sm : 0}
                pr={th.spacing.sm}
              >
                <ty.BodyText>{text}</ty.BodyText>
              </NavItem>
            </l.AreaLink>
          </React.Fragment>
        );
      })}
    </l.Flex>
  );
};

export default Breadcrumbs;
