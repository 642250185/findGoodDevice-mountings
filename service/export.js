const _ = require('lodash');
const _path = require('path');
const fs = require('fs-extra');
const xlsx = require('node-xlsx').default;
const config = require('../config/index');
const {detailDataPath, downloadPath} = config.zlj;

const getData = async() =>{
    try {
        return JSON.parse(fs.readFileSync(detailDataPath));
    } catch (e) {
        console.error(e);
    }
};

const exportExcel = async() => {
    try {
        const detailDatas = await getData();
        const resultList = [['ID', '名称', '标题', '价格', '原价', '选项', '主图', '横幅图', '详情图']];

        for(let item of detailDatas){
            const row = [];
            row.push(item.productId);
            row.push(item.productName);
            row.push(item.subTitle);
            row.push(item.price);
            row.push(item.originalPrice);
            row.push(item.productSpec);
            row.push(item.mainPic);
            row.push(item.bannerImgs);
            row.push(item.detailsImgs);
            resultList.push(row);
        }

        const filename = `${downloadPath}/找靓机配件数据.xlsx`;
        fs.writeFileSync(filename, xlsx.build([
            {name: '配件详情信息', data: resultList}
        ]));
        console.log(`爬取结束, 成功导出文件: ${filename}`);
    } catch (e) {
        console.error(e);
        return e;
    }
};


exports.exportExcel = exportExcel;