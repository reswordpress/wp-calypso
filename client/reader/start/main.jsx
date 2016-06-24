/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import map from 'lodash/map';
import page from 'page';
import Masonry from 'react-masonry-component';
import times from 'lodash/times';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import { getRecommendationIds } from 'state/reader/start/selectors';
import QueryReaderStartRecommendations from 'components/data/query-reader-start-recommendations';
import StartCard from './card';
import FeedSubscriptionStore from 'lib/reader-feed-subscriptions';
import smartSetState from 'lib/react-smart-set-state';
import CardPlaceholder from './card-placeholder';

const Start = React.createClass( {

	smartSetState: smartSetState,

	getInitialState() {
		return {
			totalSubscriptions: 0
		};
	},

	// Add change listeners to stores
	componentDidMount() {
		FeedSubscriptionStore.on( 'change', this.handleChange );
	},

	// Remove change listeners from stores
	componentWillUnmount() {
		FeedSubscriptionStore.off( 'change', this.handleChange );
	},

	getStateFromStores() {
		return {
			totalSubscriptions: FeedSubscriptionStore.getTotalSubscriptions()
		};
	},

	handleChange() {
		this.smartSetState( this.getStateFromStores() );
	},

	graduateColdStart() {
		// Later, we'll store that the user has graduated Cold Start, so they won't see it again.
		// For the moment, just redirect to the following stream.
		page.redirect( '/' );
	},

	renderLoadingPlaceholders() {
		const count = 4;
		return times( count, function( i ) {
			return( <CardPlaceholder key={ 'placeholder-' + i } /> );
		} );
	},

	render() {
		const canGraduate = ( this.state.totalSubscriptions > 0 );
		const hasRecommendations = this.props.recommendationIds.length > 0;
		return (
			<Main className="reader-start">

				{ /* Have not followed a site yet */ }
				<div className="reader-start__bar-follow">
					<span className="reader-start__bar-text">{ this.translate( 'Follow one or more sites to get started' ) }</span>
				</div>

				{ /* Following at least one or more sites */ }
				{ canGraduate &&
					<div className="reader-start__bar-following">
						<span className="reader-start__bar-text">
							{
								this.translate(
									'Great! You\'re now following %(totalSubscriptions)d site.',
									'Great! You\'re now following %(totalSubscriptions)d sites.',
									{
										count: this.state.totalSubscriptions,
										args: {
											totalSubscriptions: this.state.totalSubscriptions
										}
									}
								)
							}
						</span>
						<a className="reader-start__bar-action">{ this.translate( 'OK, I\'m all set!' ) }</a>
					</div>
				}

				<QueryReaderStartRecommendations />
				<header className="reader-start__intro">
					<h1 className="reader-start__title">{ this.translate( 'Welcome to the WordPress.com Reader' ) }</h1>
					<p className="reader-start__description">{ this.translate( 'Reader is like a customizable newspaper with stories from your favorite places. Follow a few sites and their latest posts will appear here.' ) }</p>
					<p className="reader-start__description">{ this.translate( 'Below are some suggestions – Follow one or more sites to get started!' ) }</p>
				</header>

				{ ! hasRecommendations && this.renderLoadingPlaceholders() }

				{ hasRecommendations && <Masonry className="reader-start__cards" updateOnEachImageLoad={ true } options={ { gutter: 14 } }>
					{ this.props.recommendationIds ? map( this.props.recommendationIds, ( recId ) => {
						return (
							<StartCard
								key={ 'start-card-rec' + recId }
								recommendationId={ recId } />
						);
					} ) : null }
				</Masonry> }
			</Main>
		);
	}
} );

export default connect(
	( state ) => {
		return {
			recommendationIds: getRecommendationIds( state )
		};
	}
)( Start );
