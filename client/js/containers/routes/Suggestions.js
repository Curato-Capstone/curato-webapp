import React, { Component } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routerActions } from 'react-router-redux';

import * as userActions from 'modules/user';
import * as suggestionsActions from 'modules/suggestions';

import Card from 'reusable/Card/Card'

@Radium
class Suggestions extends Component {
    static defaultProps = {};
    props: {};
    state: void;

    render() {
        const { actions, suggestions, favorites } = this.props;

        return (
            <div style={STYLES.container}>
                <div style={STYLES.cardsContainer}>
                    {suggestions.slice(0,2).map((place, index) => {
                        return (
                            <div key={place.id} style={STYLES.cardContainer}>
                                <Card
                                    key={place.id}
                                    place={place}
                                    favorite={this.checkFavorited(place)}
                                    handleFavorite={() => this.handledFavorite(place, index)}
                                    handleDislike={() => actions.removeSuggestion(index)}
                                    handleMore={() => {}}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    checkFavorited(place) {
        const { favorites } = this.props;
        for (let i = 0; i < favorites.length; i ++ ){
            if (favorites[i].id === place.id) {
                return true;
            }
        }

        return false;
    }

    handledFavorite(place, index) {
        if (this.checkFavorited(place)) {
            this.props.actions.removeFavorite(index);
        } else {
            this.props.actions.addFavorite(place);
        }

    }
}

const STYLES = {
    container: {
        width: '100%',
        minHeight: '100vh'
    },

    cardsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: '64px',
        '@media (min-width: 1200px)': {
            flexDirection: 'row',
        }
    },

    cardContainer: {
        // marginRight: '24px',
        transform: 'scale(1, 1)',
        '@media (min-width: 1200px)': {
            transform: 'scale(0.8, 0.8)',
        }
    }
};

function mapStateToProps(state, ownProps) {
    return {
        user: state.get('user').toJS(),
        favorites: state.getIn(['user', 'favorites']).toJS(),
        suggestions: state.getIn(['suggestions', 'suggestions']).toJS(),
        location: ownProps.location
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions : bindActionCreators(Object.assign(
            {},
            userActions,
            suggestionsActions,
        ), dispatch),
        routerActions : bindActionCreators(routerActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Suggestions);