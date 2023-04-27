var monsterRate = 1;
chrome.action.onClicked.addListener(tab => {
    console.log(`[Monster Everywhere v${chrome.runtime.getManifest().version}]`);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (monsterRate<51) {
          monsterRate++;
      };
      if (monsterRate == 10 || monsterRate == 50) {
        chrome.tabs.create({url:`https://addons.opera.com/en/extensions/details/monster-everywhere-pet-many-monsters/`});
      }

      var activeTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: [`monster.js`],
        });
        chrome.action.setIcon({
            path: {
              50: 'monster/1f6' + ("0" + Math.floor((Math.random() * 68))).slice(-2) + '.png'
            }
        });
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "1",
      title: "\u2665 Rate Me \u2026",
      contexts: ["action"]
    });

    chrome.contextMenus.create({
      id: "2",
      title: "\u266b What's New \u2026",
      contexts: ["action"]
    });

    chrome.contextMenus.create({
      id: "3",
      title: "\u2615\ufe0e Donate \u2026",
      contexts: ["action"]
    });

    chrome.contextMenus.create({
      id: "4",
      title: "\u260e Feedback \u2026",
      contexts: ["action"]
    });
});

async function contextClick(info, tab) {
  const { menuItemId } = info

  if (menuItemId == '1') {
    chrome.tabs.create({url:`https://addons.opera.com/en/extensions/details/monster-everywhere-pet-many-monsters/`})
  }
  if (menuItemId == '2') {
    chrome.tabs.create({url:`https://www.downloadhub.cloud/2023/04/CustomizerYoutube.html`})
  }
  if (menuItemId == '3') {
    chrome.tabs.create({url:`https://www.downloadhub.cloud/2023/04/monster.html?reason=support`})
  }
  if (menuItemId == '4') {
    chrome.tabs.create({url:`https://www.downloadhub.cloud/2023/04/monster.html#report`})
  }
}

chrome.contextMenus.onClicked.addListener(contextClick);


