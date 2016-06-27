/**
 * Internal dependencies
 */
import {
	GUIDED_TOUR_SHOW,
	GUIDED_TOUR_UPDATE,
} from 'state/action-types';

import {
	withAnalytics,
	recordTracksEvent,
} from 'state/analytics/actions';

import guidedToursConfig from 'layout/guided-tours/config';
import { savePreference } from 'state/preferences/actions';
import { getPreference } from 'state/preferences/selectors';

/**
 * Returns an action object which will be used to hide or show a specific tour.
 *
 * @param {Object} options Options object, see fn signature.
 * @return {Object} Action object
 */
export function showGuidedTour( { shouldShow, shouldDelay = false, tour } ) {
	const showAction = {
		type: GUIDED_TOUR_SHOW,
		shouldShow,
		shouldDelay,
		tour,
	};

	// TODO(mcsf): track this *somewhere*, now that we'll stop relying on this
	// action for launching tours
	const trackEvent = recordTracksEvent( 'calypso_guided_tours_show', {
		tour_version: guidedToursConfig.get( tour ).version,
		tour,
	} );

	return shouldDelay ? showAction : withAnalytics( trackEvent, showAction );
}

export function quitGuidedTour( { tour, stepName, finished, error } ) {
	const quitAction = {
		type: GUIDED_TOUR_UPDATE,
		shouldShow: false,
		shouldReallyShow: false,
		shouldDelay: false,
		tour,
		stepName,
		finished,
	};

	const trackEvent = recordTracksEvent( `calypso_guided_tours_${ finished ? 'finished' : 'quit' }`, {
		step: stepName,
		tour_version: guidedToursConfig.get( tour ).version,
		tour,
		error,
	} );

	return ( dispatch, getState ) => {
		dispatch( addSeenGuidedTour( getState, tour, finished ) );
		dispatch( withAnalytics( trackEvent, quitAction ) );
	};
}

export function nextGuidedTourStep( { tour, stepName } ) {
	const nextAction = {
		type: GUIDED_TOUR_UPDATE,
		tour,
		stepName,
	};

	const trackEvent = recordTracksEvent( 'calypso_guided_tours_next_step', {
		step: stepName,
		tour_version: guidedToursConfig.get( tour ).version,
		tour,
	} );

	return withAnalytics( trackEvent, nextAction );
}

// TODO(mcsf): come up with a much better (read: safer) solution
function addSeenGuidedTour( getState, tourName, finished = false ) {
	return savePreference( 'guided-tours-history', [
		...getPreference( getState(), 'guided-tours-history' ),
		{
			timestamp: Date.now(),
			tourName,
			finished,
		}
	] );
}
