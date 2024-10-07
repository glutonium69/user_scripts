// ==UserScript==
// @name         Deletable
// @namespace    http://tampermonkey.net/
// @version      2024-10-07
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @icon         *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("running deletable");

    /*
    buffer contains data of the deleted element
    array items look at follows
      {
          deleted: e.target, // the deleted element itself
          parent: e.target.parentNode, // its parent
          nextSibling: e.target.nextSibling // its next sibling
      }
    */
    const deletionBuffer = [];

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

        deletionBuffer.push({
          deleted: e.target,
          parent: e.target.parentNode,
          nextSibling: e.target.nextSibling // next sibling returns null if targeted element is the last child node
        });

        e.target.remove();
      }

      if (pressed.e) {
        if (deletionBuffer.length === 0) return;

        if (deletionBuffer.at(-1).nextSibling === null) { // means it was the last element and had no next sibling
          deletionBuffer.at(-1).parent.append(deletionBuffer.at(-1).deleted); // just append to the parent
        } else { // does have a next sibling
          deletionBuffer.at(-1).parent.insertBefore(deletionBuffer.at(-1).deleted, deletionBuffer.at(-1).nextSibling); // insert before the sibling
        }

        deletionBuffer.pop();
      }
    });

})();
