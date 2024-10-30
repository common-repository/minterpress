<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @since   1.0.0
 * @package Minterpress
 *
 * @wordpress-plugin
 * Plugin Name:       Minterpress
 * Description:       Easily mint and display Tezos NFTs on WordPress
 * Version:           1.0.5
 * Author:            Blokhaus
 * Author URI:        https://blokhaus.io/
 * Plugin URI:        https://wordpress.org/plugins/minterpress
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       minterpress
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
	die;
}

/**
 * Require the composer autoloader.
 */
$composer_autoload = __DIR__ . '/vendor/autoload.php';
if (file_exists($composer_autoload)) {
	require_once $composer_autoload;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define('MINTERPRESS_VERSION', '1.0.5');
define('MINTERPRESS_PLUGIN_DIR', __DIR__);
define('MINTERPRESS_PLUGIN_FILE', __FILE__);

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-minterpress-activator.php
 */
function activate_minterpress()
{
	require_once plugin_dir_path(__FILE__) . 'includes/class-minterpress-activator.php';
	Minterpress_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-minterpress-deactivator.php
 */
function deactivate_minterpress()
{
	require_once plugin_dir_path(__FILE__) . 'includes/class-minterpress-deactivator.php';
	Minterpress_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'activate_minterpress');
register_deactivation_hook(__FILE__, 'deactivate_minterpress');

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path(__FILE__) . 'includes/class-minterpress.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_minterpress()
{

	$plugin = new Minterpress();
	$plugin->run();
}
run_minterpress();
