/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import merge from 'lodash/merge';
import mapValues from 'lodash/mapValues';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import { customize, purchase, activate } from 'state/themes/actions';
import CurrentTheme from 'my-sites/themes/current-theme';
import SidebarNavigation from 'my-sites/sidebar-navigation';
import ThanksModal from 'my-sites/themes/thanks-modal';
import config from 'config';
import EmptyContent from 'components/empty-content';
import JetpackUpgradeMessage from './jetpack-upgrade-message';
import JetpackManageDisabledMessage from './jetpack-manage-disabled-message';
import { getDetailsUrl, getSupportUrl, getHelpUrl, isPremium } from './helpers';
import actionLabels from './action-labels';
import { getQueryParams, getThemesList } from 'state/themes/themes-list/selectors';
import sitesFactory from 'lib/sites-list';
import { FEATURE_CUSTOM_DESIGN } from 'lib/plans/constants';
import UpgradeNudge from 'my-sites/upgrade-nudge';
import { getSelectedSite } from 'state/ui/selectors';
import { isJetpackSite } from 'state/sites/selectors';
import { canCurrentUser } from 'state/current-user/selectors';
import PageViewTracker from 'lib/analytics/page-view-tracker';
import { ThemeShowcase } from './logged-out';

const sites = sitesFactory();

const ThemesSingleSite = ( props ) => {
	const site = sites.getSelectedSite(),
		{ analyticsPath, analyticsPageTitle, isJetpack, translate } = props,
		jetpackEnabled = config.isEnabled( 'manage/themes-jetpack' );

	if ( isJetpack ) {
		if ( ! jetpackEnabled ) {
			return (
				<Main className="themes">
					<PageViewTracker path={ analyticsPath } title={ analyticsPageTitle }/>
					<SidebarNavigation />
					<CurrentTheme
						site={ site }
						canCustomize={ site && site.isCustomizable() } />
					<EmptyContent title={ translate( 'Changing Themes?' ) }
						line={ translate( 'Use your site theme browser to manage themes.' ) }
						action={ translate( 'Open Site Theme Browser' ) }
						actionURL={ site.options.admin_url + 'themes.php' }
						actionTarget="_blank"
						illustration="/calypso/images/drake/drake-jetpack.svg" />
				</Main>
			);
		}
		if ( ! site.hasJetpackThemes ) {
			return <JetpackUpgradeMessage site={ site } />;
		}
		if ( ! site.canManage() ) {
			return <JetpackManageDisabledMessage site={ site } />;
		}
	}

	return (
		<ThemeShowcase { ...props }>
			<SidebarNavigation />
			<ThanksModal
				site={ site }
				source={ 'list' }/>
			<CurrentTheme
				site={ site }
				canCustomize={ site && site.isCustomizable() } />
			<UpgradeNudge
				title={ translate( 'Get Custom Design with Premium' ) }
				message={ translate( 'Customize your theme using premium fonts, color palettes, and the CSS editor.' ) }
				feature={ FEATURE_CUSTOM_DESIGN }
				event="themes_custom_design"
			/>
		</ThemeShowcase>
	);
};

export default connect(
	state => {
		const selectedSite = getSelectedSite( state );
		return {
			queryParams: getQueryParams( state ),
			themesList: getThemesList( state ),
			selectedSite,
			isJetpack: isJetpackSite( state, selectedSite.ID ),
			isCustomizable: canCurrentUser( state, selectedSite.ID, 'edit_theme_options' )
		};
	},
	{
		activate,
		customize,
		purchase
	},
	( stateProps, dispatchProps, ownProps ) => {
		const { selectedSite: site, isCustomizable, isJetpack } = stateProps;

		return Object.assign(
			{},
			ownProps,
			stateProps,
			{
				options: merge(
					{},
					mapValues( dispatchProps, action => theme => action( theme, site, 'showcase' ) ),
					{
						customize: isCustomizable
							? {
								hideForTheme: theme => ! theme.active
							}
							: {},
						preview: {
							hideForTheme: theme => theme.active
						},
						purchase: config.isEnabled( 'upgrades/checkout' )
							? {
								hideForTheme: theme => theme.active || theme.purchased || ! theme.price
							}
							: {},
						activate: {
							hideForTheme: theme => theme.active || ( theme.price && ! theme.purchased )
						},
						tryandcustomize: {
							action: theme => dispatchProps.customize( theme, site, 'showcase' ),
							hideForTheme: theme => theme.active
						},
						separator: {
							separator: true
						},
						details: {
							getUrl: theme => getDetailsUrl( theme, site ), // TODO: Make this a selector
						},
						support: ! isJetpack // We don't know where support docs for a given theme on a self-hosted WP install are.
							? {
								getUrl: theme => getSupportUrl( theme, site ),
								hideForTheme: theme => ! isPremium( theme )
							}
							: {},
						help: ! isJetpack // We don't know where support forums for a given theme on a self-hosted WP install are.
							? {
								getUrl: theme => getHelpUrl( theme, site )
							}
							: {},
					},
					actionLabels
				),
				defaultOption: 'customize',
				getScreenshotOption: theme => theme.active ? 'customize' : 'preview'
			}
		);
	}
)( localize( ThemesSingleSite ) );
