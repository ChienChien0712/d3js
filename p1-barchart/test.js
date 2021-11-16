let data_array = [];

const svg = d3.select('#mainsvg');
const width = +svg.attr('width');
const height = +svg.attr('height');
const margin = { top: 60, right: 30, bottom: 60, left: 120 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const render = function(data) {
    // 建立x軸scale
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([0, innerWidth]);

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, innerHeight])
        .padding(0.5);

    const g = svg.append('g').attr('id', 'maingroup')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const yAxis = d3.axisLeft(yScale);
    g.append('g').call(yAxis);

    const xAxis = d3.axisBottom(xScale);
    g.append('g').call(xAxis).attr('transform', `translate(0, ${innerHeight})`);

    data.forEach(d => {
        g.append('rect')
            .attr('width', xScale(d.value))
            .attr('height', yScale.bandwidth())
            .attr('fill', 'green')
            .attr('opacity', 0.8)
            .attr('y', yScale(d.name));
    });

    d3.selectAll('.tick text').attr('font-size', '2em');

    g.append('text').text('Members of CSCG')
        .attr('font-size', '3em')
        .attr('transform', `translate(${innerWidth / 2}, 0)`)
        .attr('text-anchor', 'middle')
};

d3.csv('./data/data.csv').then(data => {
    data.forEach(d => {
        d['value'] = +(d['value']);
        data_array.push(d);
    });
    render(data_array);
});