// To build with https://caiorss.github.io/bookmarklet-maker/

const screenshotUrl = document.querySelector('[class^="styles__HeaderScreenshot-"]').src;
const testId = screenshotUrl.replace(/^.*?test=(.*).video&a=1_screen.jpg&.*$/, "$1");
const WPTUrl = `https://www.webpagetest.org/result/${testId}/`;
window.open(WPTUrl);

// javascript:(function()%7Bconst%20screenshotUrl%20%3D%20document.querySelector('%5Bclass%5E%3D%22styles__HeaderScreenshot-%22%5D').src%3B%0Aconst%20testId%20%3D%20screenshotUrl.replace(%2F%5E.*%3Ftest%3D(.*).video%26a%3D1_screen.jpg%26.*%24%2F%2C%20%22%241%22)%3B%0Aconst%20WPTUrl%20%3D%20%60https%3A%2F%2Fwww.webpagetest.org%2Fresult%2F%24%7BtestId%7D%2F%60%3B%0Awindow.open(WPTUrl)%3B%7D)()%3B
