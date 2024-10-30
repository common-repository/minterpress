import axios from "axios";

export default class WpApiHelpers {
  /**
   * Get WP nonce for authentication with the WP Rest API.
   *
   * @returns {object} the credentials.
   */
  static getCredentials() {
    return {
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "X-WP-Nonce": wpApiSettings.nonce,
      },
    };
  }

  /**
   * Get the custom Pinata WP API endpoint.
   *
   * @returns {string} the REST API endpoint
   */
  static getPinataKeyEndpoint() {
    return `${wpApiSettings.root}minterpress/v1/pinata`;
  }

  /**
   * Get the minterpress_nfts rest api endpoint.
   *
   * @returns {string} the REST API endpoint
   */
  static getNftWpEndpoint() {
    return `${wpApiSettings.root}${wpApiSettings.versionString}minterpress_nfts`;
  }

  /**
   * Get the minterpress_gallery rest api endpoint.
   *
   * @returns {string} the REST API endpoint
   */
  static getGalleryWpEndpoint() {
    return `${wpApiSettings.root}${wpApiSettings.versionString}minterpress_gallery`;
  }

  /**
   * Get Pianta keys.
   *
   * @returns {object} with keys pinataApiKey and pinataApiSecret
   */
  static async getPinataKeys() {
    const response = await axios.get(
      this.getPinataKeyEndpoint(),
      this.getCredentials()
    );
    return {
      pinataApiKey: response?.data?.api_key,
      pinataApiSecret: response?.data?.api_secret,
    };
  }

  /**
   * Post to ajax.
   *
   * @param {*} data the data to post to ajax.
   * @param {*} container the dom element container to inject response, or null
   */
  static async postToAjax(data, container = null) {
    // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
    await jQuery.post(ajaxurl, data, (response) => {
      if (container) {
        // Inject the html.
        container.innerHTML = response;
      }
      return response;
    });
  }

  /**
   * Prepare metadata.
   *
   * @param {object} json The formData converted to JSON
   * @param {array} metaFields Fields which must be passed within the meta object
   * @returns {object} an object with meta field under the meta key.
   */
  static prepareMetaData(json, metaFields) {
    json.meta = {};
    metaFields.map((fieldName) => {
      if (json.fieldName) {
        json.meta[fieldName] = json[fieldName];
        delete json[fieldName];
      }
    });
    return json;
  }

  /**
   * Use WP-JSON to create a new post draft.
   *
   *
   * @param {*} formData the user entered FormData.
   */
  static async saveNftDraft(formData, wpId = null) {
    const credentials = this.getCredentials();
    const urlParams = new URLSearchParams(window.location.search);
    const draftId = wpId ?? urlParams.get("id");

    const entries = formData.entries();
    const jsonData = Object.fromEntries(entries);

    const jsonWithPreparedMeta = this.prepareMetaData(jsonData, [
      "mintQuantity",
      "wpImageUrl",
      "mintDescription",
    ]);

    try {
      const wpDraft = await axios.post(
        `${this.getNftWpEndpoint()}/${draftId ?? ""}`,
        jsonWithPreparedMeta,
        credentials
      );
      const newWpId = wpDraft?.data?.id;

      return newWpId;
    } catch (err) {
      console.error("Error creating WP draft:", err);
    }
  }

  /**
   * Use WP-JSON to create a new post draft.
   *
   *
   * @param {*} formData the user entered FormData.
   */
  static async createGallery(formData) {
    const credentials = this.getCredentials();

    const entries = formData.entries();
    const jsonData = Object.fromEntries(entries);

    const jsonWithPreparedMeta = this.prepareMetaData(jsonData, ["tz_address"]);

    try {
      const wpDraft = await axios.post(
        this.getGalleryWpEndpoint(),
        jsonWithPreparedMeta,
        credentials
      );
      const newWpId = wpDraft?.data?.id;
      await axios.post(
        `${this.getGalleryWpEndpoint()}/${newWpId}`,
        {
          status: "publish",
        },
        credentials
      );
      console.log(`Published WP Gallery with WP ID ${newWpId}`);

      return newWpId;
    } catch (err) {
      console.error("Error creating WP draft:", err);
    }
  }

  /**
   * Use WP-JSON to create a new post draft.
   *
   *
   * @param {*} formData the user entered FormData.
   */
  static async updateGallery(id, data) {
    const response = await axios.post(
      `${this.getGalleryWpEndpoint()}/${id}`,
      data,
      this.getCredentials()
    );
    return response;
  }

  static async publishWpNft(wpId, metadata) {
    console.log(metadata);
    if (!wpId || !metadata.opHash) {
      console.error("Missing required paramenters.");
      return;
    }
    const credentials = this.getCredentials();
    try {
      const response = await axios.post(
        `${this.getNftWpEndpoint()}/${wpId}`,
        {
          status: "publish",
          meta: metadata,
        },
        credentials
      );
      console.log(
        `Published WP NFT with WP ID ${wpId} and op hash ${metadata.opHash}`
      );
      return response;
    } catch (err) {
      console.error("Error publishing wp NFT:", err);
    }
  }
}
