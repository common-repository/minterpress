<?php
/**
 * Fired during plugin activation
 *
 * @since      1.0.0
 *
 * @package    Minterpress
 * @subpackage Minterpress/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Minterpress
 * @subpackage Minterpress/includes
 */
class Minterpress_Activator {
	/**
	 * Activate.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		// Create transient data indicating plugin has been activated.
		set_transient( 'mp_activation_notice', true, 5 );
	}

}
