import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import WalletHelpers from "../helpers/walletHelpers";
import MintHelpers from "../helpers/mintHelpers";
import UiHelpers from "../helpers/uiHelpers";
import WpApiHelpers from "../helpers/wpApiHelpers";

export default class App {
  constructor(el) {
    this.el = el;
    this.init();
  }

  setVars() {
    // Tezos and wallet configuration
    this.rpcUrl = WalletHelpers.getRpcUrl();
    this.tezos = new TezosToolkit(this.rpcUrl);
    this.walletOptions = WalletHelpers.getWalletOptions();
    this.wallet = new BeaconWallet(this.walletOptions);

    // User info
    this.userAddress = "";
    this.balance = undefined;

    // Dom elements
    this.form = this.el.querySelector("#minterpress-app-create-nft");
    this.connectButton = this.el.querySelector(
      "#minterpress-app-connect-to-wallet"
    );
    this.disconnectButton = this.el.querySelector(
      "#minterpress-app-disconnect-wallet"
    );
    this.balanceDisplay = this.el.querySelector("#minterpress-app-tez-balance");
    this.userAddressDisplay = this.el.querySelector(
      "#minterpress-app-tez-user-address"
    );
    this.body = this.el.querySelector("#minterpress-app-body");
    this.overlay = this.el.querySelector("#minterpress-app-overlay");
    this.loading = this.el.querySelector("#minterpress-app-loading");
    this.welcome = this.el.querySelector("#minterpress-app-welcome");
    this.syncNftsButton = this.el.querySelector("#minterpress-app-sync-nfts");
    this.nftsContainer = this.el.querySelector(
      "#minterpress-app-nft-container"
    );
    this.preview = this.el.querySelector("#mint-image-preview");
    this.dialogPreview = this.el.querySelector("#mint-image-dialog-preview");

    // Notices
    this.noTezNotice = this.el.querySelector("#minterpress-app-notice-no-tez");
    this.fetchingNftsNotice = this.el.querySelector(
      "#minterpress-app-notice-fetching-nfts"
    );
    this.walletNotice = this.el.querySelector(
      "#minterpress-app-notice-wallet-request"
    );
    this.pinataNotice = this.el.querySelector(
      "#minterpress-app-notice-nft-mint-pinata"
    );
    this.pinNotice = this.el.querySelector(
      "#minterpress-app-notice-nft-pinning"
    );
    this.successPinNotice = this.el.querySelector(
      "#minterpress-app-notice-nft-success"
    );
    this.confirmingTez = this.el.querySelector(
      "#minterpress-app-notice-confirming-tez"
    );

    // Minting layout
    this.mintingPage = this.el.querySelector("#minterpress-app-minting-page");
    this.noTezPage = this.el.querySelector("#minterpress-app-no-tez-page");
  }

  /**
   * Bind Tezos to the Beacon wallet.
   */
  bindWallet() {
    this.tezos.setWalletProvider(this.wallet);
  }

  /**
   * Connect to active wallet if one exists.
   */
  async connectToActiveWallet() {
    const activeAccount = await WalletHelpers.getActiveAccount(this.wallet);
    this.userAddress = activeAccount?.address;

    this.doPostWalletConnect();
  }

  /**
   * Get balance and update display.
   */
  async updateBalanceDisplay() {
    UiHelpers.show(this.confirmingTez);
    if (this.userAddress && this.tezos) {
      const balance = await WalletHelpers.getBalance(
        this.userAddress,
        this.tezos
      );
      this.balance = balance?.dividedBy(1000000).toFormat(4);
      this.balanceDisplay.innerHTML = this.balance ?? "n/a";
    } else {
      this.balance = undefined;
      this.balanceDisplay.innerHTML = "";
    }

    if (!this.balance || this.balance <= 0) {
      UiHelpers.show(this.noTezNotice);
      UiHelpers.show(this.noTezPage);
    } else {
      UiHelpers.show(this.mintingPage);
    }
    UiHelpers.hide(this.confirmingTez);
  }

  /**
   * Handle mint form submit.
   *
   * @param {*} e
   */
  async handleMint(e) {
    e.preventDefault();
    UiHelpers.turnOnConfirmExit();

    const initialFormData = new FormData(this.form);
    const wpId = await WpApiHelpers.saveNftDraft(initialFormData);

    // Get formData with updated image URL.
    const formData = new FormData(this.form);

    const notices = {
      wallet: this.walletNotice,
      pinata: this.pinataNotice,
      pin: this.pinNotice,
      success: this.successPinNotice,
    };

    const { opHash, imageHash } = await MintHelpers.doMint(
      formData,
      this.userAddress,
      this.tezos,
      notices
    );

    if (opHash && imageHash) {
      const metadata = {
        opHash: opHash,
        imageHash: imageHash,
        creator: this.userAddress,
      };

      await WpApiHelpers.publishWpNft(wpId, metadata);
      this.resetForm();
    } else {
      alert(
        "Something went wrong minting your NFT. Please check the logs or try again later."
      );
    }
    UiHelpers.turnOffConfirmExit();
  }

  resetForm() {
    this.form.reset();
    this.preview.style.backgroundImage = "";
    this.dialogPreview.src = "";
  }

  bindEvents() {
    // Mint form submission
    this.form?.addEventListener("submit", (e) => this.handleMint(e));

    // Manual connect to wallet
    this.connectButton?.addEventListener("click", () =>
      this.connectNewWallet()
    );

    // Manual disconnect from wallet
    this.disconnectButton?.addEventListener("click", (e) =>
      this.disconnectWallet(e)
    );

    // Sync data from blockchain
    this.syncNftsButton?.addEventListener("click", () => {
      this.refreshNfts();
    });
  }

  /**
   * Handle manual connection to wallet.
   */
  async connectNewWallet() {
    this.userAddress = await WalletHelpers.connectToNewWallet(this.wallet);
    const data = {
      action: "update_options",
      options: JSON.stringify({ tz_address: this.userAddress }),
    };
    WpApiHelpers.postToAjax(data);
    this.doPostWalletConnect();
  }

  doPostWalletConnect() {
    const isWalletAttached = !!this.userAddress;
    this.getPageView(isWalletAttached);
    this.updateBalanceDisplay();
  }

  /**
   * Handle manual disconnection to wallet.
   */
  async disconnectWallet(e) {
    e.preventDefault();
    // Disconnect Beacon wallet.
    this.userAddress = await WalletHelpers.disconnectWallet(this.wallet);

    // Reload page
    location.reload();
  }

  /**
   * Display the welcome screen or main body, depending on wallet state.
   *
   * @param {boolean} isWalletAttached true if a wallet is connected, false otherwise.
   */
  getPageView(isWalletAttached) {
    if (isWalletAttached) {
      UiHelpers.hide(this.overlay);
      UiHelpers.show(this.body);
    } else {
      UiHelpers.hide(this.loading);
      UiHelpers.show(this.welcome);
    }
  }

  async refreshNfts() {
    if (!this.tezos || !this.userAddress) {
      console.error(
        "Tezos instance and user address are required to refresh NFTs."
      );
      return;
    }

    UiHelpers.show(this.fetchingNftsNotice);
    UiHelpers.turnOnConfirmExit();

    try {
      const numberOfUserOwnedNftsOnContract =
        await WalletHelpers.getUserOwnedNfts(this.userAddress, this.tezos);

      const data = {
        action: "refresh_nfts",
        number_nfts: numberOfUserOwnedNftsOnContract,
      };

      await WpApiHelpers.postToAjax(data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong, please try again later.");
    }
    UiHelpers.turnOffConfirmExit();
    UiHelpers.hide(this.fetchingNftsNotice);

    // Reload page to retrigger event listeners.
    window.location.href = window.location.href;
  }

  init() {
    this.setVars();
    this.bindWallet();
    this.bindEvents();
    this.connectToActiveWallet();
  }
}
