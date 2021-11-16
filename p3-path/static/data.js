let g = d3.select('#mainsvg');

// 畫正方形
g.append('path')
    .attr('d', 'M 10 10 H 80 V 80 H 10 L 10 10')
    .attr('stroke', 'black')
    .attr('stroke-width', '3')
    .attr('fill', 'yellow');

// 3次貝茲曲線
g.append('path')
    .attr('d', 'M130 30 C 150 60, 180 10, 220 30')
    .attr('stroke', 'black')
    .attr('fill', 'transparent')
    .attr('stroke-width', '2');
g.append('circle').attr('cx', '130').attr('cy', '30')
    .attr('r', '2').attr('fill', 'red');
g.append('circle').attr('cx', '150').attr('cy', '60')
    .attr('r', '2').attr('fill', 'red');
g.append('circle').attr('cx', '180').attr('cy', '10')
    .attr('r', '2').attr('fill', 'red');
g.append('circle').attr('cx', '220').attr('cy', '30')
    .attr('r', '2').attr('fill', 'red');
g.append('text').text('start')
    .attr('x', '131').attr('y', '30')
g.append('text').text('c1')
    .attr('x', '151').attr('y', '60')
g.append('text').text('c2')
    .attr('x', '181').attr('y', '10')
g.append('text').text('end')
    .attr('x', '221').attr('y', '30')

// 3次貝茲曲線延長 (S命令)
g.append('path')
    .attr('d', 'M 250 80 C 280 20, 320 40, 340 70 S 380 70, 420 80')
    .attr('stroke', 'black')
    .attr('fill', 'transparent')
    .attr('stroke-width', '2');
g.append('circle').attr('cx', '250').attr('cy', '80')
    .attr('r', '2').attr('fill', 'red');
g.append('circle').attr('cx', '280').attr('cy', '20')
    .attr('r', '2').attr('fill', 'red');
g.append('circle').attr('cx', '320').attr('cy', '40')
    .attr('r', '2').attr('fill', 'red');
g.append('circle').attr('cx', '340').attr('cy', '70')
    .attr('r', '2').attr('fill', 'red');
g.append('circle').attr('cx', '360').attr('cy', '100')
    .attr('r', '2').attr('fill', 'blue');
g.append('circle').attr('cx', '380').attr('cy', '70')
    .attr('r', '2').attr('fill', 'blue');
g.append('circle').attr('cx', '420').attr('cy', '80')
    .attr('r', '2').attr('fill', 'blue');
g.append('text').text('start')
    .attr('x', '251').attr('y', '80')
g.append('text').text('c1')
    .attr('x', '281').attr('y', '20')
g.append('text').text('c2')
    .attr('x', '321').attr('y', '40')
g.append('text').text('end')
    .attr('x', '341').attr('y', '70')
g.append('text').text("c1'")
    .attr('x', '361').attr('y', '100')
g.append('text').text("c2'")
    .attr('x', '381').attr('y', '70')
g.append('text').text('end')
    .attr('x', '421').attr('y', '80')
g.append('line')
    .attr('x1', '320').attr('y1', '40')
    .attr('x2', '340').attr('y2', '70')
    .attr('style', 'stroke:rgb(0,0,255);stroke-width:1')
g.append('line')
    .attr('x1', '340').attr('y1', '70')
    .attr('x2', '360').attr('y2', '100')
    .attr('style', 'stroke:rgb(255,0,0);stroke-width:1')