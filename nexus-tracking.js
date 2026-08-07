/**
 * NEXUS Transport — client tracker
 * 1. Paste your Apps Script /exec URL into ENDPOINT below.
 * 2. Save this file in your project root.
 * 3. Add to index.html, just before </body>:
 *      <script defer src="/_vercel/insights/script.js"></script>
 *      <script src="/nexus-tracking.js"></script>
 * 4. Call nxTrack(...) wherever something meaningful happens.
 */

(function () {
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzm6v62j6UzG8M9b8Ub_RmBTxm7EE4IMaTz6FwkUKt5S-159hJVIXma3gNom-IA5B8/exec';

  // Stable anonymous id so repeat users are visible, not just repeat visits.
  function visitorId() {
    try {
      var id = localStorage.getItem('nx_id');
      if (!id) {
        id = 'nx_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        localStorage.setItem('nx_id', id);
      }
      return id;
    } catch (e) {
      return 'nx_anon';
    }
  }

  function send(payload) {
    if (!ENDPOINT || ENDPOINT.indexOf('PASTE_') === 0) return;
    try {
      fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        // text/plain avoids a CORS preflight that Apps Script cannot answer
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        keepalive: true
      });
    } catch (e) {
      // never let tracking break the page
    }
  }

  /**
   * nxTrack('rate_calculated', { tonnage: 25, km: 480, rate: 42500 })
   * nxTrack('phone_captured', { phone: '98xxxxxxxx' })
   * nxTrack('eway_extended', { details: { hoursLeft: 3 } })
   */
  window.nxTrack = function (event, data) {
    data = data || {};
    send({
      id: visitorId(),
      event: event,
      phone: data.phone || '',
      tonnage: data.tonnage || '',
      km: data.km || '',
      rate: data.rate || '',
      details: data.details || null,
      ua: navigator.userAgent
    });
  };

  // Fires once per page load so you can separate openers from users.
  window.nxTrack('page_open', {});
})();
