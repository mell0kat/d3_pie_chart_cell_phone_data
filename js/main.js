const svg = d3.select('svg')
const body = d3.select('body')
const width = +svg.attr('width')
const height = +svg.attr('height')
const radius = Math.min(width, height) / 2

const data = {
	'October': [
		{ member: 'Robby', usage: 3.2 },
		{ member: 'Billy', usage: 4.4 },
		{ member: 'Betsy', usage: 4.4 },
		{ member: 'Katherine', usage: 0.9 },
		{ member: 'Willy', usage: 0.1 },
		{ member: 'Pam', usage: 1.0 },
	],
	'November': [
		{ member: 'Robby', usage: 1.7 },
		{ member: 'Billy', usage: 3.6 },
		{ member: 'Betsy', usage: 5.3 },
		{ member: 'Katherine', usage: 1.4 },
		{ member: 'Willy', usage: 0.0 },
		{ member: 'Pam', usage: 1.3 },
	],
	'December': [
		{ member: 'Robby', usage: 1.4 },
		{ member: 'Billy', usage: 2.6 },
		{ member: 'Betsy', usage: 6.3 },
		{ member: 'Katherine', usage: 0.9 },
		{ member: 'Willy', usage: 0.1 },
		{ member: 'Pam', usage: 2.4 },
	]
}

const colorMap = {
	October: ["#fff0f6", "#520339"],
	November: ["#fcffe6", "#254000"],
	December: ["#e6f7ff", "#002766"],
}

const onchange = () => {
	const selectValue = d3.select('select')
		.property('value')
	renderPie(selectValue)
}

const select = d3.select('select')
	.attr('class', 'select')
	.on('change', onchange)

const options = select
	.selectAll('option')
	.data(d3.keys(data))
	.enter()
	.append('option')
	.text(d => d)

console.log('options', options)


const pie = d3.pie()
	.sort(null)
	.value(d => d.usage)


const path = d3.arc()
	.outerRadius(radius - 10)
	.innerRadius(0)

const label = d3.arc()
	.outerRadius(radius - 40)
	.innerRadius(radius - 40)






const renderPie = (month) => {

	const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)

	const color = d3.scaleLinear()
		.domain([0, d3.max(data[month], d => d.usage) + .25*(d3.max(data[month], d => d.usage))])
		.interpolate(d3.interpolateRgb)
		.range(colorMap[month])

	const arc = g.selectAll('.arc')
		.data(pie(data[month]))
		.enter()
		.filter(d => d.data.usage > 0.05)
		.append('g')
		.attr('class', 'arc')

	arc.append('path')
		.attr('d', path)
		.attr('fill', d => color(d.data.usage))

	arc.append('text')
		.attr("transform", d => "translate(" + label.centroid(d) + ")")
	  .attr("dy", "0.35em")
		.text(function(d) { return d.data.member; });

}

renderPie(d3.keys(data)[0])
