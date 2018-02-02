const svg = d3.select('svg')
const width = +svg.attr('width')
const height = +svg.attr('height')
const radius = Math.min(width, height) / 2
const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)
const color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])

const pie = d3.pie()
	.sort(null)
	.value(d => d.population)


const path = d3.arc()
	.outerRadius(radius - 10)
	.innerRadius(0)

const label = d3.arc()
	.outerRadius(radius - 40)
	.innerRadius(radius - 40)

const data = [
{ age: '<5', population: 2704659 },
{ age: '5-13', population: 4499890 },
{ age: '14-17', population: 2159981 },
{ age: '18-24', population: 3853788 },
{ age: '25-44', population: 14106543 },
{ age: '45-64', population: 8819342 },
{ age: '≥65', population: 612463 },
]


const arc = g.selectAll('.arc')
.data(pie(data))
.enter()
.append('g')
.attr('class', 'arc')

arc.append('path')
	.attr('d', path)
	.attr('fill', d => color(d.data.age))

arc.append('text')
	.attr("transform", d => "translate(" + label.centroid(d) + ")")
  .attr("dy", "0.35em")
	.text(function(d) { return d.data.age; });


