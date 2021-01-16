import React from 'react';
import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { GlobalContextProvider } from 'context/global';
import Global from 'ui/global';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const Main = styled(l.Div)({
  margin: '0 auto',
  maxWidth: th.widths.maxPage,
  minHeight: '100vh',
});

const App = () => (
  <Router>
    <GlobalContextProvider>
      <ThemeProvider theme={th}>
        <Main>
          <Switch>
            <Route
              exact
              path="/"
              component={() => <ty.TitleText center>Boilerplate</ty.TitleText>}
            />
            <Redirect to="/" />
          </Switch>
        </Main>
        <Global />
      </ThemeProvider>
    </GlobalContextProvider>
  </Router>
);

export default App;
