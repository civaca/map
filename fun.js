document.addEventListener("DOMContentLoaded",()=>{
//fetching data
 Promise.all([
    fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json").then(response=>response.json()),
    fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json").then(response=>response.json())
   ]).then((data)=>{

    
//constants
const w=1000;
const h=700;
const w1=400;
//creating svg
const svg=d3.select("body")
            .append("svg")
            .attr("width",w)
            .attr("height",h)

//creating tooltip
const tooltip=d3.select("body")
            .append("div")
            .attr("id","tooltip")


 //scaleColor 

 const colorScale=d3.scaleQuantize().domain(d3.extent(data[1],d=>d["bachelorsOrHigher"]))//ColorsScale
        .range(['#0066CC', '#99CCFF', '#CCE5FF', '#FFFF99','#FF9933','#FFB266','#FF3333'])

const legendScale=d3.scaleQuantile().domain(d3.extent(data[1],d=>d["bachelorsOrHigher"]))
        .range([w1/7,2*w1/7,3*w1/7,4*w1/7,5*w1/7,6*w1/7,7*w1/7,])
//creating MAP
        svg.selectAll("path")
        .data(topojson.feature(data[0], data[0].objects.counties).features)
        .enter()
        .append("path")
        .attr("d", d3.geoPath())
        .attr("class","county")
        .attr("fill",d=>{
         return colorScale( data[1].filter((item)=>item.fips === d.id)[0]["bachelorsOrHigher"])
          })
        .attr("data-fips",d=>{
            return data[1].filter((item)=>item.fips === d.id)[0]["fips"]

        })
        .attr("data-education",d=>{
            return data[1].filter((item)=>item.fips === d.id)[0]["bachelorsOrHigher"]
        })
        .on("mouseenter",(event,d)=>{
            let info=data[1].filter((item)=>item.fips === d.id)[0]

            tooltip.style("visibility","visible")
            .style("top", event.clientY+"px")
            .style("left", event.clientX+10+"px")
            .attr("data-education", info["bachelorsOrHigher"])
            .html(
                "<p>"+info["bachelorsOrHigher"]+"%</p>"+
                "<p>"+info["area_name"]+"</p>"
            )
           
        })
        .on("mouseleave",(event,d)=>{
            tooltip.style("visibility","hidden")
        })

//add legend 

        svg.append("g")
        .attr("id","legend")
        .selectAll("rect")
        .data(data[1])
        .enter()
        .append("rect")
        .attr("x",d=>legendScale(d["bachelorsOrHigher"])+w1)
        .attr("y",10)
        .attr("width",(d)=>w1/7)
        .attr("height",20)
        .attr("fill",d=>colorScale(d["bachelorsOrHigher"]))
        
          
// axis 
const xAxis=d3.axisBottom(legendScale).tickValues([legendScale.domain()[0],...legendScale.quantiles()]).tickFormat(d=>d.toFixed(2)+"%")
        svg.append("g")
        .attr("transform","translate("+(w1)+","+30+")")
        .call(xAxis)

    })//Promise Closed
})//document loaded