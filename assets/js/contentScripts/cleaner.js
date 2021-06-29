(() => {
  const Cleaner = {
    getTargetId: () => {
      return new Promise((resolve) => {
        try {
          chrome.storage.local.get("input", (result) => {
            if (!(result && result.input)) resolve(false);
            resolve({
              input: result.input,
            });
          });
        } catch (err) {
          throw new Error("fatal - internal error occured!", err);
        }
      });
    },
    cleaner: async () => {
      const inputVal = (await Cleaner.getTargetId())?.input;  //* inputVal: target div id that need to hide.
      if (!(inputVal && typeof inputVal === "string" && inputVal.length)) return;

      const divArray = Array.from(
        document.querySelectorAll(`div#${inputVal}`) || []
      );

      divArray.forEach((div) => {
        div.style.display = "none";
        div.setAttribute("disabled", "true"); 
      });
    },
  };

  Cleaner.cleaner();
})();
