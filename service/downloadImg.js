const _ = require('lodash');
const uuid = require('uuid');
const fs = require('fs-extra');
const request = require('superagent');
const sleep = require('js-sleep/js-sleep');
const config = require('../config/index');
const {detailDataPath, mainPicPath, bannerImgsPath, detailsImgsPath} = config.zlj;

const PATH = {
    MAIN_PIC    : '../download/images/main_pic',
    BANNER_IMGS : '../download/images/banner_imgs',
    DETAILS_IMGS: '../download/images/details_imgs'
};

let count = 0;
const downloadImages = async(item) => {
    try {
        ++count;
        const {productId, productName, mainPic, bannerImgs, detailsImgs} = item;
        const bannerImgsList = bannerImgs.split("、");
        const detailsImgsList = detailsImgs.split("、");

        console.info(`${productId} ${productName} - 主图 [1] 张、 横幅图片 [${bannerImgsList.length}] 张、 配件详情图片 [${detailsImgsList.length}] 张`);

        // TODO 下载主图、创建主图目录
        await fs.ensureDirSync(PATH.MAIN_PIC);
        const mainPicStr = uuid();
        const mainPicFileName = `${productId}-${mainPicStr}`;
        const _mainPicPath = `${mainPicPath}/${mainPicFileName}.jpeg`;
        await request(mainPic).pipe(fs.createWriteStream(_mainPicPath)).on('close', () => {
            console.info(`[${count}] 主图 :[${productId}-${productName}]: -> ${mainPicFileName}.jpeg Download Success!`);
        });

        // TODO 下载横幅图片、创建横幅图片目录
        await fs.ensureDirSync(PATH.BANNER_IMGS);
        for(let url of bannerImgsList){
            await sleep(1000 * 2);
            const bannerImgsStr = uuid();
            const bannerImgsFileName = `${productId}-${bannerImgsStr}`;
            const _bannerImgsPath = `${bannerImgsPath}/${bannerImgsFileName}.jpeg`;
            await request(url).pipe(fs.createWriteStream(_bannerImgsPath)).on('close', () =>{
                console.info(`[${count}] 横幅图 :[${productId}-${productName}]: -> ${bannerImgsFileName}.jpeg Download Success!`);
            });
        }

        // TODO 下载配件详情图片、创建配件图片目录
        await fs.ensureDirSync(PATH.DETAILS_IMGS);
        for(let url of detailsImgsList){
            await sleep(1000 * 2);
            const detailsImgsStr = uuid();
            const detailsImgsFileName = `${productId}-${detailsImgsStr}`;
            const _detailsImgsPath = `${detailsImgsPath}/${detailsImgsFileName}.jpeg`;
            await request(url).pipe(fs.createWriteStream(_detailsImgsPath)).on('close', () =>{
                console.info(`[${count}] 详情图 :[${productId}-${productName}]: -> ${detailsImgsFileName}.jpeg Download Success!`);
            });
        }
    } catch (e) {
        console.error(e);
        return e;
    }
};

const saveAllImages = async() => {
    try {
        let number = 0;
        const detailData = JSON.parse(fs.readFileSync(detailDataPath));
        console.info(`共 ${detailData.length} 款成色配件、准备下载图片......`);
        for(let item of detailData){
            ++number;
            await downloadImages(item);
            // if(number === 5){
            //     break;
            // }
        }
    } catch (e) {
        console.error(e);
        return e;
    }
};


exports.saveAllImages = saveAllImages;