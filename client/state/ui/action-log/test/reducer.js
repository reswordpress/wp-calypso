/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { useFakeTimers } from 'test/helpers/use-sinon';
import {
	SET_ROUTE,
} from 'state/action-types';
import reducer from '../reducer';

describe( 'reducer', () => {
	useFakeTimers( 1337 );

	it( 'should default to an empty list', () => {
		const state = reducer( undefined, {} );

		expect( state ).to.eql( [] );
	} );

	it( 'should add actions to the log', () => {
		const actions = [
			{
				type: SET_ROUTE,
				path: '/menus/77203074',
			},
			{
				type: SET_ROUTE,
				path: '/menus/foobar',
			},
		];
		const state = actions.reduce( reducer, undefined );

		expect( state ).to.eql( [
			{ ...actions[ 0 ], timestamp: 1337 },
			{ ...actions[ 1 ], timestamp: 1337 },
		] );
	} );
} );
