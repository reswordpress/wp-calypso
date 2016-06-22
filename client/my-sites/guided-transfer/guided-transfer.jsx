/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import page from 'page';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import HeaderCake from 'components/header-cake';
import AccountInfo from './account-info';

export default React.createClass( {
	displayName: 'GuidedTransfer',

	propTypes: {
		hostSlug: PropTypes.string,
		siteSlug: PropTypes.string.isRequired
	},

	showExporter() {
		page( `/settings/export/${this.props.siteSlug}` );
	},

	showHostSelection() {
		page( `/settings/export/${this.props.siteSlug}/guided` );
	},

	showBluehostAccountInfo() {
		page( `/settings/export/${this.props.siteSlug}/guided/bluehost` );
	},

	goBack() {
		if ( this.props.hostSlug ) {
			this.showHostSelection();
		} else {
			this.showExporter();
		}
	},

	getHostInfo( host ) {
		switch ( host ) {
			case 'bluehost': return {
				label: this.translate( 'Bluehost' ),
				url: '#bluehost'
			};
		}
	},

	render: function() {
		const hostInfo = this.getHostInfo( this.props.hostSlug );

		return (
			<div className="guided-transfer">
				<div className="guided-transfer__header-nav">
					<HeaderCake onClick={ this.goBack }>
							{ this.translate( 'Guided Transfer' ) }
					</HeaderCake>
				</div>

				<div className="guided-transfer__content">
					{ hostInfo
						? <AccountInfo hostInfo={ hostInfo } />
						: <Button onClick={ this.showBluehostAccountInfo }>Bluehost</Button>
					}
				</div>
			</div>
		);
	}
} );
