<?php
/**
 * Fired during plugin deactivation
 *
 * @since      1.0.0
 *
 * @package    Minterpress
 * @subpackage Minterpress/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    Minterpress
 * @subpackage Minterpress/includes
 */
class Minterpress_Deactivator {

	/**
	 * Deactivate.
	 *
	 * Unregister settings, post types, and taxonomies.
	 *
	 * @since    1.0.0
	 */
	public static function deactivate() {
		// Unregister settings.
		$settings = array( 'pinata_api_key', 'pinata_api_secret', 'nft_refreshed_time', 'nfts_on_contract', 'tz_address', 'mp_theme' );
		foreach ( $settings as $setting ) {
			unregister_setting( 'minterpress', $setting );
		}

		// Remove post types.
		$post_types = array( 'minterpress_nfts', 'minterpress_gallery' );
		foreach ( $post_types as $post_type ) {
			unregister_post_type( $post_type );
		}

		// Remove taxonomies.
		$taxonomies = array( 'minterpress_category' );
		foreach ( $taxonomies as $taxonomy ) {
			unregister_taxonomy( $taxonomy );
		}
	}

}
