/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-pure-render/mixin';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import FirstView from './first-view';

export default ( Wrapped, FirstViewContent ) => {
	const Wrapper = React.createClass( {
		mixins: [ PureRenderMixin ],

		getInitialState: function() {
			return {
				isFirstViewActive: false // TODO: use prop `shouldShow`
			};
		},

		componentDidMount() {
			if ( this.props.shouldShow ) {
				// we have to slightly delay this so that the CSS transition will show
				process.nextTick( this.showFirstView );
			}
		},

		componentDidUpdate() {
			if ( this.state.isFirstViewActive ) {
				this.preventPageScrolling();
			} else {
				this.allowPageScrolling();
			}
		},

		componentWillUnmount() {
			this.allowPageScrolling();
		},

		render() {
			if ( ! this.props.shouldShow ) {
				return (
					<Wrapped {...this.props} />
				);
			}

			const classes = classNames( 'first-viewable', {
				'is-first-view-active': this.state.isFirstViewActive
			} );

			return (
				<div className={ classes }>
					<FirstView isActive={ this.state.isFirstViewActive } onDismiss={ this.dismissFirstView }
						         shouldShowAgain={ this.props.shouldShowAgain } onClickDontShowAgain={ this.clickDontShowAgain }>
						<FirstViewContent />
					</FirstView>
					<Wrapped {...this.props} />
				</div>
			);
		},

		showFirstView() {
			// TODO: call Redux action
			this.setState( { isFirstViewActive: true } );
		},

		dismissFirstView() {
			// TODO: call Redux action
			this.setState( { isFirstViewActive: false } );
		},

		clickDontShowAgain( shouldNotShowAgain ) {
			// TODO: call Redux action
		},

		preventPageScrolling: function() {
			document.documentElement.classList.add( 'no-scroll' );
		},

		allowPageScrolling: function() {
			document.documentElement.classList.remove( 'no-scroll' );
		}
	} );

	return connect(
		( state, ownProps ) => {
			return {
				// TODO: get from Redux state tree
				shouldShow: true,
				shouldShowAgain: true
			};
		},
		( dispatch, ownProps ) => {
			return {
				// TODO
			};
		}
	)( Wrapper );
};
