// get main SVG and its attributes & setting hyper-parameters; 
const svg = d3.select('#mainsvg');
const width = +svg.attr('width');
const height = +svg.attr('height');
const margin = { top: 100, right: 120, bottom: 100, left: 120 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
let xScale, yScale;
const xAxisLabel = '累計確診人數(對數)';
const yAxisLabel = '新增人數(對數)';

let aduration = 1000;
let xValue = d => Math.log(d['確診人數'] + 1); // function
let yValue = d => Math.log(d['新增確診'] + 1); // function
let circleRadius = d => Math.log(d['死亡人數'] + 10);
var color = {
    "武漢": "#ff1c12",
    "黃石": "#de5991",
    "十堰": "#759AA0",
    "荊州": "#E69D87",
    "宜昌": "#be3259",
    "襄陽": "#EA7E53",
    "鄂州": "#EEDD78",
    "荊門": "#9359b1",
    "孝感": "#47c0d4",
    "黃岡": "#F49F42",
    "咸宁": "#AA312C",
    "恩施州": "#B35E45",
    "隨州": "#4B8E6F",
    "仙桃": "#ff8603",
    "天門": "#ffde1d",
    "潛江": "#1e9d95",
    "神農架": "#7289AB"
}

const renderinit = function(data) {
    // Linear Scale: Data Space -> Screen Space; 
    xScale = d3.scaleLinear()
        .domain(d3.extent(data, xValue)) // "extent" is equivalent to '[d3.min(data, xValue), d3.max(data, xValue)]'; 
        .range([0, innerWidth])
        .nice();
    // Introducing y-Scale; 
    yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue).reverse()) // remember to use reverse() to make y-axis start from the bottom; 
        .range([0, innerHeight])
        .nice();
    // create inner canvas <g>
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('id', 'maingroup');

    // Adding axes; 
    const yAxis = d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        //.tickFormat(d3.format('.2s'))
        .tickPadding(10); // .tickPadding is used to prevend intersection of ticks; 
    const xAxis = d3.axisBottom(xScale)
        //.tickFormat(d3.format('.2s'))
        .tickSize(-innerHeight)
        .tickPadding(10);

    let yAxisGroup = g.append('g').call(yAxis)
        .attr('id', 'yaxis')
        .attr('font-size', '2em');
    yAxisGroup.append('text')
        .attr('font-size', '1em')
        .attr('transform', `rotate(-90)`)
        .attr('x', -innerHeight / 2)
        .attr('y', -60)
        .attr('fill', '#333333')
        .text(yAxisLabel)
        .attr('text-anchor', 'middle') // Make label at the middle of axis. 
    yAxisGroup.selectAll('.domain').remove(); // we can select multiple tags using comma to seperate them and we can use space to signify nesting; 

    let xAxisGroup = g.append('g').call(xAxis)
        .attr('transform', `translate(${0}, ${innerHeight})`)
        .attr('id', 'xaxis')
        .attr('font-size', '2em');
    xAxisGroup.append('text')
        .attr('font-size', '1em')
        .attr('y', 60)
        .attr('x', innerWidth / 2)
        .attr('fill', '#333333')
        .text(xAxisLabel);
    xAxisGroup.selectAll('.domain').remove();

    g.append('text').text('number of diagnosed COVID cases')
        .attr('font-size', '3em')
        .attr('transform', `translate(${innerWidth / 2}, -10)`)
        .attr('text-anchor', 'middle');

};

const renderUpdate = function(seq) {
    // #maingroup = inner canvas
    const g = d3.select('#maingroup');
    // 雖然一開始沒有circle，但可以先綁定資料，index為"地區"！
    let circleupdates = g.selectAll('circle').data(seq, d => d['地區']);
    // enter: 綁定資料後，由於一開始沒有"圖元"，故enter添加"圖元"
    let circleenter = circleupdates.enter().append('circle')
        .attr('cx', d => xScale(xValue(d)))
        .attr('cy', d => yScale(yValue(d)))
        .attr('r', d => 5 * circleRadius(d))
        .attr('fill', d => color[d['地區']])
        .attr('opacity', 0.8);
    // 結合updateSelectiom與enterSelection
    // .transition().duration(): 讓資料有動作
    circleupdates.merge(circleenter)
        .transition().ease(d3.easeLinear).duration(aduration)
        .attr('cx', d => xScale(xValue(d)))
        .attr('cy', d => yScale(yValue(d)))
        .attr('r', d => 5 * circleRadius(d));

    let textupdates = g.selectAll('.province_text').data(seq);
    textenter = textupdates.enter().append('text')
        .attr("class", "province_text")
        .attr("x", (d) => { return xScale(xValue(d)); })
        .attr("y", (d) => { return yScale(yValue(d)); })
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("fill", "#333333")
        .text(function(d) { return d['地區']; });
    textupdates.merge(textenter)
        .transition().ease(d3.easeLinear).duration(aduration)
        .attr('x', (d) => { return xScale(xValue(d)); })
        .attr('y', (d) => { return yScale(yValue(d)); });

    time = seq[0]['日期'];
    g.selectAll('.date_text').remove();
    g.append("text")
        .data(['seq'])
        .attr('class', 'date_text')
        .attr("x", innerWidth / 4 + 30)
        .attr("y", innerHeight / 10 - 20)
        .attr("dy", ".5em")
        .style("text-anchor", "end")
        .attr("fill", "#504f4f")
        .attr('font-size', '6em')
        .attr('font-weight', 'bold')
        .text(time);

};

let alldates;
let sequential;
d3.csv('static/data/hubeinxt_utf8.csv').then(data => {
    // filter()回傳True | False Array
    data = data.filter(d => d['地區'] !== "總計");
    data.forEach(d => {
        d['確診人數'] = +(d['確診人數']);
        d['新增確診'] = +(d['新增確診']);
        d['死亡人數'] = +(d['死亡人數']);
        if (d['新增確診'] < 0) {
            d['新增確診'] = 0;
        };
    });
    // new Set()
    // data.map(element => element['key']): 回傳Array
    // Array.from(): 轉為array
    alldates = Array.from(new Set(data.map(d => d['日期'])));
    // .sort(CompareFn(a,b) return a-b): <0: 不交換； >0: a,b交換
    alldates = alldates.sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    sequential = [];
    alldates.forEach(d => {
        sequential.push([]);
    });
    data.forEach(d => {
        // 找到alldates相對應日期的index給sequential內的[]編號
        sequential[alldates.indexOf(d['日期'])].push(d);
    });
    //渲染
    renderinit(data);
    console.log(data);
    // setInterval(fn, duration): 每間隔一次duration做一次fn
    let c = 0;
    let intervalId = setInterval(() => {
        if (c >= alldates.length) {
            clearInterval(intervalId);
        } else {
            renderUpdate(sequential[c]);
            c = c + 1;
        }
    }, aduration)
});