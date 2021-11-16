let allkeys;
let alldates;
let xSacle, yScale;
const xValue = (datum) => { return datum['日期'] };
const yValue = (datum) => { return datum['現有確診'] };
const svg = d3.select('#mainsvg');
const width = +svg.attr('width');
const height = +svg.attr('height');
const margin = { top: 120, right: 50, bottom: 50, left: 120 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const g = svg.append('g').attr('id', 'maingroup')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
const yAxisLabel = '現有確診(人數)';

const render_init = function(data) {
    xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();

    yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue).reverse())
        .range([0, innerHeight])
        .nice();

    // Adding axes
    // 1. xAxis
    const xAxis = d3.axisBottom(xScale)
        // 每4個日期才顯示tick
        .ticks(Math.floor(alldates.length) / 4)
        .tickFormat(d3.timeFormat('%b-%d'))
        .tickSize(-innerHeight);
    const xAxisGroup = g.append('g').call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);
    // 2. yAxis
    const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);
    const yAxisGroup = g.append('g').call(yAxis)
        .attr('id', 'yaxis')
    yAxisGroup.append('text')
        .attr('font-size', '2em')
        .attr('transform', `rotate(-90)`)
        .attr('x', -innerHeight / 2)
        .attr('y', -60)
        .attr('fill', '#333333')
        .text(yAxisLabel)
        .attr('text-anchor', 'middle') // Make label at the middle of axis.    

    // adjust font-size of ticks
    g.selectAll('.tick text').attr('font-size', '2em');

    // 初始化渲染時，新添加一個<path>標籤
    g.append('path').attr('id', 'alterPath');
};

const render_update_alter = function(data) {
    // d3接口
    const line = d3.line()
        .x(d => { return xScale(xValue(d)) })
        .y(d => { return yScale(yValue(d)) })
        // 插值方法，不然就是一般的折線圖
        // .curve(d3.curveBasis);
        .curve(d3.curveCardinal.tension(0.5));

    // <path>標籤
    d3.select('#alterPath').datum(data)
        .attr('class', 'datacurve')
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 2.5)
        .transition().duration(2000)
        // 接口函數與<path>相接
        .attr('d', line);

    province = data[0]['省份'];
    g.selectAll('.province_text').remove();
    g.append("text")
        .data(data)
        .attr('class', 'province_text')
        .attr("x", innerWidth / 4 + 30)
        .attr("y", innerHeight / 10 - 20)
        .attr("dy", ".5em")
        .style("text-anchor", "end")
        .attr("fill", "#504f4f")
        .attr('font-size', '6em')
        .attr('font-weight', 'bold')
        .text(province);
};


d3.csv('./static/data/province.csv').then(data => {
    alldates = Array.from(new Set(data.map(d => xValue(d))));
    data.forEach(d => {
        d['現有確診'] = +(d['現有確診']);
        d['日期'] = new Date(d['日期']);
    });
    allkeys = Array.from(new Set(data.map(d => d['省份'])));

    let provinces = {};
    allkeys.forEach(key => { provinces[key] = [] });
    data.forEach(d => { provinces[d['省份']].push(d) });
    // 日期由小到大排列
    allkeys.forEach(key => provinces[key].sort(function(a, b) {
        return a['日期'] - b['日期'];
    }));

    // 初始渲染
    render_init(data);

    let c = 0;
    // 每2秒執行一次 
    let intervalId = setInterval(() => {
        if (c >= allkeys.length) {
            clearInterval(intervalId);
        } else {
            let key = allkeys[c];
            render_update_alter(provinces[key]);
            c = c + 1;
        };
    }, 2000);
})