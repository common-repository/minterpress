<?php
/**
 * The public-facing functionality of the plugin.
 *
 * @since      1.0.0
 *
 * @package    Minterpress
 * @subpackage Minterpress/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Minterpress
 * @subpackage Minterpress/public
 */
class Minterpress_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $minterpress    The ID of this plugin.
	 */
	private $minterpress;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $minterpress       The name of the plugin.
	 * @param      string $version    The version of this plugin.
	 */
	public function __construct( $minterpress, $version ) {

		$this->minterpress = $minterpress;
		$this->version     = $version;

	}

	/**
	 * Register the JavaScript & CSS for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function minterpress_enqueue_scripts() {

		wp_enqueue_style( $this->minterpress, plugin_dir_url( __DIR__ ) . 'build/public.css', array(), $this->version, 'all' );
		wp_enqueue_script( $this->minterpress, plugin_dir_url( __DIR__ ) . 'build/public.js', array( 'jquery' ), $this->version, false );

	}

}
