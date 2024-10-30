/**
 * Deactivation confirmation JS.
 *
 * @package    Minterpress
 */

window.onload = function () {
    const pluginName = "minterpress";
    const deactivateLink = document.querySelector(
      `[data-slug="${pluginName}"] .deactivate a`
    );
    const redirectUrl = deactivateLink.getAttribute("href");

    deactivateLink.addEventListener("click", function (event) {
      event.preventDefault();
      if (
        confirm(
          "Are you sure you want to deactivate Minterpress? This will remove all NFTs and Galleries from your Wordpress site until you reactivate the plugin. The NFTs will still be saved on the Blockchain."
        )
      ) {
        window.location.href = redirectUrl;
      } else {
        console.log("Deactivation canceled.");
      }
    });
};
