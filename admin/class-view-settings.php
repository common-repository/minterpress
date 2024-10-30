<?php
/**
 * Class Minterpress\View_Settings
 *
 * @since      1.0.0
 *
 * @package    Minterpress
 */

namespace Minterpress\Views;

use Timber\Timber;
use Minterpress\Data_Encryption;
use Minterpress\Helper\Constants_Helper;

/**
 * Class responsible for displaying plugin settings.
 */
class View_Settings {

	/**
	 * Render instructions.
	 *
	 * @see minterpress_init_settings, src/views/settings.twig
	 *
	 * @since    1.0.0
	 */
	public static function render_section_1_cb() {
		$pinata_instructions = Constants_Helper::STRINGS['settings_pinata_instructions'];
		$html                = "<p>$pinata_instructions</p>";
		Timber::render_string( $html );
	}

	/**
	 * Render api key field.
	 *
	 * @see minterpress_init_settings, src/views/settings.twig
	 *
	 * @since    1.0.0
	 */
	public static function render_field_1_cb() {
		$html = "<input id='pinata_api_key' type='text' name='pinata_api_key' value='{{ get_option_decrypt('pinata_api_key') }}' required>";
		Timber::render_string( $html );
	}

	/**
	 * Render api secret field.
	 *
	 * @see minterpress_init_settings, src/views/settings.twig
	 *
	 * @since    1.0.0
	 */
	public static function render_field_2_cb() {
		$html = "<input id='pinata_api_secret' type='password' name='pinata_api_secret' value='{{ get_option_decrypt('pinata_api_secret') }}' required>";
		Timber::render_string( $html );
	}

	/**
	 * Validate and then encrypt the API key.
	 *
	 * @see minterpress_init_settings, src/views/settings.twig
	 *
	 * @since    1.0.0
	 *
	 * @param string $value Value of Pinata api key entered by user.
	 */
	public static function validate_key( $value ) {
		$minimum_length = 10;
		if ( strlen( $value ) < $minimum_length ) {
			self::display_error( 'pinata_api_key', 'API Key' );
			return;
		}

		$sanitized_value = sanitize_text_field( $value );

		return Data_Encryption::encrypt( $sanitized_value );
	}

	/**
	 * Validate and then encrypt the API secret.
	 *
	 * @see minterpress_init_settings, src/views/settings.twig
	 *
	 * @since    1.0.0
	 *
	 * @param string $value Value of Pinata api secret entered by user.
	 */
	public static function validate_secret( $value ) {
		$minimum_length = 10;
		if ( strlen( $value ) < $minimum_length ) {
			self::display_error( 'pinata_api_secret', 'API Secret' );
			return;
		}

		$sanitized_value = sanitize_text_field( $value );

		return Data_Encryption::encrypt( $sanitized_value );
	}

	/**
	 * Display an error related to the validation of the Pinata keys.
	 *
	 * @see https://developer.wordpress.org/reference/functions/add_settings_error/
	 *
	 * @since    1.0.0
	 *
	 * @param string $option The option machine name.
	 * @param string $friedly_option_name The option friendly name to display in the error.
	 */
	public static function display_error( $option, $friedly_option_name ) {
		add_settings_error(
			$option,
			$option,
			'That ' . $friedly_option_name . " doesn't look quite right. Please double check at <a href='https://app.pinata.cloud/keys'>https://app.pinata.cloud/keys</a>",
			'error',
		);
	}

}
