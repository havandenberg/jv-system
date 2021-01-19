import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import ChevronImg from 'assets/images/chevron.svg';
import { NavItem } from 'components/nav/secondary';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

export interface BreadcrumbProps {
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
        <React.Fragment key={idx}>
          {idx > 0 && <l.Img height={10} src={ChevronImg} />}
          <l.AreaLink to={active ? '#' : to}>
            <NavItem
              active={active}
              cursor={active ? 'default' : 'pointer'}
              px={th.spacing.sm}
            >
              <ty.BodyText>{text}</ty.BodyText>
            </NavItem>
          </l.AreaLink>
        </React.Fragment>
      );
    })}
  </l.Flex>
);

export default withRouter(Breadcrumbs);
