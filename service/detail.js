const _ = require('lodash');
const _path = require('path');
const fs = require('fs-extra');
const request = require('superagent');
const config = require('../config/index');
const {p, domain, openRoute, detailPath, porductDataPath, detailDataPath} = config.zlj;

let count = 0;
const disposeBannerImgs = async(array) => {
    try {
        const result = [];
        for(let item of array){
            const {url} = item;
            result.push(url);
        }
        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
};

const disposeDetailsImgs = async(details) => {
    try {
        const result = [];
        let detailsList = details.split("/>");
        for(let item of detailsList){
            item = item.substring(item.indexOf("src=")+5, item.indexOf("alt")-2);
            if(!_.isEmpty(item)){
                result.push(item);
            }
        }
        return result;
    } catch (e) {
        console.error(e);
        return []
    }
};

const disposeProductSpec = async(array) => {
    try {
        let spec = {}, final = [];
        for(let item of array){
            const {sp_name, value} = item;
            for(let _value of value){
                if(spec[sp_name]){
                    spec[sp_name] = `${spec[sp_name]} | ${_value.sp_value_name}`
                } else {
                    spec[sp_name] = _value.sp_value_name;
                }
            }
        }
        final.push(spec);
        return JSON.stringify(final[0]);
    } catch (e) {
        console.error(e);
        return e;
    }
};

const getDetail = async(product) => {
    try {
        ++count;
        const path = `${domain}${openRoute}${detailPath}?p=${p}&product_id=${product.productId}`;
        let result = await request.get(path);
        result = JSON.parse(result.text);
        const final = [];
        const {code, msg, data} = result;
        const {product_id, main_pic, product_name, sub_title, price, original_price, banner_imgs, details, product_spec} = data;
        const bannerImgs = await disposeBannerImgs(banner_imgs);
        const detailsImgs = await disposeDetailsImgs(details);
        const specs = await disposeProductSpec(product_spec);
        final.push({
            productId       : product_id,
            mainPic         : main_pic,
            productName     : product_name,
            subTitle        : sub_title,
            price           : price,
            originalPrice   : original_price,
            bannerImgs      : bannerImgs.join("、"),
            detailsImgs     : detailsImgs.join("、"),
            productSpec     : specs
        });
        console.info(`[${count}] >> ${product_id} ${product_name} ${sub_title} ${price} ${original_price} ${specs}`);
        return final;
    } catch (e) {
        console.error(e);
        return [];
    }
};

const getAllDetail = async() => {
    try {
        console.info(`开始采集配件数据......`);
        let number = 0, final = [];
        const porducts = JSON.parse(fs.readFileSync(porductDataPath));
        for(let product of porducts){
            ++number;
            const detail = await getDetail(product);
            final = final.concat(detail);
        }
        return final;
    } catch (e) {
        console.error(e);
        return [];
    }
};

const saveAllDetail = async() => {
    try {
        const alldetail = await getAllDetail();
        console.info('size: %d', alldetail.length);
        await fs.ensureDir(_path.join(detailDataPath, '..'));
        fs.writeFileSync(detailDataPath, JSON.stringify(alldetail, null, 4));
        return alldetail;
    } catch (e) {
        console.error(e);
        return [];
    }
};


exports.saveAllDetail = saveAllDetail;