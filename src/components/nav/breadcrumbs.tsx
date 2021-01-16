import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import ChevronImg from 'assets/images/chevron.svg';
import { NavItem } from 'components/nav/secondary';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

interface BreadcrumbProps {
  text: string;
  to: string;
}

const Breadcrumbs = ({
  breadcrumbs,
  location: { pathname },
}: {
  breadcrumbs: BreadcrumbProps[];
} & RouteComponentProps) => (
  <l.Flex alignCenter>
    {breadcrumbs.map(({ text, to }, idx) => {
      const active = pathname === to;
      return (
        <>
          {idx > 0 && <l.Img height={th.sizes.xs} src={ChevronImg} />}
          <l.AreaLink key={idx} to={active ? '#' : to}>
            <NavItem
              active={active}
              cursor={active ? 'default' : 'pointer'}
              px={th.spacing.sm}
            >
              <ty.BodyText>{text}</ty.BodyText>
            </NavItem>
          </l.AreaLink>
        </>
      );
    })}
  </l.Flex>
);

export default withRouter(Breadcrumbs);
