/**
 * External dependencies
 */
import React from 'react';
import PureRenderMixin from 'react-pure-render/mixin';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import RootChild from 'components/root-child';

export default React.createClass( {
	mixins: [ PureRenderMixin ],

	render: function() {
		const classes = classNames( 'wp-content', 'first-view', {
			'is-active': this.props.isActive
		} );

		return (
			<RootChild className={ classes }>
				<div className="first-view__content">
					{ this.props.children }

					<Button onClick={ this.dismiss }>{ this.translate( 'Got it!' ) }</Button>

					<div className="first-view__hide-preference">
						<label>
							<input type="checkbox" checked={ ! this.props.shouldShowAgain } onChange={ this.clickDontShowAgain } />
							{ this.translate( 'Don\'t show this again' ) }
						</label>
					</div>
				</div>
			</RootChild>
		);
	},

	dismiss: function() {
		if ( this.props.onDismiss ) {
			this.props.onDismiss();
		}
	},

	clickDontShowAgain: function( event ) {
		if ( this.props.onClickDontShowAgain ) {
			this.props.onClickDontShowAgain( event.target.value );
		}
	}
} );
