(() => {
  const Handler = {
    inputDivId: document.getElementById("inputDivId"),
    btnDivId: document.getElementById("btnDivId"),

    isExists: () => {
      return (
        inputDivId instanceof HTMLElement && btnDivId instanceof HTMLElement
      );
    },

    getCurrentTab: async () => {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      return tab?.id;
    },

    getState: () => {
      return new Promise((resolve) => {
        try {
          chrome.storage.local.get("input", (result) => {
            if (!(result && result.input)) resolve(false);

            resolve({
              input: result.input,
            });
          });
        } catch (err) {
          resolve(false);
        }
      });
    },

    saveState: () => {
      const handleInput = (e) => {
        const input = e.target?.value;
        chrome.storage.local.set({ input });
        Handler.btnDivId.toggleAttribute("disabled", !input);
      };
      Handler.inputDivId.addEventListener("input", handleInput);
    },

    restoreState: async () => {
      const state = await Handler.getState();
      if (state) {
        Handler.inputDivId.value = state.input;
        Handler.inputDivId.dispatchEvent(new Event('input'))
      }
    },

    executeScript: () => {
      const handleClick = async () => {
        chrome.scripting.executeScript(
          {
            target: { tabId: await Handler.getCurrentTab(), allFrames: true },
            files: ["/assets/js/contentScripts/cleaner.js"],
          },
          () => null
        );
      };
      Handler.btnDivId.addEventListener("click", handleClick);
    },
  };

  if (Handler.isExists()) {
    Handler.restoreState();
    Handler.saveState();
    Handler.executeScript();
  }
})();
