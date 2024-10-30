(self.webpackChunkminterpress=self.webpackChunkminterpress||[]).push([[948],{3649:(t,e,s)=>{"use strict";s.d(e,{Z:()=>i});class i{static hiddenClass="hidden";static toggleButtons(t,e,s){t?(e.disabled=!0,s.disabled=!1):(s.disabled=!0,e.disabled=!1)}static show(t){t&&t.classList.remove(this.hiddenClass)}static hide(t){t&&t.classList.add(this.hiddenClass)}static toggleVisibility(t){t.classList.contains(this.hiddenClass)?this.show(t):this.hide(t)}static turnOnConfirmExit(){window.onbeforeunload=()=>!0}static turnOffConfirmExit(){window.onbeforeunload=null}}},8023:(t,e,s)=>{"use strict";s.d(e,{Z:()=>n});var i=s(9669),a=s.n(i);class n{static getCredentials(){return{credentials:"include",headers:{"content-type":"application/json","X-WP-Nonce":wpApiSettings.nonce}}}static getPinataKeyEndpoint(){return`${wpApiSettings.root}minterpress/v1/pinata`}static getNftWpEndpoint(){return`${wpApiSettings.root}${wpApiSettings.versionString}minterpress_nfts`}static getGalleryWpEndpoint(){return`${wpApiSettings.root}${wpApiSettings.versionString}minterpress_gallery`}static async getPinataKeys(){const t=await a().get(this.getPinataKeyEndpoint(),this.getCredentials());return{pinataApiKey:t?.data?.api_key,pinataApiSecret:t?.data?.api_secret}}static async postToAjax(t,e=null){await jQuery.post(ajaxurl,t,(t=>(e&&(e.innerHTML=t),t)))}static prepareMetaData(t,e){return t.meta={},e.map((e=>{t.fieldName&&(t.meta[e]=t[e],delete t[e])})),t}static async saveNftDraft(t,e=null){const s=this.getCredentials(),i=new URLSearchParams(window.location.search),n=e??i.get("id"),r=t.entries(),o=Object.fromEntries(r),c=this.prepareMetaData(o,["mintQuantity","wpImageUrl","mintDescription"]);try{const t=(await a().post(`${this.getNftWpEndpoint()}/${n??""}`,c,s))?.data?.id;return t}catch(t){console.error("Error creating WP draft:",t)}}static async createGallery(t){const e=this.getCredentials(),s=t.entries(),i=Object.fromEntries(s),n=this.prepareMetaData(i,["tz_address"]);try{const t=(await a().post(this.getGalleryWpEndpoint(),n,e))?.data?.id;return await a().post(`${this.getGalleryWpEndpoint()}/${t}`,{status:"publish"},e),console.log(`Published WP Gallery with WP ID ${t}`),t}catch(t){console.error("Error creating WP draft:",t)}}static async updateGallery(t,e){return await a().post(`${this.getGalleryWpEndpoint()}/${t}`,e,this.getCredentials())}static async publishWpNft(t,e){if(console.log(e),!t||!e.opHash)return void console.error("Missing required paramenters.");const s=this.getCredentials();try{const i=await a().post(`${this.getNftWpEndpoint()}/${t}`,{status:"publish",meta:e},s);return console.log(`Published WP NFT with WP ID ${t} and op hash ${e.opHash}`),i}catch(t){console.error("Error publishing wp NFT:",t)}}}},4868:(t,e,s)=>{"use strict";s.r(e),s.d(e,{default:()=>u});var i=s(2050),a=s(2813),n=s(5257),r=s(4118),o=s(3092),c=s(9669),l=s.n(c),h=s(8023),p=s(3649);class d{static gateWay="https://gateway.pinata.cloud/ipfs/";static getPinataProxyEndpoint(){return"https://minterpress-pinata-proxy.herokuapp.com/pin"}static async prepFormData(t,e){const{pinataApiKey:s,pinataApiSecret:i}=await h.Z.getPinataKeys();return t&&s&&i&&e?(t.set("apiKey",s),t.set("apiSecret",i),t.set("creator",e),t.set("remoteFileUrl",t.get("wpImageUrl")),t.set("description",t.get("mintDescription")),t.set("tags",t.get("mintTags")),t.set("publisher",t.get("mintPublisher")),t):(console.error("Missing required parameters."),!1)}static async pinToPinata(t,e){o.ub(),p.Z.show(e.pinata);const s=(await l().post(this.getPinataProxyEndpoint(),t))?.data;return s.status&&s.msg.metadataHash&&s.msg.imageHash?(p.Z.hide(e.pinata),s):(alert(`Pinata error: ${JSON.stringify(s.msg)}`),console.error("Error pinning to Pinata:",s.msg),p.Z.hide(e.pinata),s)}static async saveNftOnBlockchain(t,e,s,a,n){try{p.Z.hide(a.success),p.Z.show(a.wallet);const o=g.getContractAddress(),c=await s.wallet.at(o),{data:h}=await l().get(`${g.getIndexer()}bigmaps/${g.getBigMapId()}`),d=h.totalKeys,u=await s.wallet.batch();u.withContractCall(c.methods.create_token(d,i.TH.fromLiteral({"":(0,r.iF)("ipfs://"+t)}))),u.withContractCall(c.methods.mint_tokens([{owner:e,token_id:d,amount:n}])),console.log("Requesting permission from wallet."),console.log("Hash sent to the blockchain. Processing.");const w=await u.send();p.Z.hide(a.wallet),p.Z.show(a.pin),await w.confirmation(),p.Z.hide(a.pin),p.Z.show(a.success);const m=w.opHash;return console.log("NFT minted on blockchain. Op hash:",m),m}catch(t){return console.error(t),!1}}static async doMint(t,e,s,i){const a=await this.prepFormData(t,e);if(a)try{const t=a.get("mintQuantity")??1,n=await this.pinToPinata(a,i),r=n.msg.imageHash;if(!r)throw new Error("No image hash.");return n.msg.metadataHash?{opHash:await this.saveNftOnBlockchain(n.msg.metadataHash,e,s,i,t),imageHash:r}:(console.error("Nothing to pin on contract."),{opHash:null,imageHash:null})}catch(t){return console.error(t),{opHash:null,imageHash:null}}}}class g{static isTestnet=!1;static testNetName="ghostnet";static testNet=this.testNetName?n.td[this.testNetName.toUpperCase()]:n.td.JAKARTANET;static networkType=this.isTestnet?this.testNet:n.td.MAINNET;static domain=window.location.hostname;static getWalletOptions(){return{name:"Minterpress",preferredNetwork:this.networkType}}static getRpcUrl(){return this.isTestnet?"https://ghostnet.tezos.marigold.dev/":"https://mainnet.api.tez.ie/"}static async getTheme(t){const e=localStorage.getItem("theme");await t.client.setColorMode("dark"===e?n.UX.DARK:n.UX.LIGHT)}static async getActiveAccount(t){const e=await t.client.getActiveAccount(t);return console.log("active account",e?.address),e}static async connectToNewWallet(t){await t.requestPermissions({network:{type:this.networkType}});const e=await t.getPKH();return console.log("New connection: ",e),e}static async disconnectWallet(t){await new Promise((t=>setTimeout(t,1e3))),await t.clearActiveAccount();const e=await this.getActiveAccount(t);return e||console.log("Disconnected from wallet."),e}static getContractAddress(){return this.isTestnet?"KT1JHteGMN67HamHRq45Qegjv5pMXKS4h1D5":"KT1MRY7TB2R2w7R1yEUcx1Wkt8fiUumwyQ8f"}static getPreviousContractAddress(){return this.isTestnet?"":"KT1RR3FpJUt1sfEHabwEHpqjmMBipXnyADSc"}static getIndexer(){return this.isTestnet?"https://api.ghostnet.tzkt.io/v1/":"https://api.tzkt.io/v1/"}static getBigMapId(){return this.isTestnet?"190211":"314939"}static async getBalance(t,e){try{return await e.tz.getBalance(t)}catch(t){console.error(t),alert(`Error getting wallet balance: ${t}`)}}static async getUserOwnedNfts(t,e,s=!1){try{const i=await e.wallet.at(this.getContractAddress()),a=this.getPreviousContractAddress()?await e.wallet.at(this.getPreviousContractAddress()):null,n=await i.storage(),o=a?await a.storage():null,{data:c}=await l().get(`${g.getIndexer()}tokens/balances?token.contract=${this.getContractAddress()}&account=${t}`),h=c.map((t=>t.token.tokenId)),p=(a?await o.reverse_ledger.get(t):null)||[];if(!h)return[];if(!s)return h.length+p.length;const d=await Promise.all([...p?.map((async t=>{const e=parseInt(t),s=await o.token_metadata.get(e),i=await s.token_info.get(""),a=(0,r.l9)(i),n="ipfs://"===a.slice(0,7)?a.slice(7):null;return await this.getNftMetaData(n)})),...h.map((async t=>{const e=parseInt(t),s=(await n.assets.token_metadata.get(e)).token_info.get(""),i=(0,r.l9)(s),a="ipfs://"===i.slice(0,7)?i.slice(7):null;return await this.getNftMetaData(a)}))]);return console.dir(d),d}catch(t){console.error(t)}}static async getNftMetaData(t){if(!t)return;o.ub();const e=(await l().get(`${d.gateWay}${t}`)).data;return e&&(e.imageSrc=e.displayUri.replace("ipfs://",d.gateWay),e.ipfsHash=t),e}}class u{constructor(t){this.el=t,this.init()}setVars(){this.rpcUrl=g.getRpcUrl(),this.tezos=new i.$N(this.rpcUrl),this.walletOptions=g.getWalletOptions(),this.wallet=new a.kx(this.walletOptions),this.userAddress="",this.balance=void 0,this.form=this.el.querySelector("#minterpress-app-create-nft"),this.connectButton=this.el.querySelector("#minterpress-app-connect-to-wallet"),this.disconnectButton=this.el.querySelector("#minterpress-app-disconnect-wallet"),this.balanceDisplay=this.el.querySelector("#minterpress-app-tez-balance"),this.userAddressDisplay=this.el.querySelector("#minterpress-app-tez-user-address"),this.body=this.el.querySelector("#minterpress-app-body"),this.overlay=this.el.querySelector("#minterpress-app-overlay"),this.loading=this.el.querySelector("#minterpress-app-loading"),this.welcome=this.el.querySelector("#minterpress-app-welcome"),this.syncNftsButton=this.el.querySelector("#minterpress-app-sync-nfts"),this.nftsContainer=this.el.querySelector("#minterpress-app-nft-container"),this.preview=this.el.querySelector("#mint-image-preview"),this.dialogPreview=this.el.querySelector("#mint-image-dialog-preview"),this.noTezNotice=this.el.querySelector("#minterpress-app-notice-no-tez"),this.fetchingNftsNotice=this.el.querySelector("#minterpress-app-notice-fetching-nfts"),this.walletNotice=this.el.querySelector("#minterpress-app-notice-wallet-request"),this.pinataNotice=this.el.querySelector("#minterpress-app-notice-nft-mint-pinata"),this.pinNotice=this.el.querySelector("#minterpress-app-notice-nft-pinning"),this.successPinNotice=this.el.querySelector("#minterpress-app-notice-nft-success"),this.confirmingTez=this.el.querySelector("#minterpress-app-notice-confirming-tez"),this.mintingPage=this.el.querySelector("#minterpress-app-minting-page"),this.noTezPage=this.el.querySelector("#minterpress-app-no-tez-page")}bindWallet(){this.tezos.setWalletProvider(this.wallet)}async connectToActiveWallet(){const t=await g.getActiveAccount(this.wallet);this.userAddress=t?.address,this.doPostWalletConnect()}async updateBalanceDisplay(){if(p.Z.show(this.confirmingTez),this.userAddress&&this.tezos){const t=await g.getBalance(this.userAddress,this.tezos);this.balance=t?.dividedBy(1e6).toFormat(4),this.balanceDisplay.innerHTML=this.balance??"n/a"}else this.balance=void 0,this.balanceDisplay.innerHTML="";!this.balance||this.balance<=0?(p.Z.show(this.noTezNotice),p.Z.show(this.noTezPage)):p.Z.show(this.mintingPage),p.Z.hide(this.confirmingTez)}async handleMint(t){t.preventDefault(),p.Z.turnOnConfirmExit();const e=new FormData(this.form),s=await h.Z.saveNftDraft(e),i=new FormData(this.form),a={wallet:this.walletNotice,pinata:this.pinataNotice,pin:this.pinNotice,success:this.successPinNotice},{opHash:n,imageHash:r}=await d.doMint(i,this.userAddress,this.tezos,a);if(n&&r){const t={opHash:n,imageHash:r,creator:this.userAddress};await h.Z.publishWpNft(s,t),this.resetForm()}else alert("Something went wrong minting your NFT. Please check the logs or try again later.");p.Z.turnOffConfirmExit()}resetForm(){this.form.reset(),this.preview.style.backgroundImage="",this.dialogPreview.src=""}bindEvents(){this.form?.addEventListener("submit",(t=>this.handleMint(t))),this.connectButton?.addEventListener("click",(()=>this.connectNewWallet())),this.disconnectButton?.addEventListener("click",(t=>this.disconnectWallet(t))),this.syncNftsButton?.addEventListener("click",(()=>{this.refreshNfts()}))}async connectNewWallet(){this.userAddress=await g.connectToNewWallet(this.wallet);const t={action:"update_options",options:JSON.stringify({tz_address:this.userAddress})};h.Z.postToAjax(t),this.doPostWalletConnect()}doPostWalletConnect(){const t=!!this.userAddress;this.getPageView(t),this.updateBalanceDisplay()}async disconnectWallet(t){t.preventDefault(),this.userAddress=await g.disconnectWallet(this.wallet),location.reload()}getPageView(t){t?(p.Z.hide(this.overlay),p.Z.show(this.body)):(p.Z.hide(this.loading),p.Z.show(this.welcome))}async refreshNfts(){if(this.tezos&&this.userAddress){p.Z.show(this.fetchingNftsNotice),p.Z.turnOnConfirmExit();try{const t={action:"refresh_nfts",number_nfts:await g.getUserOwnedNfts(this.userAddress,this.tezos)};await h.Z.postToAjax(t)}catch(t){console.error(t),alert("Something went wrong, please try again later.")}p.Z.turnOffConfirmExit(),p.Z.hide(this.fetchingNftsNotice),window.location.href=window.location.href}else console.error("Tezos instance and user address are required to refresh NFTs.")}init(){this.setVars(),this.bindWallet(),this.bindEvents(),this.connectToActiveWallet()}}},5883:()=>{},950:()=>{},6601:()=>{},9214:()=>{},8623:()=>{},7748:()=>{},5568:()=>{},5992:()=>{},6619:()=>{},7108:()=>{},2361:()=>{},4616:()=>{}}]);