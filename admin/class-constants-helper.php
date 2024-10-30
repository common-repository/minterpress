<?php
/**
 * Class Minterpress\Helper\Constants_Helper
 *
 * @since      1.0.0
 *
 * @package    Minterpress
 * @subpackage Minterpress\Helper
 */

namespace Minterpress\Helper;

/**
 * Class responsible for plugin UI constants.
 */
class Constants_Helper {

	const STRINGS = array(
		// ********* Welcome *********.
		'welcome_image_src'                     => 'https://tezos.com/brand/TeamTezosPark.png',
		'welcome_headline'                      => 'Welcome to Minterpress',
		'welcome_text_1'                        => 'Easily mint and display your NFTs through Wordpress with just a few clicks. Minterpress is a new kind of NFT tool for creators. With it, you can mint and host eco-friendly NFTs on your own WordPress site.',
		'welcome_text_2'                        => 'With Minterpress, you control how your audience interacts with your work. You can share it from your WordPress page, take it to an NFT marketplace, or simply exhibit your collections on your site. ',
		'welcome_text_3'                        => 'To start minting you’ll need:',
		'welcome_text_4'                        => '<ol class="tzmp-list-decimal tzmp-ml-8">
														<li><strong>A funded Tezos wallet:</strong> You’ll be prompted to set up a wallet in the next step. </li>
														<li><strong>An API key:</strong> Through Pinata, you’ll be prompted to set up a key. Simply put, this is an added layer of security. </li>
														<li><strong>Your digital assets:</strong> Your original creations! Join the Web3 art community sharing their work on Tezos.</li>
													</ol>',
		'welcome_connect_wallet_text'           => 'Connect a Tezos wallet',
		'welcome_faq_link'                      => 'https://wordpress.org/plugins/minterpress/',
		'welcome_faq_text'                      => 'FAQs',

		// ********* Onboaring *********.
		'onboarding_step_1_header'              => 'Minting Setup - Step 1 of 2',
		'onboarding_step_1_subheader'           => 'In order to mint with this plugin, you’ll need a Pinata account and the API keys for that account',
		'onboarding_step_1_precolumns'          => 'Pinata is a service that allows users to host and store files online. Pinata offers this service for free for up to 1 GB of storage. However, if your files exceed 1 GB in storage Pinata will ask you to add a credit card to your account. At the moment, you need a Pinata account to be able to mint NFTs with this plugin.',
		'onboarding_step_2_header'              => 'Minting Setup - Step 2 of 2',
		'onboarding_step_2_subheader'           => 'Getting started with the minting process',
		'onboarding_step_2_precolumns'          => 'This is where you will mint your own NFTs, but just like creating a product in the physical world, making a digital NFT has a cost as well. You already have a wallet set up. Let’s get some tez added to that wallet so you can get started minting! In order to Add tez to your wallet, you need to purchase tez. In order to purchase tez, you need a an account with a cryptocurrency exchange platform. The steps below explains how to get started.',
		// The following string is has the raw twig filter to facilitate an ordered list.
		'onboarding_step_2_precolumns_raw'      => '<ol class="tzmp-list-decimal tzmp-ml-8">
														<li>In order to purchase tez, you will need an account on a cryptocurrency exchange that sells tez.</li>
														<li>Once you’ve created an account on that exchange, you will be asked to deposit funds to your account in order to purchase tez. Depending on the exchange, you can buy tez using fiat currency, or various other cryptocurrencies.</li>
														<li>Once the purchase is complete and your account shows that you own tez, you will need to transfer that tez to the wallet that you’ve chosen to use for Minterpress.</li>
														<li>Withdrawing the tez from the exchange will require you to paste your Minterpress wallet address so the exchange knows where to send the tez. It is extremely important that you ensure that the wallet address you are sending the tez to is the exact same address as the wallet you’re using for Minterpess. You can find your Minterpress wallet address in the plugin navigation or on the <a href="/wp-admin/admin.php?page=minterpress&tab=settings" target="_blank" class="button-link">settings page</a>.</li>
													  </ol>',
		'onboarding_step_2_postcolumns_header'  => 'What to do next?',
		'onboarding_step_2_postcolumns_content' => 'Once your wallet  has enough tez to get started, this screen will refresh and allow you to start minting.',

		// ********* My NFTs *********.
		'mynft_intro'                   		=> 'This page shows the NFTs you’ve minted. In addition to exhibiting them on your WordPress site, list your NFTs for sale on Tezos marketplaces such as:',
		'mynft_intro_list'                   	=> '<ol class="tzmp-list-disc tzmp-ml-8">
														<li><a class="tzmp-underline" href="https://objkt.com/" target="_blank">OBJKT</a></li>
														<li><a class="tzmp-underline" href="https://www.fxhash.xyz/" target="_blank">fxhash</a></li>
														<li><a class="tzmp-underline" href="https://teia.art/" target="_blank">teia</a></li>
														<li><a class="tzmp-underline" href="https://www.8bidou.com/" target="_blank">8bidou</a></li>
													</ol>',
		'refresh_button_text'                   => 'Refresh NFT collection',
		'refresh_text'                          => 'Not seeing an NFT? Refresh your collection occasionally to make sure it’s up to date.',

		// ********* Gallery *********.
		'gallery_list_header'                   => 'Categorize your NFTs',
		'gallery_list_intro'                    => "Categorize your NFTs into galleries to display on your WordPress page. Copy and paste the shortcodes into the page builder in order to display your collections.",
		'gallery_edit_intro'                    => 'Each NFT in your collection can be associated to a category. What category should this gallery show to your customers?',

		// ********* Theme *********.
		'theme_header'                          => 'Choose the look that matches your website',
		'theme_intro'                           => 'Your NFTs will display in a grid format. Using the example image on the left, adjust the settings below to customize how the NFTs in your gallery will appear.',
		'theme_note'                         	=> 'Please note, this only affects how NFTs are displayed in your gallery and not the artwork being minted. The corner rounding, title display, line weight, etc, will not affect the on-chain appearance of the NFT that you mint. ',

		// ********* Mint *********.
		// The following string is passed through the raw twig filter.
		'create_intro'                			=> 'Note: the information entered in the below fields will be permanently linked to this NFT and cannot be modified once minting is complete.',
		'create_file_helper_raw'                => 'Supported formats: .gif, .jpeg, .mp4, .mp3, .pdf, .png, .svg*, .wav',
		'create_file_helper_raw_2'              => '*.svgs require an additional plugin that supports uploading .svg files to your WordPress page',
		'create_title'                			=> '(the title of your work)',
		'create_description'                	=> '(a description of your work, such as an artist statement, date of creation, and/or an edition number)',
		'create_tags'                           => '(tags allow collectors to search for your work in an NFT marketplace; they should be brief, descriptive words associated with your NFT)',
		'create_quantity'                       => '(set the quantity you wish to mint between 1-10,000)',
		'create_text'                           => "What quantity should you set? Unique or single edition NFTs tend to be more sought after, however, some creators mint editions of hundreds or thousands. What is best for you depends on your needs and how accessible you wish to have your NFTs. Once you've decided how many to mint, click Mint to create your NFT(s).",
		'create_dialog_note_1'                  => 'In order to complete the minting process, your wallet will also require you to confirm authorization. This is usually seen via a pop-up from your wallet’s browser page, but may also open a new page. ',
		'create_dialog_note_2'                  => 'The information entered in the above fields will be permanently linked to this NFT and cannot be modified once minting is complete.',
		'create_publisher'                      => '(we recommend leaving this as is)',

		// ********* Settings *********.
		'settings_pinata_instructions'          => '',
		'settings_sign_out_confirm'             => 'You can sign back in at any time to manage your NFTs and Galleries and mint new NFTs.',
		'setting_text_1'          				=> 'Having a funded wallet is necessary to mint NFTs on the Tezos  blockchain. Minting costs are funded by a fractional amount of Tezos tokens (tez). This is considered a “gas fee”. On Tezos this is a minimal amount, usually costing cents instead of dollars like some other blockchains. Looking to learn how to get tez, the cryptocurrency of Tezos? Visit <a class="tzmp-underline" href="https://tezos.com/tez/" target="_blank">tezos.com/tez/</a> ',
		'setting_text_2'          				=> 'Creating an API key using Pinata is a necessary step that will help Minterpress identify you as the sole owner and user of this plugin. Pinata is a closed server and will not share or distribute any information about you. ',
		'setting_text_3'          				=> 'Here’s how to get your key: ',
		'setting_text_4'                        => '<ol class="tzmp-list-decimal tzmp-ml-8">
														<li>Go to <a class="tzmp-underline" href="https://pinata.cloud/" target="_blank">https://pinata.cloud/</a></li>
														<li>Create a free account to make an API key. 
														Note: Pinata is free for the first 100 files or 1GB of data uploaded. Additional data storage may be purchased via the Pinata <a class="tzmp-underline" href="https://www.pinata.cloud/pricing" target="_blank">pricing page</a>. </li>
														<li>Return to this page and enter your API key and API secret below. This completes the plugin setup.</li>
													</ol>',
	);

	// ********* Notices *********.
	const NOTICES = array(
		'no-tez'          => 'You must add Tez to your wallet in order to mint NFTs.',
		'fetching-nfts'   => 'Fetching your NFTs from the blockchain. Please do not navigate away from this tab. Page will reload when done.',
		'wallet-request'  => 'Requesting approval from your wallet',
		'nft-mint-pinata' => 'Pinning your NFT and metadata in Pinata.',
		'nft-pinning'     => 'Minting your NFT on the blockchain. This could take several minutes...',
		'nft-success'     => 'Success! Your NFT has been minted. Click to refresh on your My NFT tab to see your new NFT.',
		'nft-theme'       => 'Your theme settings have been updated.',
		'saved'           => 'Saved.',
		'confirming-tez'  => 'Fetching your wallet balance...',
	);

}
