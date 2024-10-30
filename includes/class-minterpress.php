<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @since      1.0.0
 *
 * @package    Minterpress
 * @subpackage Minterpress/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Minterpress
 * @subpackage Minterpress/includes
 */
class Minterpress {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Minterpress_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $minterpress    The string used to uniquely identify this plugin.
	 */
	protected $minterpress;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'MINTERPRESS_VERSION' ) ) {
			$this->version = MINTERPRESS_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->minterpress = 'minterpress';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Minterpress_Loader. Orchestrates the hooks of the plugin.
	 * - Minterpress_I18n. Defines internationalization functionality.
	 * - Minterpress_Admin. Defines all hooks for the admin area.
	 * - Minterpress_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-minterpress-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-minterpress-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-minterpress-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-minterpress-public.php';

		$this->loader = new Minterpress_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Minterpress_I18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Minterpress_I18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Minterpress_Admin( $this->get_minterpress(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'minterpress_enqueue_scripts' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'minterpress_setup_menu' );
		$this->loader->add_action( 'init', $plugin_admin, 'minterpress_register_post_types' );
		$this->loader->add_action( 'init', $plugin_admin, 'minterpress_register_taxonomies' );
		$this->loader->add_action( 'init', $plugin_admin, 'minterpress_add_custom_shortcode' );
		$this->loader->add_action( 'admin_init', $plugin_admin, 'minterpress_init_settings' );
		$this->loader->add_action( 'admin_init', $plugin_admin, 'minterpress_init_twig' );
		$this->loader->add_action( 'rest_api_init', $plugin_admin, 'minterpress_init_rest_endpoints' );

		// AJAX.
		$this->loader->add_action( 'wp_ajax_refresh_nfts', $plugin_admin, 'refresh_nfts' );
		$this->loader->add_action( 'wp_ajax_update_nft', $plugin_admin, 'update_nft' );
		$this->loader->add_action( 'wp_ajax_delete_post', $plugin_admin, 'delete_post' );
		$this->loader->add_action( 'wp_ajax_update_options', $plugin_admin, 'update_options' );
		$this->loader->add_action( 'wp_ajax_update_taxonomy', $plugin_admin, 'update_taxonomy' );

		// Activation notice.
		$this->loader->add_action( 'admin_notices', $plugin_admin, 'admin_notice_on_activation' );
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Minterpress_Public( $this->get_minterpress(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'minterpress_enqueue_scripts' );
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_minterpress() {
		return $this->minterpress;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Minterpress_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
