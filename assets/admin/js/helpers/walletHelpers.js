import { ColorMode, NetworkType } from "@airgap/beacon-sdk";
import { bytes2Char } from "@taquito/utils";
import * as rax from "retry-axios";
import axios from "axios";
import MintHelpers from "./mintHelpers";

export default class WalletHelpers {
  static isTestnet = process.env.env !== 'prod'
  static testNetName = process.env.testNetName || '';

  /**
   *  As of 2022-05-24, if process.env.testNetName is undefined, 
   *  the default fallback will be ITHACANET. This should be updated, along with the @airgap/beacon-sdk version 
   *  when ITHACANET becomes deprecated
   */
  static testNet = this.testNetName ? NetworkType[this.testNetName.toUpperCase()] : NetworkType.JAKARTANET

  /**
   * The network type.
   *
   * 'mainnet' | 'florencenet' | 'granadanet' | 'custom'
   */

  static networkType = this.isTestnet
    ? this.testNet
    : NetworkType.MAINNET;

  static domain = window.location.hostname;

  /**
   * Get wallet options.
   *
   * @returns {object}
   */
  static getWalletOptions() {
    return {
      name: "Minterpress",
      preferredNetwork: this.networkType,
    };
  }

  /**
   * Get RPC Url
   *
   * See https://tezostaquito.io/docs/rpc_nodes/
   * @returns {string}
   */
  static getRpcUrl() {
    return this.isTestnet
      ? process.env.testNetRpcUrl
      : process.env.mainNetRpcUrl;
  }

  /**
   * Set the wallet theme.
   *
   * @param {*} wallet
   */
  static async getTheme(wallet) {
    const theme = localStorage.getItem("theme");
    await wallet.client.setColorMode(
      theme === "dark" ? ColorMode.DARK : ColorMode.LIGHT
    );
  }

  /**
   * The the active wallet if one is connected.
   *
   * @param {*} wallet
   * @returns {object} the active account object returned from Beacon.
   */
  static async getActiveAccount(wallet) {
    const activeAccount = await wallet.client.getActiveAccount(wallet);
    console.log("active account", activeAccount?.address);
    return activeAccount;
  }

  /**
   * Iniatate connection to a wallet.
   *
   * This brings up the modal UI where users can choose their wallet.
   *
   * @param {*} wallet
   * @returns {string} the connected userAddress
   */
  static async connectToNewWallet(wallet) {
    await wallet.requestPermissions({
      network: { type: this.networkType },
    });
    const userAddress = await wallet.getPKH();
    console.log("New connection: ", userAddress);
    return userAddress;
  }

  /**
   * Disconnect wallet.
   *
   * @param {*} wallet
   * @returns undefined if successful.
   */
  static async disconnectWallet(wallet) {
    // TODO: Remove temporary workaround in sandbox. Copied from Beacon docs.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await wallet.clearActiveAccount();
    const activeAccount = await this.getActiveAccount(wallet);
    if (!activeAccount) {
      console.log("Disconnected from wallet.");
    }
    return activeAccount;
  }

  /**
   * Get contract address.
   *
   * @returns {string} the contract address
   * 
   * (Deprecated) Hangzounet Testnet Address: KT1QoGXVbRFjBGPRe5SJCKnfoTA7DMUgrAwj
   */
  static getContractAddress() {
    return this.isTestnet
      ? process.env.testNetContractAddress
      : process.env.mainNetContractAddress;
  }

  /**
   * Get previous contract address.
   *
   * @returns {string} the previous contract address
   * 
   */
  static getPreviousContractAddress() {
    return this.isTestnet
      ? process.env.previousTestNetContractAddress
      : process.env.previousMainNetContractAddress;
  }

  /**
   * Get indexer url.
   *
   * @returns {string} the indexer url
   * 
   */
  static getIndexer() {
    return this.isTestnet
      ? process.env.testNetIndexer
      : process.env.mainNetIndexer;
  }

  /**
   * Get big map id.
   *
   * @returns {number} the token supply big map id
   * 
   */
  static getBigMapId() {
    return this.isTestnet
      ? process.env.testNetBigMapId
      : process.env.mainNetBigMapId;
  }

  /**
   * Get user blance.
   *
   * @param {string} userAddress
   * @param {*} tezos the Tezos Toolkit.
   * @returns
   */
  static async getBalance(userAddress, tezos) {
    try {
      const userBalance = await tezos.tz.getBalance(userAddress);
      return userBalance;
    } catch (err) {
      console.error(err);
      alert(`Error getting wallet balance: ${err}`);
    }
  }

  /**
   * Get user owned NFTs.
   *
   * @param {string} address the user's tz address
   * @param {*} tezos
   * @param {boolean} getMeta flag to return nft metadata
   * @returns {*} Number of nfts on contract, or an array of objects with nft metadata.
   */
  static async getUserOwnedNfts(address, tezos, getMeta = false) {
    // finds user's NFTs

    try {
      const contract = await tezos.wallet.at(this.getContractAddress());
      const previousContract =this.getPreviousContractAddress() ?  await tezos.wallet.at(this.getPreviousContractAddress()) : null
      const nftStorage = await contract.storage();
      const previousStorage = previousContract ? await previousContract.storage() : null

      const { data: tokenObj } = await axios.get(`${WalletHelpers.getIndexer()}tokens/balances?token.contract=${this.getContractAddress()}&account=${address}`)
      const getTokenIds = tokenObj.map(obj => obj.token.tokenId)


      const previousTokenIds = previousContract ? await previousStorage.reverse_ledger.get(address) : null
      const previousTokens = previousTokenIds ? previousTokenIds : []


      if (!getTokenIds) {
        return [];
      }

      if (!getMeta) {
        return getTokenIds.length + previousTokens.length;
      }

      const userOwnedNfts = await Promise.all([
        ...previousTokens?.map(async (id) => {
          const tokenId = parseInt(id);
          const metadata = await previousStorage.token_metadata.get(tokenId);
          const tokenInfoBytes = await metadata.token_info.get("");
          const tokenInfo = bytes2Char(tokenInfoBytes);
          const ipfsHash =
            tokenInfo.slice(0, 7) === "ipfs://" ? tokenInfo.slice(7) : null;
            const formattedMetaData = await this.getNftMetaData(ipfsHash);
            return formattedMetaData;
        }),
        ...getTokenIds.map(async (id) => {
          const tokenId = parseInt(id);
          const metadata = await nftStorage.assets.token_metadata.get(tokenId);
          const tokenInfoBytes = metadata.token_info.get("");
          const tokenInfo = bytes2Char(tokenInfoBytes);
          const ipfsHash =
            tokenInfo.slice(0, 7) === "ipfs://" ? tokenInfo.slice(7) : null;

          const formattedMetaData = await this.getNftMetaData(ipfsHash);

          return formattedMetaData;
        }),
      ]);
      console.dir(userOwnedNfts);
      return userOwnedNfts;
    } catch(err) {
      console.error(err)
    }
    
  }

  /**
   * Get NFT metadata from ipsf hash.
   *
   * @param {string} ipfsHash
   * @returns {object} Object containing NFT metadata.
   */
  static async getNftMetaData(ipfsHash) {
    if (!ipfsHash) {
      return;
    }

    // Default con retry-axios configuration to retry failures.
    // https://www.npmjs.com/package/retry-axios
    rax.attach();

    const response = await axios.get(`${MintHelpers.gateWay}${ipfsHash}`);
    const metaData = response.data;
    if (metaData) {
      metaData.imageSrc = metaData.displayUri.replace(
        "ipfs://",
        MintHelpers.gateWay
      );
      metaData.ipfsHash = ipfsHash;
    }
    return metaData;
  }
}
