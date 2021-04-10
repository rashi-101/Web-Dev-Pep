let fs = require("fs");
let pupp = require("puppeteer");
let pName = process.argv[2];
let links = ["https://www.amazon.in/","https://www.flipkart.com/","https://paytmmall.com/"];

(async function(){
    try{
        let browserInstance = await pupp.launch({
            headless:false,
            defaultViewport:null,
            args: ["--start-maximized"]
        });
       await getListingFromAma(links[0],browserInstance, pName);
        await getListingFromFlip(links[1],browserInstance, pName);
       await getListingFromPMall(links[2],browserInstance, pName);

    }catch(err){
        console.log(err);
    }
})();

async function getListingFromAma(url, browser, pName){
    console.log("----------AMAZON PROD DETAILS-------------");

    let newTab = await browser.newPage();
     
    await newTab.goto(url)
    await newTab.type("#twotabsearchtextbox",pName,{delay:100});
    await newTab.click("#nav-search-submit-button");
    await newTab.waitForNavigation({waitUntil: "domcontentloaded"});
    await newTab.waitForSelector(".a-price-whole",{visible:true});
    await newTab.waitForSelector(".a-size-medium.a-color-base.a-text-normal",{visible:true});

   let detailsArr = await newTab.evaluate(consoleFn,".a-size-medium.a-color-base.a-text-normal",".a-price-whole");
   console.table(detailsArr);
};

async function getListingFromFlip(url, browser, pName){
    console.log("----------FLIPKART PROD DETAILS-------------");
    let tab = await browser.newPage();
   await tab.goto(url);
   await tab.waitForSelector("._2KpZ6l._2doB4z", {visisble:true});
   await tab.click("._2KpZ6l._2doB4z");
   await tab.waitForSelector("._3704LK", {visible:true});
   await tab.type("._3704LK", pName,{delay:80});
   await tab.keyboard.press('Enter');
   await tab.waitForSelector("._1YokD2._2GoDe3 ._30jeq3", {visible:true});
   await tab.waitForSelector(".s1Q9rs",{visible:true});
   let detailsArr = await tab.evaluate(consoleFn, ".s1Q9rs","._1YokD2._2GoDe3 ._30jeq3");
   console.table(detailsArr);
    
}

async function getListingFromPMall(url, browser, pName){
    console.log("----------PAYTM MALL PROD DETAILS-------------");

    let tab = await browser.newPage();
    await tab.goto(url);
    await tab.waitForSelector("#searchInput",{visible:true});
    await tab.type("#searchInput",pName,{delay:80});
    await tab.keyboard.press('Enter');
    await tab.keyboard.press('Enter');
    await tab.waitForSelector("._1kMS span", {visible:true});
    await tab.waitForSelector(".pCOS .UGUy",{visible:true});

    let detailsArr = await tab.evaluate(consoleFn,".pCOS .UGUy","._1kMS span");
    console.table(detailsArr);
}

function consoleFn( nameSelect,priceSelc){
    let priceArr = document.querySelectorAll(priceSelc);
    let nameArr = document.querySelectorAll(nameSelect);
    let details =[];
    for(let i=0; i<5; i++){
        let Price = priceArr[i].innerText;
        let Name = nameArr[i].innerText;
        details.push({
            Price,
            Name
        });
    }
    return details;
}
