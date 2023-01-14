const svgEl = document.getElementById('barchart')
const width = svgEl.getAttribute('width')
const height = svgEl.getAttribute('height')
const padding = 100
// selezioniamo l'area svg
const svg = d3.select('#barchart')
const color1 = 'green'
const color2 = 'purple'
const textColor = '#194d30'
const pieRadius = 30
const hpadding = 60
const wpadding = 80

// definiamo l'are svg.
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
	var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	};
}

const describeArc = (x, y, radius, startAngle, endAngle) => {

	var start = polarToCartesian(x, y, radius, endAngle)
	var end = polarToCartesian(x, y, radius, startAngle)

	var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

	var d = [
	    "M", start.x, start.y, 
	    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
	].join(" ")

	return d + `L ${x} ${y} Z`       
}

// preleviamo i dati dal dataset.
const data = d3.csvParse(dataset, d => {
	return {
		companyType : d.companyType,
		nCompanies : +d.nCompanies,
		percControlled : +d.percControlled,
		evasion : +d.evasion
	}
})

console.log(data)

//---------------------------------------------------------------------------

//---------------------------------------------------------------------------

const xScale=d3.scaleLinear()
	.domain([0,data.length])
	.range([wpadding,width-wpadding])


const yScale=d3.scaleLinear()
	.domain([0,d3.max(data, d => d.evasion)])
	.range([height-hpadding,hpadding])

const yAxis=d3.axisLeft(yScale)
	.ticks(22)
	.tickSize(-(width-(wpadding*2)))

const yTicks = svg
	.append('g')
	.attr('transform', `translate(${wpadding}, 0)`)
	.call(yAxis)

	console.log(xScale(0))

svg
	.selectAll('.tick line')
	.style('stroke', '#D3D3D3')

svg
	.selectAll('.tick text')
	.style('color', textColor)

svg
	.selectAll('path.domain')
	.style('stroke-width', 0)

// Realizzazione dei grafici a torta
const arc = describeArc(300, 300, 100, 20, 100)
	
const Pies = svg
	.selectAll('g.stringa')
	.data(data)
	.enter()
	.append('g')
		.attr('class', 'stringa')
		.attr('transform',(d,i) => `translate(${xScale(i)}, ${yScale(d.evasion)})`)
	

const P_charts = Pies
 	.append('circle')
 		.attr('cx', wpadding)
 		.attr('cy', 0)
 		.attr('r',pieRadius)
 		.attr('fill',color1) 

const arcs = Pies
 	.append('path')
		.attr('d', d => describeArc((wpadding), 0, pieRadius, 0, (d.percControlled * 360)))
		.attr('fill', color2)

const TextType = Pies
	.append('text')
	.text(function(d){ return d.companyType})
	.attr("transform", `translate(${wpadding}, ${1.5 * pieRadius})`)
	.style("text-anchor", "middle")
	.style("font-size", 14)

const PercText = Pies
	.append('text')
	.text(function(d){ return d.percControlled + '%'})
	.attr("transform", `translate(${ pieRadius+ wpadding}, -20)`)

// creazione della legenda.
var color = d3.scaleOrdinal()
	.domain(data)
	.range(d3.schemeSet2);

svg.selectAll("first_dot")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", 400)
	.attr("cy", 20)
	.attr("r", 7)
	.style("fill", color1)

svg.selectAll("second_dot")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", 400)
	.attr("cy", 45)
	.attr("r", 7)
	.style("fill", color2)

svg.selectAll("first_text")
	.data(data)
	.enter()
	.append("text")
	.attr("x", 420)
	.attr("y", 20)
	.style("fill", color1)
	.text("Soldi evasi (in miliardi di euro)")
	.attr("text-anchor", "right")
	.style("alignment-baseline", "middle")

svg.selectAll("second_text")
	.data(data)
	.enter()
	.append("text")
	.attr("x", 420)
	.attr("y", 45)
	.style("fill", color2)
	.text("Controllati")
	.attr("text-anchor", "right")
	.style("alignment-baseline", "middle")

console.log(describeArc((wpadding + xScale(0)),yScale(data[0].evasion), pieRadius, 0, (data[0].percControlled * 360)))