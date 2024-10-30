import * as rax from "retry-axios";
import axios from "axios";
import WpApiHelpers from "./wpApiHelpers";
import WalletHelpers from "./walletHelpers";
import UiHelpers from "./uiHelpers";
import { char2Bytes } from "@taquito/utils";
import { MichelsonMap } from '@taquito/taquito'

export default class MintHelpers {
  /**
   * The IPFS gateway.
   */
  static gateWay = process.env.pinataGatewayUrl;

  /**
   * Get the pinata proxy url.
   *
   * @returns {string} the proxy URL
   */
  static getPinataProxyEndpoint() {

    // Local files will not be available to the live minterpress service,
    // so you must spin up the service locally. https://github.com/savaslabs/minterpress-pinata-proxy
    return process.env.env === "local"
      ? process.env.localProxyPinUrl
      : process.env.productionProxyPinUrl;
  }

  /**
   * Prepare form data for submission.
   *
   * @param {FormData} formData the form data from the create nft form.
   * @param {string} userAddress the tezos user address
   * @returns
   */
  static async prepFormData(formData, userAddress) {
    // Get API keys.
    const { pinataApiKey, pinataApiSecret } =
      await WpApiHelpers.getPinataKeys();

    if (formData && pinataApiKey && pinataApiSecret && userAddress) {
      formData.set("apiKey", pinataApiKey);
      formData.set("apiSecret", pinataApiSecret);
      formData.set("creator", userAddress);
    } else {
      console.error("Missing required parameters.");
      return false;
    }

    formData.set("remoteFileUrl", formData.get("wpImageUrl"));
    formData.set("description", formData.get("mintDescription"));
    formData.set("tags", formData.get("mintTags"));
    formData.set("publisher", formData.get("mintPublisher"));

    return formData;
  }

  /**
   * Pin form data to Pinata.
   *
   * @param {FormData} formData the prepared form data.
   * @param {object} notices an object containing notice dom elements.
   * @returns {object}
   */
  static async pinToPinata(formData, notices) {
    // Default retry-axios configuration to retry failures.
    // https://www.npmjs.com/package/retry-axios
    rax.attach();

    UiHelpers.show(notices.pinata);
    const response = await axios.post(this.getPinataProxyEndpoint(), formData);

    const data = response?.data;

    if (!data.status || !data.msg.metadataHash || !data.msg.imageHash) {
      alert(`Pinata error: ${JSON.stringify(data.msg)}`);
      console.error("Error pinning to Pinata:", data.msg);
      UiHelpers.hide(notices.pinata);
      return data;
    }
    UiHelpers.hide(notices.pinata);
    return data;
  }

  /**
   * Save the metahash to the blockchain.
   *
   * @param {string} metadataHash metadata hash 
   * @param {string} userAddress the user's tezos address.
   * @param {*} tezos the tezos toolkit instance.
   * @param {object} notices an object containing notice dom elements.
   * @param {number} quantity number of NFTs to mint
   * @returns {string | boolean} the opHash if successful, false otherwise.
   */
  static async saveNftOnBlockchain(metadataHash, userAddress, tezos, notices, quantity) {
    try {
      // Hide the success message in case this is not the first copy being minted.
      UiHelpers.hide(notices.success);

      // Connect to wallet.
      UiHelpers.show(notices.wallet);
      const contractAddress = WalletHelpers.getContractAddress();

      const contract = await tezos.wallet.at(contractAddress);
      const { data: supply } = await axios.get(`${WalletHelpers.getIndexer()}bigmaps/${WalletHelpers.getBigMapId()}`)
      /* get current token id from token_total_supply bigmap*/
      const currentTokenId = supply.totalKeys

      const batch = await tezos.wallet.batch();

      /* Create Token */
        batch.withContractCall(
          contract.methods.create_token(
            currentTokenId,
            MichelsonMap.fromLiteral({
              "": char2Bytes("ipfs://" + metadataHash)
            })
          )
        )

        /* Mint Token */
        batch.withContractCall(
          contract.methods.mint_tokens([
            {
              owner: userAddress,
              token_id: currentTokenId,
              amount: quantity
            }
          ])
        )

      console.log("Requesting permission from wallet.");

      console.log("Hash sent to the blockchain. Processing.");
      const batchOp = await batch.send();

      UiHelpers.hide(notices.wallet);
      // Initiate processing on blockchain.
      UiHelpers.show(notices.pin);
      await batchOp.confirmation();
      UiHelpers.hide(notices.pin);

      // Success.
      UiHelpers.show(notices.success);
      const opHash = batchOp.opHash;
      console.log("NFT minted on blockchain. Op hash:", opHash);
      return opHash;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  /**
   * Mint and pin an NFT.
   *
   * @param {FormData} formData with keys mintTitle {string}, mintDescription {string}, mintImage {file}, mintQuantity {int} at minimum.
   * @param {string} userAddress the user's public tez address
   * @param {*} tezos the taquio Tezos Toolkit object
   * @returns {[] | null}
   */
  static async doMint(userFormData, userAddress, tezos, notices) {
    // Prep formData.
    const formData = await this.prepFormData(userFormData, userAddress);

    if (!formData) {
      return;
    }

      try {

        const quantity = formData.get("mintQuantity") ?? 1;
        const pinnedResponse = await this.pinToPinata(formData, notices);
        const imageHash = pinnedResponse.msg.imageHash;
        if (!imageHash) {
          throw new Error('No image hash.')
        }

        if (pinnedResponse.msg.metadataHash) {
          // Save NFT on blockchain.
          const opHash = await this.saveNftOnBlockchain(
            pinnedResponse.msg.metadataHash,
            userAddress,
            tezos,
            notices,
            quantity
          );
          return { opHash: opHash, imageHash: imageHash };
        } else {
          console.error("Nothing to pin on contract.");
          return { opHash: null, imageHash: null };
        }
    } catch (err) {
      console.error(err);
      return { opHash: null, imageHash: null };
    }
  }
}
