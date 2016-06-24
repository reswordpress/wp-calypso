/**
 * External dependencies
 */
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { isRequestingPurchases } from 'state/purchases/selectors';
import { requestPurchases } from 'state/purchases/actions';

class QueryPurchases extends Component {
	componentWillMount() {
		if ( ! this.props.requestingPurchases ) {
			this.props.requestPurchases();
		}
	}

	render() {
		return null;
	}
}

QueryPurchases.propTypes = {
	requestingPurchases: PropTypes.bool,
	requestPurchases: PropTypes.func
};

QueryPurchases.defaultProps = {
	requestPurchases: () => {}
};

export default connect(
	state => {
		return {
			requestingPurchases: isRequestingPurchases( state )
		};
	},
	{ requestPurchases }
)( QueryPurchases );
