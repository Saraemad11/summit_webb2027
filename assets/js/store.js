/* =====================================================================
   Store — keeps form submissions (registrations, projects).
   Prototype: kept in this browser only until the forms are connected
   to the organizers' email or a database.
   ===================================================================== */
(function () {
  function read(k) { try { return JSON.parse(localStorage.getItem('das27.' + k) || '[]'); } catch (e) { return []; } }
  function write(k, v) { try { localStorage.setItem('das27.' + k, JSON.stringify(v)); } catch (e) { } }
  window.Store = {
    add: function (kind, data) { var l = read(kind); data.at = new Date().toISOString(); l.push(data); write(kind, l); return data; },
    list: function (kind) { return read(kind); },
    // the summit map draws every category linked to every other; no organization data is kept here
    catLinks: function () { return {}; }
  };
})();
