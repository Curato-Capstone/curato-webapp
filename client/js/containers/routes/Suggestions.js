// @flow
import React, { Component } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routerActions } from 'react-router-redux';
import FlipMove from 'react-flip-move';
import type { Place } from 'flow/types';
import { user as userActions, suggestions as suggestionsActions } from 'modules/index';

import { primaryColor } from 'utils/colors';

import Card from 'reusable/Card/Card';
import fourSquareImage from 'images/foursquare.png';

@Radium
class Suggestions extends Component {
    static defaultProps = {};
    props: {
        suggestions: Array<Place>,
        favorites: Array<Place>,
        actions: Object
    };
    state: void;

    render() {
        const { suggestions } = this.props;

        return (
            <div style={STYLES.container}>
                <FlipMove
                    className="suggestionsContainer"
                    duration={800}
                    style={STYLES.cardsContainer}
                >
                    {suggestions.length ?
                        suggestions.slice(0, 3).map((place, index) => (
                            <div key={place.id} enterAnimation="fade" leaveAnimation="fade">
                                <Card
                                    key={place.id}
                                    place={place}
                                    favorite={this.checkFavorited(place)}
                                    handleFavorite={() => this.handleFavorite(place, index)}
                                    handleDislike={() => this.handleDislike(place, index)}
                                />
                            </div>
                    ))  :
                    <div>{this.renderEmptyState()}</div>
                    }
                </FlipMove>
                <img style={STYLES.fourSquare} src={fourSquareImage} />
            </div>
        );
    }

    renderEmptyState() {
        if (!this.props.suggestions.length) {
            return (
                <div style={STYLES.empty.text} key="empty">
                    <p>
                        Didn't like any of our
                        <Link to="/" style={STYLES.empty.link}> suggestions</Link>?
                        We'll try harder next time!
                    </p>
                    <p>
                        Maybe try changing your
                        <Link to="/preferences" style={STYLES.empty.link}> preferences</Link>!
                    </p>
                </div>
            );
        }
    }

    checkFavorited(place) {
        const { favorites } = this.props;
        for (let i = 0; i < favorites.length; i ++) {
            if (favorites[i] === place.id) {
                return true;
            }
        }

        return false;
    }

    handleFavorite(place) {
        if (this.checkFavorited(place)) {
            this.props.actions.removeFavoriteThunk(place.id);
        } else {
            this.props.actions.addFavoriteThunk(place.id);
        }
    }

    handleDislike(place, index) {
        this.props.actions.dislikePlace(place.id);
        this.props.actions.removeSuggestion(index);
    }
}

const STYLES = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        paddingLeft: '40px',
        boxSizing: 'border-box',
        '@media (min-width: 520px)': {
            paddingLeft: '80px'
        }
    },

    cardsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: '72px',
        marginBottom: '30px'
    },

    cardContainer: {
        transform: 'scale(1, 1)',
        '@media (min-width: 1200px)': {
            transform: 'scale(0.8, 0.8)',
        }
    },

    fourSquare: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },

    empty: {
        text: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '16px',
            textAlign: 'center',
            margin: '0 16px 30px 16px',
            color: 'grey',
            '@media (min-width: 520px)': {
                fontSize: '20px',
            }
        },

        link: {
            color: primaryColor,
            fontWeight: 'bold'
        }
    }
};

function mapStateToProps(state) {
    const places =  state.get('places').toJS();

    return {
        favorites: state.getIn(['user', 'favorites']).toJS(),
        suggestions: state.getIn(['suggestions', 'suggestions']).toJS().map((id) => places[id]),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions : bindActionCreators({
            ...userActions,
            ...suggestionsActions,
        }, dispatch),
        routerActions : bindActionCreators(routerActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Suggestions);
