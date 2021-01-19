import React from 'react';
import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import 'react-image-lightbox/style.css';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import Dashboard from 'components/dashboard';
import Nav from 'components/nav';
import Reports from 'components/reports';
import Inspections from 'components/reports/inspections';
import { GlobalContextProvider } from 'context/global';
import Global from 'ui/global';
import l from 'ui/layout';
import th from 'ui/theme';

const Main = styled(l.Div)({
  margin: '0 auto',
  maxWidth: th.widths.maxContent,
  marginTop: th.heights.nav,
  paddingTop: th.spacing.lg,
});

const App = () => (
  <Router>
    <GlobalContextProvider>
      <ThemeProvider theme={th}>
        <Nav />
        <Main>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/reports" component={Reports} />
            <Route exact path="/reports/inspections" component={Inspections} />
            <Redirect to="/" />
          </Switch>
        </Main>
        <Global />
      </ThemeProvider>
    </GlobalContextProvider>
  </Router>
);

export default App;
