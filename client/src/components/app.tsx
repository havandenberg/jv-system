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
import Footer from 'components/footer';
import Nav from 'components/nav';
import Reports from 'components/reports';
import Inspections from 'components/reports/inspections';
import InspectionDetails from 'components/reports/inspections/details';
import ScrollToTop from 'components/scroll-to-top';
import { GlobalContextProvider } from 'context/global';
import Global from 'ui/global';
import l from 'ui/layout';
import th from 'ui/theme';

const Main = styled(l.Flex)({
  flexDirection: 'column',
  minHeight: '100vh',
});

const App = () => (
  <Router>
    <GlobalContextProvider>
      <ThemeProvider theme={th}>
        <Main>
          <Nav />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/reports" component={Reports} />
            <Route exact path="/reports/inspections" component={Inspections} />
            <Route
              exact
              path="/reports/inspections/:id"
              component={InspectionDetails}
            />
            <Redirect to="/" />
          </Switch>
          <Footer />
          <ScrollToTop />
        </Main>
        <Global />
      </ThemeProvider>
    </GlobalContextProvider>
  </Router>
);

export default App;
