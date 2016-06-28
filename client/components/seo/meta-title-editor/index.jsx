import React, { Component, PropTypes } from 'react';
import get from 'lodash/get';
import identity from 'lodash/identity';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import { connect } from 'react-redux';

import SegmentedControl from 'components/segmented-control';
import TokenField from 'components/token-field';
import { localize } from 'i18n-calypso';

import {
	nativeToRaw,
	rawToNative,
	removeBlanks
} from './mappings';

const titleTypes = translate => [
	{ value: 'frontPage', label: translate( 'Front Page' ) },
	{ value: 'posts', label: translate( 'Posts' ) },
	{ value: 'pages', label: translate( 'Pages' ) },
	{ value: 'groups', label: translate( 'Categories & Tags' ) },
	{ value: 'archives', label: translate( 'Archives' ) }
];

const getValidTokens = translate => ( {
	siteName: translate( 'Site Name' ),
	tagline: translate( 'Tagline' ),
	postTitle: translate( 'Post Title' ),
	pageTitle: translate( 'Page Title' ),
	groupTitle: translate( 'Category/Tag Title' ),
	date: translate( 'Date' )
} );

// for future use in this feature
const tokenMap = {
	frontPage: [ 'siteName', 'tagline' ],
	posts: [ 'siteName', 'tagline', 'postTitle' ],
	pages: [ 'siteName', 'tagline', 'pageTitle' ],
	groups: [ 'siteName', 'tagline', 'groupTitle' ],
	archives: [ 'siteName', 'tagline', 'date' ]
};

const tokenize = translate => s => {
	if ( ! isString( s ) ) { return s }

	// find token key from translated label
	const tokens = getValidTokens( translate );
	const type = Object
		.keys( tokens )
		.filter( k => tokens[ k ] === s )
		.shift();

	return isUndefined( type )
		? { type: 'string', isBorderless: true, value: s }
		: { type: type, value: s };
};

export class MetaTitleEditor extends Component {
	constructor() {
		super();

		this.state = {
			type: 'frontPage',
			tokens: rawToNative( '%site_name% | %tagline%' )
		};

		this.switchType = this.switchType.bind( this );
		this.update = this.update.bind( this );
	}

	switchType( { value: type } ) {
		const { titleFormats } = this.props;
		const tokens = rawToNative( get( titleFormats, type, '' ) );

		this.setState( { tokens, type } );
	}

	update( values ) {
		const { saveMetaTitle, translate } = this.props;
		const { type } = this.state;

		const tokens = removeBlanks( map( values, tokenize( translate ) ) );

		saveMetaTitle( type, nativeToRaw( tokens ) );
		this.setState( { tokens } );
	}

	render() {
		const {
			disabled = false,
			translate = identity
		} = this.props;
		const {
			tokens,
			type
		} = this.state;

		const validTokens = getValidTokens( translate );

		const values = tokens.map(
			token => 'string' !== token.type
				? { ...token, value: validTokens[ token.type ] }
				: { ...token, isBorderless: true }
		);

		const suggestions = tokenMap[ type ].map( t => validTokens[ t ] );

		return (
			<div>
				<SegmentedControl
					initialSelected={ type }
					options={ titleTypes( translate ) }
					onSelect={ this.switchType }
				/>
				<TokenField
					disabled={ disabled }
					onChange={ this.update }
					saveTransform={ identity } // don't trim whitespace
					suggestions={ suggestions }
					value={ values }
				/>
			</div>
		);
	}
}

MetaTitleEditor.propTypes = {
	disabled: PropTypes.bool
};

const mapStateToProps = state => ( {
	titleFormats: {
		frontPage: '%site_name% | %tagline%',
		posts: '%post_title% - %site_name%',
		pages: '%page_title% - %site_name%',
		groups: '%site_name% > %group_title%',
		archives: '%site_name% (%date%)'
	}
} );

const mapDispatchToProps = dispatch => ( {
	saveMetaTitle: ( contentType, title ) => console.log( { type: 'SEO_SET_META_TITLE', contentType, title } )
} );

export default connect( mapStateToProps, mapDispatchToProps )( localize( MetaTitleEditor ) );