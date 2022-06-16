function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    colony_account: document.querySelector("#colony_account").value,
    colony_user: document.querySelector("#colony_user").value,
    colony_pass: document.querySelector("#colony_pass").value,
    colony_space: document.querySelector("#colony_space").value,    
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#colony_account").value = result.colony_account || "";
    document.querySelector("#colony_user").value = result.colony_user || "";
    document.querySelector("#colony_pass").value = result.colony_pass || "";
    document.querySelector("#colony_space").value = result.colony_space || "";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get(["colony_account", "colony_user", "colony_pass", "colony_space"]);
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
