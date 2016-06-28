/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Gridicon from 'components/gridicon';

export default React.createClass( {
	displayName: 'PopoverMenuItem',

	propTypes: {
		isVisible: PropTypes.bool,
		className: PropTypes.string,
		icon: PropTypes.string,
		focusOnHover: PropTypes.bool
	},

	getDefaultProps: function() {
		return {
			isVisible: false,
			className: '',
			focusOnHover: true
		};
	},

	render: function() {
		const onMouseOver = this.props.focusOnHover ? this._onMouseOver : null;

		let icon;
		if ( this.props.icon ) {
			icon = <Gridicon icon={ this.props.icon } size={ 18 } />;
		}

		return (
			<button className={ classnames( 'popover__menu-item', this.props.className ) }
					role="menuitem"
					disabled={ this.props.disabled }
					onClick={ this.props.onClick }
					onMouseOver={ onMouseOver }
					tabIndex="-1">
				{ icon }
				{ this.props.children }
			</button>
		);
	},

	_onMouseOver: function( event ) {
		event.target.focus();
	}
} );
