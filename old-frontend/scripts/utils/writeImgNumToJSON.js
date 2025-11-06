const fs = require('fs');
const path = require('path');

//get json
const jsonPath = path.join(__dirname, '../products_data.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const jsonData = JSON.parse(rawData);

const shoesDir = path.join(__dirname, '../imgs/shoes');
const shoes = fs.readdirSync(shoesDir)

shoes.forEach(shoe => {
    let dir = shoesDir.concat("/").concat(shoe);
    let files = fs.readdirSync(dir).filter(file => /\d\.(png)$/i.test(file));
    files.forEach(file => {
        let colorwayIndex = parseInt(file.substring(file.length-7, file.length-6));
        let key = file.substring(0, file.length - "_x_x.png".length);

        //instance ims_per_colorway if returns null
        if (!jsonData[key].imgs_per_colorway) {
            jsonData[key].imgs_per_colorway = new Array(jsonData[key].variants);
            //set all to 0
            for (let i = 0; i < jsonData[key].imgs_per_colorway.length; i++) {
                jsonData[key].imgs_per_colorway[i] = 0;
            }
        }
        jsonData[key].imgs_per_colorway[colorwayIndex-1] += 1; //count
    });
});

fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));

console.log(`✅ Succsessfully wrote to ${jsonPath}`)
