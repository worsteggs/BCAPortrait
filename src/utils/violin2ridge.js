function splitStr(str, len) {
  const res = [];
  if (str.length > len) {
    const arr = str.split(" ");
    let sttr = [];
    for (let i = 0; i < arr.length; i++) {
      sttr.push(arr[i]);
      if (i < arr.length - 2 && (arr[i] + arr[i + 1]).length > len) {
        // console.log(arr[i]+arr[i+1].length,len,i<arr.length-2&&((arr[i]+arr[i+1]).length>len))
        res.push(sttr.join(" "));
        sttr = [];
      } else if (sttr.join(" ").length > len) {
        res.push(sttr.join(" "));
        sttr = [];
      } else if (i == arr.length - 1) {
        res.push(sttr.join(" "));
      }
    }
    // return res
    return arr;
  }
  return [str];
}
const ySpace = 28;
export default function (json, divId, xField, yField, margin2, cb) {
  console.log("violin divId json ", divId, json);
  const divObj = document.getElementById(divId);
  divObj.innerHTML = "";
  const colors = [
    "#ff77a1",
    "#ff6abf",
    "#e96ef5",
    "#826aff",
    "#06b3f9",
    "#0eca81",
    "#51d932",
    "#a0d33c",
    "#d9c122",
  ];
  let ylabel = Object.keys(json);
  const margin = margin2 || { top: 10, right: 30, bottom: 30, left: 100 };
  const width = divObj.clientWidth - margin.left - margin.right;
  const height = ylabel.length * ySpace;

  const svg = d3
    .select("#" + divId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    // .attr('width', '100%')
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // const tooltip = d3.select('#' + divId)
  //   .append('div')
  //   .style('opacity', 0)
  //   .attr('class', 'violin-tooltip')
  //   .attr('style', 'min-width:50px')

  const mouseover = function (d) {
    // tooltip.style('opacity', 0)
  };
  const mousemove = function (d, index) {
    const key = d3.select(this).attr("data-key");
    const xy = d3.mouse(this);
    const dy = y(key);
    const obj = json[key];
    const min = obj.min;
    const max = obj.max;
    const q1 = obj.q1;
    const median = obj.median;
    const q3 = obj.q3;
    // tooltip
    //   .style('opacity', 0)
    //   .html(`<b>MIN</b>:${min}<br><b>Q1</b>:${q1}<br><b>MEDIAN</b>:${median}<br><b>Q3</b>:${q3}<br><b>MAX</b>:${max}`)
    //   .html(`${d}`)
    //   .style('left', (xy[0] + 120) + 'px')
    //   .style('top', (xy[1] + parseFloat(dy)) + 'px')
  };
  const mouseleave = function (d) {
    // tooltip.style('opacity', 0)
  };

  const sumstat = [];
  const stepColor = 360 / json.length;

  let maxNum = 0;
  for (const i in json) {
    const allBins = json[i].value;
    const points = [0];
    const kdeValues = allBins.map(function (a) {
      return a[1];
    });
    const biggest = d3.max(kdeValues);
    if (biggest > maxNum) {
      maxNum = biggest;
    }
    json[i].points = points.concat(kdeValues); //
    json[i].color = d3.hsl(i + stepColor, 1, 0.5);
    sumstat.push(json[i]);
  }
  sumstat.sort((a, b) => {
    a.median - b.median;
  });
  ylabel = sumstat.map((e) => e.key);

  const maxX = Math.ceil(maxNum);
  // console.log("maxX", maxX,sumstat)

  const x = d3
    .scaleLinear()
    .domain([0, maxX || 1])
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  const y = d3
    .scaleBand()
    .range([height, 0])
    .domain(ylabel)
    // .padding(0.1)
    .paddingInner(1)
    .paddingOuter(1.2);

  svg
    .append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .datum(function (d) {
      return splitStr(d);
    })
    .selectAll("tspan")
    .data(function () {
      const text = d3.select(this).text();
      d3.select(this).text("");
      return splitStr(text, 20);
    })
    .enter()
    .append("tspan")
    .attr("x", function (d) {
      return d3.select(this.parentNode).attr("x");
    })
    .attr("dy", function (d, i) {
      return (i == 0 ? 0.4 : 0.8) + "em";
    })
    .text((d) => d);

  const pathLine = (points, label) => {
    return d3
      .line()
      .curve(d3.curveBasis)
      .x((d, i) => x((i / 50) * maxX))
      .y((d, i) => {
        return y(label) - d * ((ySpace * 1.4) / maxX);
      })(points);
  };
  const linerGradientColor = (color, i) => {
    var beginColor = color;
    var endColor = color.brighter();
    var defs = svg.append("defs");
    var linerGradient = defs
      .append("linearGradient")
      .attr("id", "linearColor_" + i)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    linerGradient
      .append("stop")
      .attr("offset", "0%")
      .style("stop-color", beginColor);
    linerGradient
      .append("stop")
      .attr("offset", "100%")
      .style("stop-color", endColor);
    return linerGradient;
  };
  svg
    .append("g")
    .selectAll("curve")
    .data(sumstat)
    .enter()
    // .attr('transform', function(d) { return ('translate(0,' + y(d.key) + ')') }) // -----------
    .append("path")
    .datum(function (d) {
      return d;
    })
    .attr("d", function (e) {
      return pathLine(e.points, e.key);
    })
    .attr("stroke", "#000a")
    .attr("stroke-width", "1px")
    // .style("fill", function (d, i) { return colors[i % colors.length] })
    .attr("fill", function (e, i) {
      const _hsl = d3.hsl((i * maxX) / 38, 1, 0.5);
      return "url(#" + linerGradientColor(_hsl, i).attr("id") + ")";
    });

  cb && cb();
}
