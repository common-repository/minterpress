<?php
/**
 * Class Minterpress\Data_Encryption
 *
 * Based on https://github.com/google/site-kit-wp/blob/1.2.0/includes/Core/Storage/Data_Encryption.php
 *
 * @since      1.0.0
 *
 * @package    Minterpress
 */

namespace Minterpress;

/**
 * Class responsible for encrypting and decrypting data.
 *
 * @since 1.0.0
 * @access private
 * @ignore
 */
final class Data_Encryption {

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->key  = $this->get_default_key();
		$this->salt = $this->get_default_salt();
	}

	/**
	 * Encrypts a value.
	 *
	 * If a user-based key is set, that key is used. Otherwise the default key is used.
	 *
	 * @since 1.0.0
	 *
	 * @param string $value Value to encrypt.
	 * @return string|bool Encrypted value, or false on failure.
	 */
	public static function encrypt( $value ) {
		if ( ! extension_loaded( 'openssl' ) ) {
			return $value;
		}

		$method = 'aes-256-ctr';
		$ivlen  = openssl_cipher_iv_length( $method );
		$iv     = openssl_random_pseudo_bytes( $ivlen );

		$raw_value = openssl_encrypt( $value . LOGGED_IN_SALT, $method, LOGGED_IN_KEY, 0, $iv );
		if ( ! $raw_value ) {
			return false;
		}

		return base64_encode( $iv . $raw_value ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
	}

	/**
	 * Decrypts a value.
	 *
	 * If a user-based key is set, that key is used. Otherwise the default key is used.
	 *
	 * @since 1.0.0
	 *
	 * @param string $raw_value Value to decrypt.
	 * @return string|bool Decrypted value, or false on failure.
	 */
	public static function decrypt( $raw_value ) {
		if ( ! extension_loaded( 'openssl' ) ) {
			return $raw_value;
		}

		$raw_value = base64_decode( $raw_value, true ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode

		$method = 'aes-256-ctr';
		$ivlen  = openssl_cipher_iv_length( $method );
		$iv     = substr( $raw_value, 0, $ivlen );

		$raw_value = substr( $raw_value, $ivlen );

		$value = openssl_decrypt( $raw_value, $method, self::get_default_key(), 0, $iv );
		if ( ! $value || substr( $value, - strlen( self::get_default_salt() ) ) !== self::get_default_salt() ) {
			return false;
		}

		return substr( $value, 0, - strlen( LOGGED_IN_SALT ) );
	}

	/**
	 * Returns a decrypted option from the options table.
	 *
	 * @since 1.0.0
	 *
	 * @param string $option Option machine name to decrypt.
	 * @param bool   $default Fallback value.
	 * @return string|bool Decrypted option value, or false on failure.
	 */
	public static function get_option_decrypt( $option, $default = false ) {
		$encrypted = get_option( $option, $default );
		if ( $encrypted === $default ) {
			return $default;
		} else {
			$value = self::decrypt( $encrypted );
			return esc_html( $value );
		}
	}

	/**
	 * Gets the default encryption key to use.
	 *
	 * @since 1.0.0
	 *
	 * @return string Default (not user-based) encryption key.
	 */
	private static function get_default_key() {

		if ( defined( 'LOGGED_IN_KEY' ) && '' !== LOGGED_IN_KEY ) {
			return LOGGED_IN_KEY;
		}

		// If this is reached, you're either not on a live site or have a serious security issue.
		return 'das-ist-kein-geheimer-schluessel';
	}

	/**
	 * Gets the default encryption salt to use.
	 *
	 * @since 1.0.0
	 *
	 * @return string Encryption salt.
	 */
	private static function get_default_salt() {

		if ( defined( 'LOGGED_IN_SALT' ) && '' !== LOGGED_IN_SALT ) {
			return LOGGED_IN_SALT;
		}

		// If this is reached, you're either not on a live site or have a serious security issue.
		return 'das-ist-kein-geheimes-salz';
	}
}
