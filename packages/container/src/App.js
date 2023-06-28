import React, { lazy, Suspense, useEffect} from 'react';
import { Router,Redirect, Route, Switch } from 'react-router-dom';
import {
 StylesProvider,
 createGenerateClassName,
} from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';
import Header from './components/Header';
import Progress from './components/Progess';

const MarketingAppLazy = lazy(() => import('./components/MarketingApp'));
const AuthAppLazy = lazy(() => import('./components/AuthApp'));
const DashboardAppLazy = lazy(() => import('./components/DashboardApp'));

const generateClassName = createGenerateClassName({
    productionPrefix: 'co',
});

const history = createBrowserHistory();

export default () => {

    const [isSignedIn, setIsSignedIn] = React.useState(false);

    useEffect(() => {
        if (isSignedIn) {
            history.push('/dashboard');
        }
    }, [isSignedIn]);

    return (
        <Router history={history}>
            <StylesProvider generateClassName={generateClassName}>
            <div>
                <Header isSignedIn={isSignedIn} onSignOut={() => setIsSignedIn(false)} />
                <Suspense fallback={<Progress />}>
                    <Switch>
                        <Route path="/auth">
                            <AuthAppLazy onSignIn={() => setIsSignedIn(true)} />
                        </Route>
                        <Route path="/dashboard">
                            {!isSignedIn && <Redirect to="/" />}
                            <DashboardAppLazy />
                        </Route>
                        <Route path="/" component={MarketingAppLazy} />
                    </Switch>
                </Suspense>
            </div>
            </StylesProvider>
        </Router>
    );
};