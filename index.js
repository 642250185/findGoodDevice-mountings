const {savePorducts} = require('./service/porduct');
const {saveAllDetail} = require('./service/detail');
const {saveAllImages} = require('./service/downloadImg');
const {exportExcel} = require('./service/export');

const start = async() => {
    try {
        console.info('开始......');
        console.info('开始采集配件数据......');
        await savePorducts();
        console.info('配件数据采集完毕。');

        console.info('开始采集配件详情数据......');
        await saveAllDetail();
        console.info('配件详情数据采集完成。');

        console.info('开始下载配件详情数据图片......');
        await saveAllImages();
        console.info('配件详情数据图片采集完成。');

        console.info('开始导出文件......');
        await exportExcel();
        console.info('文件导出完成。');

        console.info('结束。')

    } catch (e) {
        console.error(e);
        return e;
    }
};


start();