const _path = require('path');
const fs = require('fs-extra');
const request = require('superagent');
const config = require('../config/index');
const {p, domain, openRoute, porductPath, porductDataPath} = config.zlj;

const getPorducts = async() =>{
    try {
        const path = `${domain}${openRoute}${porductPath}?p=${p}`;
        let result = await request.get(path);
        result = JSON.parse(result.text);
        const {code, msg, data} = result;
        const {category_list, porduct_list} = data;
        const porductsList = [];
        for(let key in porduct_list){
            const category = porduct_list[key];
            const {category_id, category_name, info} = category;
            for(let item of info){
                const {product_id, product_name, sub_title} = item;
                porductsList.push({
                    categoryId      : category_id,
                    categoryName    : category_name,
                    productId       : product_id,
                    productName     : product_name,
                    subTitle        : sub_title
                });
                console.info(`${category_id} ${category_name} ${product_id} ${product_name} ${sub_title}`);
            }
        }
        return porductsList;
    } catch (e) {
        console.error(e);
        return [];
    }
};

const savePorducts = async() =>{
    try {
        const porductsList = await getPorducts();
        console.info('porductsList.size: ', porductsList.length);
        await fs.ensureDir(_path.join(porductDataPath, '..'));
        fs.writeFileSync(porductDataPath, JSON.stringify(porductsList, null, 4));
        return porductsList;
    } catch (e) {
        console.error(e);
        return [];
    }
};


exports.savePorducts = savePorducts;