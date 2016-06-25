/**
 * External dependencies
 */
import includes from 'lodash/includes';
import takeRight from 'lodash/takeRight';

/**
 * Internal dependencies
 */
import {
	GUIDED_TOUR_SHOW,
	GUIDED_TOUR_UPDATE,
	SET_ROUTE,
	THEMES_RECEIVE,
	PREVIEW_IS_SHOWING,
} from 'state/action-types';

const isRelevantActionType = includes.bind( null, [
	SET_ROUTE,
	GUIDED_TOUR_SHOW,
	GUIDED_TOUR_UPDATE,
	THEMES_RECEIVE,
	PREVIEW_IS_SHOWING,
] );

const newAction = ( action ) => ( {
	...action, timestamp: Date.now()
} );

export default ( state = [], action ) =>
	isRelevantActionType( action.type )
		? takeRight( [ ...state, newAction( action ) ], 50 )
		: state;
