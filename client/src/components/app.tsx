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
import { DirectorySelectionContextProvider } from 'components/directory/selection-context';
import Footer from 'components/footer';
import Nav from 'components/nav';
import Reports from 'components/reports';
import Sales from 'components/sales';
import ScrollToTop from 'components/scroll-to-top';
import { UserContextProvider } from 'components/user/context';
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
      <QueryParamProvider ReactRouterRoute={Route}>
        <ThemeProvider theme={th}>
          <UserContextProvider>
            <DirectorySelectionContextProvider>
              <Main id="main">
                <Nav />
                <Switch>
                  <Route exact path="/" component={Dashboard} />
                  <Route path="/directory/:routeTabId?" component={Directory} />
                  <Route path="/reports" component={Reports} />
                  <Route path="/sales" component={Sales} />
                  <Redirect to="/" />
                </Switch>
                <Footer />
                <ScrollToTop />
              </Main>
              <Global />
            </DirectorySelectionContextProvider>
          </UserContextProvider>
        </ThemeProvider>
      </QueryParamProvider>
    </Router>
  </ApolloProvider>
);

export default App;
