/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import resizeImageUrl from 'lib/resize-image-url';
import { getNormalizedPost } from 'state/posts/selectors';

function PostTypeListPostThumbnail( { post } ) {
	if ( ! post || ! post.canonical_image ) {
		return null;
	}

	return (
		<div className="post-type-list__post-thumbnail-wrapper">
			<img
				src={ resizeImageUrl( post.canonical_image.uri, { w: 80 } ) }
				className="post-type-list__post-thumbnail" />
		</div>
	);
}

PostTypeListPostThumbnail.propTypes = {
	globalId: PropTypes.string
};

export default connect( ( state, ownProps ) => {
	return {
		post: getNormalizedPost( state, ownProps.globalId )
	};
} )( PostTypeListPostThumbnail );
