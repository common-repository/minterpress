<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @since      1.0.0
 *
 * @package    Minterpress
 * @subpackage Minterpress/admin
 */

use Timber\Timber;
use Timber\Twig_Function;
use Twig\Extension\CoreExtension;
use Minterpress\Data_Encryption;

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Minterpress
 * @subpackage Minterpress/admin
 */
class Minterpress_Admin
{

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $minterpress    The ID of this plugin.
	 */
	private $minterpress;

	/**
	 * The plugin environment.
	 * 
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $minterpress    The plugin environment.
	 */
	private $env;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * The NFT post type machine name.
	 *
	 * @var string nft post type machine name.
	 */
	private $nft_post_type = 'minterpress_nfts';

	/**
	 * The Gallery post type machine name.
	 *
	 * @var string nft post type machine name.
	 */
	private $gallery_post_type = 'minterpress_gallery';

	/**
	 * Meta fields on the nft post type.
	 *
	 *  @var array nft meta fields.
	 */
	private $nft_meta_fields = array(
		'opHash',
		'mintQuantity',
		'creator',
		'imageHash',
		'wpImageUrl',
		'mintDescription',
		'mintTags',
		'mintPublisher',
		'public',
		'mintUrl',
		'order',
	);

	/**
	 * Meta fields on the nft post type.
	 *
	 *  @var array nft meta fields.
	 */
	private $gallery_meta_fields = array(
		'tz_address',
	);

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since      1.0.0
	 * @param      string $minterpress       The name of this plugin.
	 * @param      string $version    The version of this plugin.
	 */
	public function __construct($minterpress, $version)
	{

		$this->minterpress = $minterpress;
		$this->version     = $version;
		$this->env = isset($_ENV['env']) ? $_ENV['env'] : 'production';
	}

	/**
	 * Register the JavaScript & CSS for the admin area.
	 *
	 * @since    1.0.0
	 * @param    string $hook_suffix    Unique suffix provided by WP for admin section.
	 */
	public function minterpress_enqueue_scripts($hook_suffix)
	{
		if ('plugins.php' === $hook_suffix) {
			wp_enqueue_script($this->minterpress, plugin_dir_url(__DIR__) . 'build/deactivate.js', array('jquery'), $this->version, true);
		}

		$is_page_within_minterpress = stripos($hook_suffix, $this->minterpress) > 0;

		if ($is_page_within_minterpress) {
			wp_enqueue_style($this->minterpress, plugin_dir_url(__DIR__) . 'build/admin.css', array(), $this->version, 'all');
			wp_enqueue_script($this->minterpress, plugin_dir_url(__DIR__) . 'build/admin.js', array('jquery'), $this->version, true);

			// Localize the script to authenticate API calls from the admin UI via nonce crediatials.
			wp_localize_script(
				$this->minterpress,
				'wpApiSettings',
				array(
					'root'  => esc_url_raw(rest_url()),
					'nonce' => wp_create_nonce('wp_rest'),
				)
			);

			// Enqueue media.
			wp_enqueue_media();
		}
	}

	/**
	 * Register any associated post types
	 *
	 * @since    1.0.0
	 */
	public function minterpress_register_post_types()
	{

		register_post_type(
			$this->nft_post_type,
			array(
				'labels'       => array(
					'name'          => __('My NFTs'),
					'singular_name' => __('NFT'),
				),
				'public'       => true,
				'show_in_rest' => true,
				// custom-fields support is required to update metadata via API.
				'supports'     => array('title', 'custom-fields'),
				// Interface will show locally only.
				'show_ui'      => 'local' === $this->env,
			)
		);

		register_post_type(
			$this->gallery_post_type,
			array(
				'labels'       => array(
					'name'          => __('NFT Galleries'),
					'singular_name' => __('NFT Gallery'),
				),
				'show_in_rest' => true,
				// custom-fields support is required to update metadata via API.
				'supports'     => array('title', 'custom-fields'),
				// Interface will show locally only.
				'show_ui'      => 'local' === $this->env,
			)
		);

		// Register custom meta fields.
		$meta_args = array(
			'type'           => 'string',
			'single'         => true,
			'show_in_rest'   => true,
			'object_subtype' => $this->nft_post_type,
		);
		foreach ($this->nft_meta_fields as $field_name) {
			register_post_meta($this->nft_post_type, $field_name, $meta_args);
		}

		$meta_args['object_subtype'] = $this->gallery_post_type;
		foreach ($this->gallery_meta_fields as $field_name) {
			register_post_meta($this->gallery_post_type, $field_name, $meta_args);
		}
	}

	/**
	 * Register any associated taxonomies
	 *
	 * @since    1.0.0
	 */
	public function minterpress_register_taxonomies()
	{

		register_taxonomy(
			'minterpress_category',
			array($this->nft_post_type, $this->gallery_post_type),
			array(
				'labels'            => array(
					'name'          => __('NFT Categories'),
					'singular_name' => __('NFT Category'),
				),
				'description'       => 'Categories of NFTs',
				'public'            => true,
				'show_in_rest'      => true,
				'show_ui'           => true,
				'show_admin_column' => true,
			)
		);

		$terms = array(
			'0' => array(
				'name'        => 'Unpublished',
				'slug'        => 'minterpress-unpublished',
				'description' => 'NFTs that should not be displayed in the frontend.',
			),
			'1' => array(
				'name'        => 'Displayed',
				'slug'        => 'minterpress-displayed',
				'description' => 'NFTs that should be displayed in the frontend.',
			),
		);
	}




	/**
	 * Register the menu item.
	 *
	 * @since    1.0.0
	 */
	public function minterpress_setup_menu()
	{
		/**  TODO: update the icon */
		// phpcs:ignore
		$icon = file_get_contents(MINTERPRESS_PLUGIN_DIR . '/assets/img/icon.svg');

		add_menu_page(
			'Minterpress',
			'Minterpress',
			'manage_options',
			'minterpress',
			array(
				'Minterpress\Views\View_Admin',
				'render_menu_page',
			),
			// phpcs:ignore
			'data:image/svg+xml;base64,' . base64_encode($icon),
			99
		);
	}

	/**
	 * Register plugin settings.
	 *
	 * @since    1.0.0
	 */
	public function minterpress_init_settings()
	{
		// Pinata.
		add_option('pinata_api_key');
		add_option('pinata_api_secret');
		
		register_setting('minterpress_pinata', 'pinata_api_key', '\Minterpress\Views\View_Settings::validate_key');
		register_setting('minterpress_pinata', 'pinata_api_secret', '\Minterpress\Views\View_Settings::validate_secret');
		add_settings_section('pinata', '', array('\Minterpress\Views\View_Settings', 'render_section_1_cb'), 'minterpress_pinata');
		add_settings_field('pinata_api_key', 'API key', array('\Minterpress\Views\View_Settings', 'render_field_1_cb'), 'minterpress_pinata', 'pinata');
		add_settings_field('pinata_api_secret', 'API secret', array('\Minterpress\Views\View_Settings', 'render_field_2_cb'), 'minterpress_pinata', 'pinata');

		// NFT data.
		register_setting('minterpress', 'nft_refreshed_time');
		register_setting('minterpress', 'nfts_on_contract');
		register_setting('minterpress', 'tz_address');

		// Theme.
		register_setting('minterpress', 'mp_theme');
	}

	/**
	 * Make functions available in Twig.
	 *
	 * @see https://timber.github.io/docs/guides/functions/
	 *
	 * @since    1.0.0
	 */
	public function minterpress_init_twig()
	{
		add_filter(
			'timber/twig',
			function ($twig) {
				$twig->addFunction(new Twig_Function('get_option_decrypt', '\Minterpress\Data_Encryption::get_option_decrypt'));
				$timezone_string = wp_timezone_string();
				$twig->getExtension(CoreExtension::class)->setTimezone($timezone_string);
				return $twig;
			}
		);
	}

	/**
	 * Add custom endpoints.
	 *
	 * @see https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/
	 *
	 * @since    1.0.0
	 */
	public function minterpress_init_rest_endpoints()
	{
		// Endpoint for super admins to retrive Pinata API keys.
		register_rest_route(
			'minterpress/v1',
			'/pinata',
			array(
				'methods'             => 'GET',
				'callback'            => function () {
					$data = array(
						'api_key'    => Data_Encryption::get_option_decrypt('pinata_api_key'),
						'api_secret' => Data_Encryption::get_option_decrypt('pinata_api_secret'),
					);
					$response = new WP_REST_Response($data, 200);
					$response->set_headers(array('Cache-Control' => 'must-revalidate, no-cache, no-store, private'));

					return $response;
				},
				'permission_callback' => function () {
					return current_user_can('manage_options');
				},
			)
		);

		// Add metadata to minterpress_nfts.
		foreach ($this->nft_meta_fields as $field_name) {
			register_rest_field(
				$this->nft_post_type,
				$field_name,
				array(

					'get_callback'    => function ($object) use ($field_name) {
						$post_id = $object['id'];
						return get_post_meta($post_id, $field_name, true);
					},

					'update_callback' => function ($value, $object, $field_name) {
						return update_post_meta($object->ID, $field_name, $value);
					},
				)
			);
		}

		// Add metadata to minterpress_gallery.
		foreach ($this->gallery_meta_fields as $field_name) {
			register_rest_field(
				$this->gallery_post_type,
				$field_name,
				array(

					'get_callback'    => function ($object) use ($field_name) {
						$post_id = $object['id'];
						return get_post_meta($post_id, $field_name, true);
					},

					'update_callback' => function ($value, $object, $field_name) {
						return update_post_meta($object->ID, $field_name, $value);
					},
				)
			);
		}
	}

	/**
	 * Refresh NFTs and NFT stats based on data from blockchain.
	 */
	public function refresh_nfts()
	{
		// Get number of nfts saved on the blockchain.
		// phpcs:ignore
		$number_nfts = isset($_POST['number_nfts']) ? wp_unslash(
			sanitize_text_field($_POST['number_nfts'])
		) : [];

		// phpcs:ignore
		$timestamp = current_time('timestamp');
		update_option('nft_refreshed_time', $timestamp);

		update_option('nfts_on_contract', $number_nfts);

		wp_die();
	}

	/**
	 * Update WP NFT via AJAX.
	 */
	public function update_nft()
	{
		// phpcs:ignore
		$nft_id = isset($_POST['id']) ? wp_unslash(sanitize_text_field($_POST['id'])) : null;
		// phpcs:ignore
		$meta = isset($_POST['meta']) ? wp_unslash($_POST['meta']) : null;
		// phpcs:ignore
		$category_id = isset($_POST['minterpress_category']) ? wp_unslash(
			sanitize_text_field($_POST['minterpress_category'])
		) : null;

		if (!$nft_id) {
			wp_die();
		}

		// Update meta.
		if ($meta) {
			foreach ($meta as $key => $value) {
				$key = sanitize_text_field($key);
				$value = sanitize_text_field($value);
				
				// Public meta key corresponds to "Displayed" status.
				if ('public' === $key && 'false' === $value) {
					delete_post_meta($nft_id, $key);
				} else {
					update_post_meta($nft_id, $key, $value);
				}
			}
		}

		// Update category.
		if ($category_id) {
			wp_set_post_terms($nft_id, array(intval($category_id)), 'minterpress_category');
		}

		wp_die();
	}

	/**
	 * Delete a post via data posted via AJAX.
	 */
	public function delete_post()
	{
		// phpcs:ignore
		$post_id = isset($_POST['id']) ? wp_unslash(
			sanitize_text_field($_POST['id'])
		) : null;

		if (!$post_id) {
			wp_die();
		}

		wp_delete_post($post_id);

		wp_die();
	}

	/**
	 * Update an option via AJAX.
	 */
	public function update_options()
	{
		// phpcs:ignore
		$stringified_options = isset($_POST['options']) ? wp_unslash(
			sanitize_text_field($_POST['options'])
		) : null;

		if (!$stringified_options) {
			wp_die();
		}

		$options_to_update = json_decode($stringified_options);

		foreach ($options_to_update as $key => $value) {
			update_option($key, $value);
		}

		wp_die();
	}

	/**
	 * Update an option via AJAX.
	 */
	public function update_taxonomy()
	{
		// phpcs:ignore
		$strigified_data = isset($_POST['data']) ? wp_unslash(
			sanitize_text_field($_POST['data'])
		) : null;

		if (!$strigified_data) {
			wp_die();
		}

		$data = json_decode($strigified_data);

		switch ($data->action) {
			case 'create':
				wp_create_term($data->name, $data->taxonomy);
				break;
			case 'delete':
				wp_delete_term($data->id, $data->taxonomy);
				break;
			default:
				break;
		}
		wp_die();
	}

	/**
	 * Register taxonomy terms.
	 *
	 * @since 1.0.0
	 *
	 * @param string $taxonomy taxonomy maching name.
	 * @param array  $terms array of terms with name, description, and slug key/value pairs.
	 */
	private function register_new_terms($taxonomy, $terms)
	{
		foreach ($terms as $term) {
			wp_insert_term(
				$term['name'],
				$taxonomy,
				array(
					'description' => $term['description'],
					'slug'        => $term['slug'],
				)
			);
			unset($term);
		}
	}

	/**
	 * Add custom shortcode.
	 *
	 * @since 1.0.0
	 */
	public function minterpress_add_custom_shortcode()
	{
		add_shortcode('nftgallery', array($this, 'minterpress_shortcode_func'));
	}

	/**
	 * Custom shortcode callback.
	 *
	 * @param array $attributes array of attributes passed in shortcode.
	 *
	 * @since 1.0.0
	 */
	public function minterpress_shortcode_func($attributes)
	{
		// Pass shortcode attributes through to context for futureproofing.
		$context = $attributes ? $attributes : array();

		// Initial query arguments.
		$args = array(
			'post_type'   => 'minterpress_nfts',
			'post_status' => 'publish',
			// phpcs:ignore
			'meta_query'     => array(
				array(
					'key'   => 'creator',
					'value' => get_option('tz_address'),
				),
				array(
					'key'   => 'public',
					'value' => 'true',
				),
			),
			'order'  => 'ASC',
			'orderby'   => 'meta_value_num',
    		'meta_key'  => 'order',
		);

		// Get the gallery id set in the shortcode.
		$gallery_id = $attributes['id'] ?? null;

		// If there's a gallery id, filter the NFTs as directed by that gallery.
		if ($gallery_id) {
			$categories = get_the_terms($gallery_id, 'minterpress_category');

			// If there is a gallery id, but that gallery has no categories, don't display any NFTs.
			if (!$categories) {
				return;
			}

			$category_ids = array_column($categories, 'term_id');

			// phpcs:ignore
			$args['tax_query'] = array(
				array(
					'taxonomy' => 'minterpress_category',
					'terms'    => $category_ids,
				),
			);
		}

		$context['nfts_in_gallery'] = Timber::get_posts($args);

		// Pass theme variables from options/settings as context.
		$context['mp_theme'] = json_decode(get_option('mp_theme'));

		return Timber::fetch(
			'public/main.twig',
			$context
		);
	}

	/**
	 * Admin Notice on Activation.
	 *
	 * @since 0.1.0
	 */
	public function admin_notice_on_activation()
	{

		// Check transient, if available display notice.
		if (get_transient('mp_activation_notice')) {
?>
			<div class="updated notice is-dismissible">
				<p>Thank you for installing Minterpress! <a href="/wp-admin/admin.php?page=minterpress">Connect your wallet to get started</a>.</p>
			</div>
<?php

			// Only display once.
			delete_transient('mp_activation_notice');
		}
	}
}
