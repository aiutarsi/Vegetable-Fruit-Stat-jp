/* 更新日時 */
const updateInput = document.querySelector("#update-date");
d3.json("./js/update_date.json").then(function(data) {
  updateInput.textContent = data["update"].slice(0,4)+"/"+data["update"].slice(4,6)+"/"+data["update"].slice(6,8)+"　更新";
})

/* 食物・日付選択 */
const foodInput = document.querySelector("#crop-search");
const startYearInput = document.querySelector("#start-year");
const startMonthInput = document.querySelector("#start-month");
const startDayInput = document.querySelector("#start-day");
const endYearInput = document.querySelector("#end-year");
const endMonthInput = document.querySelector("#end-month");
const endDayInput = document.querySelector("#end-day");
const error_msg = document.querySelector("#date-error");

/* ウィンドウサイズ */
const middle = document.querySelector(".middle");
domPositions();
window.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('resize', function() { domPositions(); });
});

/* 折れ線グラフ部分 */
const cities_code_list = ["0401","1301","1401","1701","2301","2601","2701","2801","3401","3701","4001","4002","4701","5101"];
const cities_code_dic = {'0401':"仙台", '1301':"東京", '1401':"横浜", '1701':"金沢", '2301':"名古屋", '2601':"京都", '2701':"大阪", '2801':"神戸", '3401':"広島", '3701':"高松", '4001':"北九州", '4002': "福岡", '4701':"沖縄", '5101':"札幌"};
const cities_color_dic = {'0401':"aqua", '1301':"blue", '1401':"fuchsia", '1701':"gray", '2301':"green", '2601':"lime", '2701':"maroon", '2801':"navy", '3401':"olive", '3701':"purple", '4001': "red", '4002':"silver", '4701':"teal", '5101':"yellow"};
const cities_length = cities_code_list.length;
const food_name_dic = {"\u307f\u304b\u3093": "40100", "\u30cd\u30fc\u30d6\u30eb": "41201", "\u7518\u306a\u3064\u307f\u304b\u3093": "41253", "\u306f\u3063\u3055\u304f": "41321", "\u305d\u306e\u4ed6\u96d1\u304b\u3093": "41999", "\u308a\u3093\u3054\u8a08": "42000", "\u30b8\u30e7\u30ca\u30b4\u30eb\u30c9": "42505", "\u738b\u6797": "42515", "\u3075\u3058": "42804", "\u305d\u306e\u4ed6\u308a\u3093\u3054": "42999", "\u3073\u308f": "43900", "\u304a\u3046\u3068\u3046": "44800", "\u3044\u3061\u3054": "46100", "\u30e1\u30ed\u30f3\u8a08": "47000", "\u6e29\u5ba4\u30e1\u30ed\u30f3": "47200", "\u30a2\u30f3\u30c7\u30b9": "47213", "\u305d\u306e\u4ed6\u30e1\u30ed\u30f3": "47299", "\u3059\u3044\u304b": "48100", "\u30ad\u30a6\u30a4\u30d5\u30eb\u30c4": "49300", "\u30d0\u30ca\u30ca": "50100", "\u30d1\u30a4\u30ca\u30c3\u30d7\u30eb": "50300", "\u30ec\u30e2\u30f3": "50400", "\u30b0\u30ec\u30d7\u30d5\u30eb\u30c4": "50500", "\u30aa\u30ec\u30f3\u30b8": "50600", "\u8f38\u5165\u30ad\u30a6\u30a4": "50800", "\u8f38\u5165\u30e1\u30ed\u30f3": "50850", "\u3060\u3044\u3053\u3093": "30100", "\u304b\u3076": "30200", "\u306b\u3093\u3058\u3093": "30300", "\u3054\u307c\u3046": "30400", "\u305f\u3051\u306e\u3053": "30500", "\u308c\u3093\u3053\u3093": "30600", "\u306f\u304f\u3055\u3044": "31100", "\u307f\u305a\u306a": "31300", "\u3053\u307e\u3064\u306a": "31500", "\u3061\u3093\u3052\u3093\u3055\u3044": "31560", "\u30ad\u30e3\u30d9\u30c4": "31700", "\u307b\u3046\u308c\u3093\u305d\u3046": "31800", "\u306d\u304e": "31900", "\u3075\u304d": "32300", "\u3046\u3069": "32400", "\u307f\u3064\u3070": "32500", "\u3057\u3085\u3093\u304e\u304f": "32600", "\u306b\u3089": "32800", "\u30bb\u30eb\u30ea\u30fc": "32900", "\u30a2\u30b9\u30d1\u30e9\u30ac\u30b9": "33100", "\u30ab\u30ea\u30d5\u30e9\u30ef\u30fc": "33200", "\u30d6\u30ed\u30c3\u30b3\u30ea\u30fc": "33300", "\u30ec\u30bf\u30b9": "33400", "\u30d1\u30bb\u30ea": "33600", "\u304d\u3085\u3046\u308a": "34100", "\u304b\u307c\u3061\u3083": "34200", "\u306a\u3059": "34300", "\u30c8\u30de\u30c8": "34400", "\u30df\u30cb\u30c8\u30de\u30c8": "34450", "\u30d4\u30fc\u30de\u30f3": "34500", "\u3057\u3057\u3068\u3046": "34600", "\u3055\u3084\u3044\u3093\u3052\u3093": "35100", "\u3055\u3084\u3048\u3093\u3069\u3046": "35200", "\u5b9f\u3048\u3093\u3069\u3046": "35300", "\u305d\u3089\u307e\u3081": "35400", "\u304b\u3093\u3057\u3087": "36100", "\u3070\u308c\u3044\u3057\u3087": "36200", "\u3055\u3068\u3044\u3082": "36300", "\u3084\u307e\u306e\u3044\u3082": "36500", "\u305f\u307e\u306d\u304e": "36610", "\u306b\u3093\u306b\u304f": "36700", "\u3057\u3087\u3046\u304c": "37200", "\u751f\u3057\u3044\u305f\u3051": "38100", "\u306a\u3081\u3053": "38300", "\u3048\u306e\u304d\u3060\u3051": "38400", "\u3057\u3081\u3058": "38500", "\u30b9\u30a4\u30c8\u30b3\u30fc\u30f3": "34700", "\u3048\u3060\u307e\u3081": "35500", "\u3044\u3088\u304b\u3093": "41301", "\u304b\u304d\u8a08": "43500", "\u7518\u304c\u304d": "43700", "\u3076\u3069\u3046\u8a08": "45000", "\u305d\u306e\u4ed6\u3076\u3069\u3046": "45299", "\u65e5\u672c\u306a\u3057\u8a08": "43000", "\u305d\u306e\u4ed6\u306a\u3057": "43401", "\u3082\u3082": "44100", "\u30c7\u30e9\u30a6\u30a7\u30a2": "45202", "\u8f38\u5165\u304a\u3046\u3068\u3046": "50700", "\u5de8\u5cf0": "45206", "\u3046\u3081": "44950"};
let display_flags = {'0401':false, '1301':false, '1401':false, '1701':false, '2301':false, '2601':false, '2701':false, '2801':false, '3401':false, '3701':false, '4001':false, '4002': false, '4701':false, '5101':false};

let dataset = {}; //データ

const width = 800; // グラフの幅
const height = 500; // グラフの高さ
const margin = { "top": 30, "bottom": 60, "right": 40, "left": 60 };

let xScale, yScale;
let start_day, end_day;
let svg;
let tooltip;

let food_code = food_name_dic[foodInput.value];
let file_path = "./js/data/data_" + food_code + ".json";

startYearInput.addEventListener('change', judgeAndWriteMessage);
startMonthInput.addEventListener('change', judgeAndWriteMessage);
startDayInput.addEventListener('change', judgeAndWriteMessage);
endYearInput.addEventListener('change', judgeAndWriteMessage);
endMonthInput.addEventListener('change', judgeAndWriteMessage);
endDayInput.addEventListener('change', judgeAndWriteMessage);

startYearInput.addEventListener('change', function() {
  change_flags("alloff");
  d3.select("#chart").remove();
  d3.selectAll(".tooltip").remove();
});
startMonthInput.addEventListener('change', function() {
  change_flags("alloff");
  d3.select("#chart").remove();
  d3.selectAll(".tooltip").remove();
});
startDayInput.addEventListener('change', function() {
  change_flags("alloff");
  d3.select("#chart").remove();
  d3.selectAll(".tooltip").remove();
});
endYearInput.addEventListener('change', function() {
  change_flags("alloff");
  d3.select("#chart").remove();
  d3.selectAll(".tooltip").remove();
});
endMonthInput.addEventListener('change', function() {
  change_flags("alloff");
  d3.select("#chart").remove();
  d3.selectAll(".tooltip").remove();
});
endDayInput.addEventListener('change', function() {
  change_flags("alloff");
  d3.select("#chart").remove();
  d3.selectAll(".tooltip").remove();
});

endYearInput.value = String((new Date()).getFullYear());
endMonthInput.value = String((new Date()).getMonth()+1);
endDayInput.value = String((new Date()).getDate());

d3.json(file_path).then(function(data) { 
  dataset = data;
});
foodInput.addEventListener('change', function(event) { 
  food_code = food_name_dic[foodInput.value]
  file_path = "./js/data/data_" + food_code + ".json";
  dataset = {};
  d3.json(file_path).then(function(data) { 
    dataset = data;
  });
  change_flags("alloff");
  d3.select("#chart").remove();
  d3.selectAll(".tooltip").remove();
});

d3.select("#sapporo").on("click", function(){drawGraphOneCity("5101")});
d3.select("#sendai").on("click", function(){drawGraphOneCity("0401")});
d3.select("#tokyo").on("click", function(){drawGraphOneCity("1301")});
d3.select("#yokohama").on("click", function(){drawGraphOneCity("1401")});
d3.select("#kanazawa").on("click", function(){drawGraphOneCity("1701")});
d3.select("#nagoya").on("click", function(){drawGraphOneCity("2301")});
d3.select("#kyoto").on("click", function(){drawGraphOneCity("2601")});
d3.select("#osaka").on("click", function(){drawGraphOneCity("2701")});
d3.select("#kobe").on("click", function(){drawGraphOneCity("2801")});
d3.select("#hiroshima").on("click", function(){drawGraphOneCity("3401")});
d3.select("#takamatsu").on("click", function(){drawGraphOneCity("3701")});
d3.select("#kitakyusyu").on("click", function(){drawGraphOneCity("4001")});
d3.select("#fukuoka").on("click", function(){drawGraphOneCity("4002")});
d3.select("#okinawa").on("click", function(){drawGraphOneCity("4701")});
d3.select("#allon").on("click", function(){drawGraphOneCity("allon")});
d3.select("#alloff").on("click", function(){drawGraphOneCity("alloff")});


function domPositions() {
  if (window.innerWidth < 1400) {
    middle.style.display = "block";
  }
  else {
    middle.style.display = "flex";
  }
}

function judgeAndWriteMessage() {
  const msgStart = dateCheck(startYearInput.value, startMonthInput.value, startDayInput.value);
  const msgEnd = dateCheck(endYearInput.value, endMonthInput.value, endDayInput.value);
  if (msgStart === "ok" && msgEnd === "ok") {
    const startDay = new Date(startYearInput.value, startMonthInput.value-1, startDayInput.value);
    const endDay = new Date(endYearInput.value, endMonthInput.value-1, endDayInput.value);
    if (startDay > endDay) {
      error_msg.textContent = "開始日を終了日より前にしてください。";
      return false;
    }
    else {
      error_msg.textContent = "";
      return true;
    }
  }
  else {
    error_msg.textContent = "存在しない日です。";
    return false;
  }
};

function dateCheck(y, m, d) {
  const year = Number(y);
  const month = Number(m);
  const day = Number(d);
  if (month === 4 || month === 6 || month === 9 || month === 11) {
    if (day >= 31) {
      return "存在しない日です。";
    }
  }
  else if (month === 2) {
    if (year%4 === 0) {
      if (day >= 30) {
        return "存在しない日です。";
      }
    }
    else {
      if (day >= 29) {
        return "存在しない日です。";
      }
    }
  }
  return "ok";
}

function drawGraphOneCity(city_code) {
  if (judgeAndWriteMessage()) { //選択した日付が正統なときのみ実行.
    change_flags(city_code);
    d3.select("#chart").remove();
    d3.selectAll(".tooltip").remove();
    show_graph_all();
  }
}

function make_svg() {
  svg = d3.select("#chart-div").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "chart");
  tooltip = d3.select("#chart-div").append("div")
    .attr("class", "tooltip");
}

function change_flags(selected_button) {
  if (selected_button === "allon") {
    for (let i = 0; i < cities_length; i++) display_flags[cities_code_list[i]] = true;
  }
  if (selected_button === "alloff") {
    for (let i = 0; i < cities_length; i++) display_flags[cities_code_list[i]] = false;
  }
  if (display_flags[selected_button] === true) display_flags[selected_button] = false;
  else display_flags[selected_button] = true;
}

function set_scale() {
  //開始・終了日付を見つける(より開始は古い日付にする)
  start_day = new Date('2060-12-31'); 
  end_day = new Date('2000-01-01');
  let all_false = true;
  for (let i = 0; i < cities_length; i++) {
    let city_code = cities_code_list[i];
    if (typeof dataset[food_code][city_code] === "undefined") continue;
    let selected_dataset = dataset[food_code][city_code];
    if (display_flags[city_code]) {
      all_false = false;
      let start_day_tmp = new Date(selected_dataset[0][0].slice(0,4), selected_dataset[0][0].slice(4,6)-1, selected_dataset[0][0].slice(6,8));
      let end_day_tmp = new Date(selected_dataset[selected_dataset.length-1][0].slice(0,4), selected_dataset[selected_dataset.length-1][0].slice(4,6)-1, selected_dataset[selected_dataset.length-1][0].slice(6,8));
      if (start_day > start_day_tmp) {
        start_day = start_day_tmp;
      }
      if (end_day < end_day_tmp) {
        end_day = end_day_tmp;
      }
    }
  }
  const start_input = new Date(Number(startYearInput.value), Number(startMonthInput.value)-1, Number(startDayInput.value));
  const end_input = new Date(Number(endYearInput.value), Number(endMonthInput.value)-1, Number(endDayInput.value));
  if (start_input > start_day) {
    start_day = start_input;
  }
  if (end_input < end_day) {
    end_day = end_input;
  }
  if (all_false) { //グラフに何も表示されない時(計算量短縮)
    start_day = end_day;
  }
  xScale = d3.scaleTime()
    .domain([start_day, end_day])
    .range([margin.left, width - margin.right]);
  //最小価格・最大価格を見つける
  let min_cost = 10000;
  let max_cost = -1;
  let offset = 5;
  for (let i = 0; i < cities_length; i++) {
    let city_code = cities_code_list[i];
    if (typeof dataset[food_code][city_code] === "undefined") continue;
    if (!display_flags[city_code]) continue;
    let start_index = dataset[food_code][city_code].findIndex(function(element) {return new Date(element[0].slice(0,4), element[0].slice(4,6)-1, element[0].slice(6,8)) >= start_day});
    let end_index = dataset[food_code][city_code].findIndex(function(element) {return new Date(element[0].slice(0,4), element[0].slice(4,6)-1, element[0].slice(6,8)) > end_day});
    if (start_index === -1) continue;
    if (end_index === -1) end_index = (dataset[food_code][city_code]).length;
    let selected_dataset = dataset[food_code][city_code].slice(start_index, end_index);
    for (let j = 0; j < selected_dataset.length; j++) {
      min_cost = Math.min(min_cost, selected_dataset[j][1]);
      max_cost = Math.max(max_cost, selected_dataset[j][1]);
    }
  }
  yScale = d3.scaleLinear()
    .domain([Math.max(min_cost-offset, 0), max_cost+offset])
    .range([height - margin.bottom, margin.top]);
}

function show_axis() {
  let axis_x = d3.axisBottom(xScale)
    .ticks(5)
    .tickFormat(d3.timeFormat("%y/%m/%d"))
    .tickSize(-height + margin.bottom + margin.top);
  let axis_y = d3.axisLeft(yScale)
    .ticks(20)
    .tickSize(-width + margin.left + margin.right);
  svg.append("g")
    .attr("class", "x_axis")
    .attr("transform", "translate(" + 0 + "," + (height - margin.bottom) + ")")
    .call(axis_x)
    .append("text")
    .attr("fill", "black")
    .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
    .attr("y", 35)
    .attr("text-anchor", "middle")
    .attr("font-size", "10pt")
    .attr("font-weight", "bold")
    .text("日付 [年/月/日]");
  svg.append("g")
    .attr("class", "y_axis")
    .attr("transform", "translate(" + margin.left + "," + 0 + ")")
    .call(axis_y)
    .append("text")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("x", -(height - margin.top - margin.bottom) / 2 - margin.top)
    .attr("y", -35)
    .attr("transform", "rotate(-90)")
    .attr("font-weight", "bold")
    .attr("font-size", "10pt")
    .text("価格 [円/1kg]");
}

function line_plot() {
  for (let i = 0; i < cities_length; i++) {
    let city_code = cities_code_list[i];
    if (typeof dataset[food_code][city_code] === "undefined") continue;
    if (display_flags[city_code] === false) continue;
    let start_index = dataset[food_code][city_code].findIndex(function(element) {return new Date(element[0].slice(0,4), element[0].slice(4,6)-1, element[0].slice(6,8)) >= start_day});
    let end_index = dataset[food_code][city_code].findIndex(function(element) {return new Date(element[0].slice(0,4), element[0].slice(4,6)-1, element[0].slice(6,8)) > end_day});
    if (start_index === -1) continue;
    if (end_index === -1) end_index = (dataset[food_code][city_code]).length;
    let selected_dataset = dataset[food_code][city_code].slice(start_index, end_index);
    let path = svg.append("path")
      .datum(selected_dataset)
      .attr("fill", "none")
      .attr("stroke", cities_color_dic[city_code])
      .attr("stroke-width", 1.0)
      .attr("d", d3.line()
          .x(function(d) { return xScale(new Date(d[0].slice(0,4), d[0].slice(4,6)-1, d[0].slice(6,8))); })
          .y(function(d) { return yScale(d[1]); }));
    let path_length = path.node().getTotalLength(); //パスの長さ
    path.attr("stroke-dasharray", path_length + " " + path_length)
      .attr("stroke-dashoffset", path_length)
      .transition()
      .duration(350)
      .attr("ease", "linear")
      .attr("stroke-dashoffset", 0);
  }
}

function scatter_plot() {
  for (let i = 0; i < cities_length; i++) {
    let city_code = cities_code_list[i];
    if (typeof dataset[food_code][city_code] === "undefined") continue;
    if (display_flags[city_code] === false) continue;
    let start_index = dataset[food_code][city_code].findIndex(function(element) {return new Date(element[0].slice(0,4), element[0].slice(4,6)-1, element[0].slice(6,8)) >= start_day});
    let end_index = dataset[food_code][city_code].findIndex(function(element) {return new Date(element[0].slice(0,4), element[0].slice(4,6)-1, element[0].slice(6,8)) > end_day});
    if (start_index === -1) continue;
    if (end_index === -1) end_index = (dataset[food_code][city_code]).length;
    let selected_dataset = dataset[food_code][city_code].slice(start_index, end_index);
    svg.append("g")
      .selectAll("circle")
      .data(selected_dataset)
      .enter()
      .append("circle")
      .attr("cx", function(d) { return xScale(new Date(d[0].slice(0,4), d[0].slice(4,6)-1, d[0].slice(6,8))); })
      .attr("cy", function(d) { return yScale(d[1]); })
      .attr("fill", cities_color_dic[city_code])
      .attr("r", 3)
      .on("mouseover", function(d, i) {
        tooltip
          .style("visibility", "visible")
          .html(cities_code_dic[city_code] + "<br>" + i[0].slice(0,4) + "/" + i[0].slice(4,6) + "/" + i[0].slice(6,8) + "<br>" + i[1] + "円/1kg");
      })
      .on("mousemove", function(d) {
        tooltip
          .style("top", (d.clientY -20) + "px")
          .style("left", (d.clientX + 10) + "px");
      })
      .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden");
      });
  }
}

function show_graph_all() {
  make_svg();
  set_scale();
  show_axis();
  line_plot();
  scatter_plot();
}
