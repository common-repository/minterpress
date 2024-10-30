<?php

/**
 * Twig menu page entry point.
 *
 * @since      1.0.0
 *
 * @package    Minterpress
 */

namespace Minterpress\Views;

/**
 * Prevent non-admins from accessing these pages
 */
if (!current_user_can('manage_options')) {
	return;
}

use Minterpress\Helper\Constants_Helper;
use Timber\Timber;

/**
 * Twig menu page entry point.
 */
class View_Admin
{
	const ROUTES = array(
		array(
			'title' => 'My NFTs',
			'slug'  => 'my-nfts',
			'type'  => 'navigation',
		),
		array(
			'title' => 'Galleries',
			'slug'  => 'galleries',
			'type'  => 'navigation',
		),
		array(
			'title' => 'Theme',
			'slug'  => 'theme',
			'type'  => 'navigation',
		),
		array(
			'title' => 'Minting',
			'slug'  => 'minting',
			'type'  => 'navigation',
		),
		array(
			'title' => 'Wallet Information',
			'slug'  => 'settings',
			'type'  => 'settings',
		),
		array(
			'title' => 'Log Out',
			'slug'  => 'log-out',
			'type'  => 'action',
		),
	);

	/**
	 * Render menu page.
	 */
	public static function render_menu_page()
	{
		$context     = Timber::context();
		$default_tab = 'my-nfts';
		// phpcs:ignore
		$active_tab = isset($_GET['tab']) ? sanitize_text_field(wp_unslash($_GET['tab'])) : $default_tab;
		$context['active_tab'] = $active_tab;

		$context['routes']     = self::ROUTES;
		$context['notices']    = Constants_Helper::NOTICES;
		$context['strings']    = Constants_Helper::STRINGS;
		$context['image_path'] = plugin_dir_url(__FILE__) . 'views/images';
		$context['tz_address'] = get_option('tz_address');

		switch ($active_tab) {
			case 'my-nfts':
				$context['nft_refreshed_time'] = get_option('nft_refreshed_time');
				// phpcs:ignore
				$query                         = isset($_GET['query']) ? sanitize_text_field(wp_unslash($_GET['query'])) : '';
				// phpcs:ignore
				$status                        = isset($_GET['displayStatus']) ? sanitize_text_field(wp_unslash($_GET['displayStatus'])) : '';
				// phpcs:ignore
				$sort                          = isset($_GET['sort']) ? sanitize_text_field(wp_unslash($_GET['sort'])) : '';

				$context['search_params'] = array(
					'query'  => $query,
					'status' => $status,
					'sort'   => $sort,
				);

				// Get filtered NFTs.
				$meta_query = array(
					array(
						'key'   => 'creator',
						'value' => get_option('tz_address'),
					),
				);
				switch ($status) {
					case 'displayed':
						$meta_query[] = array(
							'key'   => 'public',
							'value' => 'true',
						);
						break;
					case 'unpublished':
						$meta_query[] = array(
							'key'     => 'public',
							'compare' => 'NOT EXISTS',
						);
						break;
					default:
						break;
				}

				$args = array(
					'post_type'      => 'minterpress_nfts',
					'post_status'    => 'publish',
					'posts_per_page' => -1,
					// phpcs:ignore
					'meta_query'     => $meta_query,
					's'              => $query,
				);

				if ('alphabetical' === $sort) {
					$args['orderby'] = 'title';
					$args['order']   = 'ASC';
				}

				$filtered_nfts      = Timber::get_posts($args);
				$context['wp_nfts'] = $filtered_nfts;

				// Get total published NFTs count.
				$publish_args = array(
					'post_type'      => 'minterpress_nfts',
					'posts_per_page' => -1,
					'post_status'    => array('publish'),
					// phpcs:ignore
					'meta_query'     => array(
						array(
							'key'   => 'creator',
							'value' => get_option('tz_address'),
						),
					),
					// Only return the ids since we only need the count.
					'fields'         => 'ids',
					'no_found_rows'  => true,
				);

				$wp_nfts = Timber::get_posts($publish_args);

				// Get total displayed NFTs count.
				$displayed_args = array(
					'post_type'      => 'minterpress_nfts',
					'posts_per_page' => -1,
					'post_status'    => array('publish'),
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
					// Only return the ids since we only need the count.
					'fields'         => 'ids',
					'no_found_rows'  => true,
				);
				$displayed_nfts = Timber::get_posts($displayed_args);

				// NFT Stats.
				$context['nft_stats'] = array(
					'created'     => count($wp_nfts),
					'displayed'   => count($displayed_nfts),
					'on_contract' => get_option('nfts_on_contract'),
				);
				break;
			case 'galleries':
				$galleries = array(
					'post_type'      => 'minterpress_gallery',
					'posts_per_page' => -1,
					'post_status'    => array('publish'),
					// phpcs:ignore
					'meta_query'     => array(
						array(
							'key'   => 'tz_address',
							'value' => get_option('tz_address'),
						),
					),
				);
				$context['galleries'] = Timber::get_posts($galleries);

				// phpcs:ignore
				$context['active_draft_id'] = isset($_GET['id']) ? sanitize_text_field(wp_unslash($_GET['id'])) : '';
				$active_post                = $context['active_draft_id'] ? Timber::get_post($context['active_draft_id']) : array();
				$context['active_draft']    = $active_post;
				break;
			case 'theme':
				// Pass theme variables from options/settings as context.
				$context['mp_theme'] = json_decode(get_option('mp_theme'));
				break;
			case 'minting':
				$context['has_keys'] = strlen(get_option('pinata_api_key')) && strlen(get_option('pinata_api_key'));
				// NFT Drafts.
				$unpublished_args = array(
					'post_type'      => 'minterpress_nfts',
					'posts_per_page' => -1,
					'post_status'    => array('draft'),
				);

				$context['wp_nft_drafts'] = Timber::get_posts($unpublished_args);
				// phpcs:ignore
				$context['active_draft_id'] = isset($_GET['id']) ? sanitize_text_field(wp_unslash($_GET['id'])) : '';
				$active_post                = $context['active_draft_id'] ? Timber::get_post($context['active_draft_id']) : array();

				// If the post is published, don't render edit page.
				if ($active_post && 'draft' !== $active_post->post_status) {
					echo '<p class="tzmp-mt-6 tzmp-text-md">The NFT with WordPress id ' . esc_html($context['active_draft_id']) . ' has been minted. <a class="button-link" href="/wp-admin/admin.php?page=minterpress&tab=minting">Mint a new NFT</a> or <a onclick="history.back()" class="button-link">go back</a>.</p>';
					return;
				}
				$context['active_draft'] = $active_post;
				break;
			default:
				break;
		}

		Timber::$locations = __DIR__ . '/views';
		Timber::render('main.twig', $context);
	}
}
