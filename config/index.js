const path = require('path');

const config = {
    zlj: {
        p: 'xcx',
        v: '1.0.0',

        domain: 'https://panda.huodao.hk',
        openRoute: '/api/pat',

        porductPath: '/search_product_list',
        detailPath: '/detail',

        porductDataPath: path.join(__dirname, '..', 'data/porduct.json'),
        detailDataPath: path.join(__dirname, '..', 'data/detail.json'),

        mainPicPath: path.join(__dirname, '..', 'download/images/main_pic'),
        bannerImgsPath: path.join(__dirname, '..', 'download/images/banner_imgs'),
        detailsImgsPath: path.join(__dirname, '..', 'download/images/details_imgs'),

        downloadPath: path.join(__dirname, '..', 'download'),
    },
    /**
     * 返回或设置当前环镜
     */
    env: function () {
        global.$config = this;
        return global.$config;
    }
};

module.exports = config.env();






