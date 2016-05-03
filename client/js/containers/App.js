// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routerActions } from 'react-router-redux';
import { StyleRoot } from 'radium';

import * as userActions from 'modules/user';
import * as suggestionsActions from 'modules/suggestions';

import Sample from 'components/Sample';
import SideNav from 'components/Navigation/SideNav';
import UserAvatar from 'components/Navigation/UserAvatar';
import BreadCrumbs from 'components/Navigation/BreadCrumbs';
import MessageBar from 'components/Reusable/MessageBar/MessageBar'
import Spinner from 'components/Reusable/Spinner/Spinner';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import curatoBaseTheme from 'utils/curatoTheme';

const curatoTheme = getMuiTheme(curatoBaseTheme);

class App extends Component {
    static defaultProps: void;
    props: {
        user          : Object,
        suggestions   : Object,
        global        : Object,
        auth          : Object,
        location      : Object,
        actions       : Object,
        routerActions : Object,
        children      : React.Element
    };
    state: void;

    componentWillMount() {
        this.props.actions.getUserData()
    }

    render(): React.Element {
        return (
            <StyleRoot>
                <MuiThemeProvider muiTheme={curatoTheme}>
                    {this.renderComponents()}
                </MuiThemeProvider>
            </StyleRoot>
        );
    }

    renderComponents() {
        if (this.props.auth.isAuthenticating) {
            return (
                <div style={STYLES.container}>
                    {this.renderSpinner()}
                </div>
            )
        } else {
            return (
                <div style={STYLES.container}>
                    {this.renderMessageBar()}
                    {this.renderNavigation()}
                    {this.renderSpinner()}
                    {this.props.children}
                </div>
            )
        }
    }

    renderMessageBar() {
        const { global } = this.props;
        const { errorMessage, successMessage } = global;

        if (errorMessage) {
            return <MessageBar type="error" message={errorMessage} />;
        } else if (successMessage) {
            return <MessageBar type="success" message={successMessage} />;
        }
    }

    renderNavigation() {
        const { location, user } = this.props;

        if (!location.pathname.includes('intro')) {
            return (
                <div style={STYLES.navContainer}>
                    <SideNav location={location} />
                    <UserAvatar name={user.name} />
                    <BreadCrumbs location={location} />
                </div>
            );
        }
    }

    renderSpinner() {
        const { global, auth } = this.props;

        if (global.loading || auth.isAuthenticating) {
            return <Spinner />;
        }
    }
}

const STYLES = {
    container: {
        fontFamily: 'Montserrat, Sans-Serif',
        display: 'flex',
        backgroundColor: '#F6F6F6',
        height: '100%'
    },

    navContainer: {
        marginRight: '50px',
        '@media (min-width: 520px)': {
            width: '80px',
        }
    }
};

function mapStateToProps(state, ownProps) {
    return {
        user: state.get('user').toJS(),
        suggestions: state.get('suggestions').toJS(),
        global: state.get('global').toJS(),
        auth: state.get('auth').toJS(),
        location: ownProps.location
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions : bindActionCreators(Object.assign(
            {},
            userActions,
            suggestionsActions
        ), dispatch),
        routerActions : bindActionCreators(routerActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
