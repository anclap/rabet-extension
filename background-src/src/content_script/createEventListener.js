export default (type, responseType, isDetail) => {
  return (e) => {
    chrome.runtime.sendMessage(
      {
        type,
        detail: isDetail ? e.detail : e,
      },
      (res) => {      
        document.dispatchEvent(
          new CustomEvent(responseType, {
            detail: res,
          }),
        );
      },
    );
  };
};
