// ==UserScript==
// @name         Deletable
// @namespace    http://tampermonkey.net/
// @version      2024-10-07
// @description  Lets you delete any elements or add them back after deletion on any page
// @author       You
// @match        *://*/*
// @icon         *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("running deletable");

    let deletionBuffer = [];
    let deletionSiblingParentBuffer = [];

    const pressed = {
      d: false,
      e: false
    };

    window.addEventListener("keydown", (e) => {
      if (e.key === "d") pressed.d = true;
      if (e.key === "e") pressed.e = true;
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "d") pressed.d = false;
      if (e.key === "e") pressed.e = false;
    });

    document.body.addEventListener("click", (e) => {
      if (pressed.d && pressed.e) return;

      if (pressed.d) {
        e.preventDefault();
        deletionBuffer.push(e.target);

        deletionSiblingParentBuffer.push({
          parent: e.target.parentNode,
          sibling: e.target.nextSibling
        });

        e.target.remove();
      }

      if (pressed.e) {
        if (deletionBuffer.length > 0 && deletionSiblingParentBuffer.length > 0) {
          if (deletionSiblingParentBuffer.at(-1).sibling === null) {
            deletionSiblingParentBuffer.at(-1).parent.append(deletionBuffer.at(-1));
          } else {
            deletionSiblingParentBuffer.at(-1).parent.insertBefore(deletionBuffer.at(-1), deletionSiblingParentBuffer.at(-1).sibling);
          }
          deletionBuffer.pop();
          deletionSiblingParentBuffer.pop();
        }
      }
    });

})();
