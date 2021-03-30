import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import 'react-image-lightbox/style.css';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import Dashboard from 'components/dashboard';
import Directory from 'components/directory';
import Footer from 'components/footer';
import Nav from 'components/nav';
import Reports from 'components/reports';
import Inspections from 'components/reports/inspections';
import ChileInspectionDetails from 'components/reports/inspections/chile-departure/details';
import PeruInspectionDetails from 'components/reports/inspections/peru-departure/details';
import ScrollToTop from 'components/scroll-to-top';
import { GlobalContextProvider } from 'context/global';
import Global from 'ui/global';
import l from 'ui/layout';
import th from 'ui/theme';

const client = new ApolloClient({
  uri: process.env.REACT_APP_DATABASE_API_URL,
  cache: new InMemoryCache(),
});

const Main = styled(l.Flex)({
  flexDirection: 'column',
  minHeight: '100vh',
});

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <GlobalContextProvider>
        <QueryParamProvider ReactRouterRoute={Route}>
          <ThemeProvider theme={th}>
            <Main>
              <Nav />
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route path="/directory/:routeTabId?" component={Directory} />
                <Route exact path="/reports" component={Reports} />
                <Route
                  exact
                  path="/reports/inspections/d-peru/:id"
                  component={PeruInspectionDetails}
                />
                <Route
                  exact
                  path="/reports/inspections/d-chile/:id"
                  component={ChileInspectionDetails}
                />
                <Route
                  path="/reports/inspections/:routeTabId?"
                  component={Inspections}
                />
                <Redirect to="/" />
              </Switch>
              <Footer />
              <ScrollToTop />
            </Main>
            <Global />
          </ThemeProvider>
        </QueryParamProvider>
      </GlobalContextProvider>
    </Router>
  </ApolloProvider>
);

export default App;
