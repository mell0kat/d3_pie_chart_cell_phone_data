const svg = d3.select('svg')
const width = +svg.attr('width')
const height = +svg.attr('height')
const radius = Math.min(width, height) / 2
const animatePieSegmentTime = 400
const balloons = ['./images/Blue_Balloon.svg', './images/Red_Balloon.svg', './images/Green_Balloon.svg']
const totalPieAnimationTime = (dataLength) => dataLength * animatePieSegmentTime

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

/*

MONTH SELECTION

*/

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

/*

BANNER AND BALLOONS

*/
const findWinners = (data) => {
	return data.reduce((max, curr) => {
		if (curr.usage == max.usage) {
			return { winners: max.winners.concat(curr.member), usage: curr.usage }
		} else if (curr.usage > max.usage) {
			return { winners: [curr.member], usage: curr.usage}
		} else if (curr.usage < max.usage) {
			return max
		}
	}, { usage: 0, winners: [] })
}

const makeBalloons = (data, month) => {

	d3.select('body')
		.selectAll('img')
		.data(balloons)
		.enter()
		.append('img')
		.attr('src', d => d)
		.style('position', 'fixed')
		.style('top', '-500px')
		.style('right', (d, i) => `${(300 * i + 20)}px`)
		.transition()
		.delay((d, i) => totalPieAnimationTime(data.length) + (i * animatePieSegmentTime))
		.duration(totalPieAnimationTime(data.length))
		.style('top', '700px')

	d3.select('div.banner')
		.style('display', 'none')
		.text(`Congrats ${findWinners(data).winners.join(' and ')} ! You win the award for most data used in the month of ${month}`)
		.transition()
		.style('display', 'block')
		.delay(totalPieAnimationTime(data.length))
}

const resetBalloons = () => {
		d3.selectAll('img')
			.remove()
}

/*

PIE RENDER

*/

const pie = d3.pie()
	.sort(null)
	.value(d => d.usage)

const path = d3.arc()
	.outerRadius(radius - 10)
	.innerRadius(0)

const label = d3.arc()
	.outerRadius(radius - 40)
	.innerRadius(radius - 40)

const renderPie = (month, initialRender = false) => {

	if (!initialRender) {
		const otherPies = d3.selectAll('g')
		otherPies.remove()
		resetBalloons()
	}

	const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)

	const color = d3.scaleLinear()
		.domain([0, d3.max(data[month], d => d.usage) + .25*(d3.max(data[month], d => d.usage))])
		.interpolate(d3.interpolateRgb)
		.range(colorMap[month])

	const arc = g.selectAll('.arc')
		.sort((a,b) => (a.usage - b.usage))
		.data(pie(data[month]))
		.enter()
		.filter(d => d.data.usage > 0.05)
		.append('g')
		.attr('class', 'arc')

	arc.append('path')
		//.attr('d', path)
		.attr('fill', d => color(d.data.usage))
		.transition()
		.delay((d, i) => i * animatePieSegmentTime)
		.attrTween('d', d => {
			const i = d3.interpolate(d.startAngle + 0.1, d.endAngle)
			return t => {
				d.endAngle = i(t)
				return path(d)
			}
		})

	arc.append('text')
		.attr("transform", d => "translate(" + label.centroid(d) + ")")
		.style('opacity', 0)
	  .attr("dy", "0.35em")
		.text(function(d) { return `${d.data.usage}GB`; })
		.transition()
		.delay((d, i) => i * animatePieSegmentTime)
		.style('opacity', 1)


	arc.append('text')
		.attr("transform", d => "translate(" + label.centroid(d) + ")")
		.attr("dy", "-1em")
		.style('opacity', 0)
		.text(function(d) { return d.data.member })
		.transition()
		.delay((d, i) => i * animatePieSegmentTime)
		.style('opacity', 1)

	makeBalloons(data[month], month)
}

document.addEventListener("DOMContentLoaded", () => {
	console.log('Page loaded')
	/* Initial render */
	renderPie(d3.keys(data)[0], true)
})
