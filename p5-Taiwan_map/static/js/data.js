let svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');
const margin = { top: 150, right: 60, bottom: 10, left: 60 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const g = svg.append('g').attr('id', 'maingroup')
    .attr('transform', `translate(${margin.left},${margin.top})`);
const jsonmeta = 'counties_tw';
// 設定地圖的投影法
let projection_method;
if (jsonmeta === 'counties_tw') {
    projection_method = d3.geoMercator();
} else {
    projection_method = d3.geoNaturalEarth1();
};

// d3的地圖接口
const geo = d3.geoPath().projection(projection_method);

// d3-tip
const tip = d3.tip()
    .attr('class', 'd3-tip')
    //直接設置圖原的html標籤
    .html(d => `<div class='tip'>${d.properties.name}</div>`);
// 把svg扔進tip()，tip會給svg進行配置
svg.call(tip);

let mapmeta;
// 開啟JSON檔案
d3.json(`static/TopoJSON/${jsonmeta}.json`).then(function(data) {
    // 把topoJSON轉為geoJSON，才能被d3後續調用處理。
    if (jsonmeta == 'counties_tw') {
        mapmeta = topojson.feature(data, data.objects.map);
    } else {
        mapmeta = topojson.feature(data, data.objects.countries);
    };

    // 設定地圖大小
    if (jsonmeta === 'counties_tw') {
        //依照經緯度設定中心點
        projection_method.center([120, 24])
            //放大倍率
            .scale(10000);
    } else {
        projection_method.fitSize([innerWidth, innerHeight], mapmeta);
    };

    // 就算沒有<path>，可以先選取綁定資料
    // 綁定資料是綁定geoJSON的features屬性
    g.selectAll('path').data(mapmeta.features).join('path')
        //<path>與d3接口
        .attr('d', geo)
        .attr('opacity', 0.7)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .on('mouseover', function(d) {
            d3.select(this)
                .attr('opacity', 0.5)
                .attr('stroke', 'white')
                .attr('stroke-width', 2);
            tip.show(d);
        })
        .on('mouseout', function(d) {
            d3.select(this)
                .attr('opacity', 0.7)
                .attr('stroke', 'black')
                .attr('stroke-width', 1);
            tip.hide(d);
        });



});