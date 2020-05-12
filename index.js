let url='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
let xml= new XMLHttpRequest()
xml.open('GET',url,true)
xml.send()
xml.onload=()=>{
    let json = JSON.parse(xml.responseText)
    let padding=50;
    let w=950;
    let h=800;
    let year=json.map((i)=>{
        return i.Year
    })
    
    let time=json.map((i)=>{
        var d=d3.timeParse("%M:%S");
        let arr=d(i.Time)
        return arr
    })
    
    let k=d3.timeFormat('%M:%S')
    
    let xScale=d3.scaleLinear().domain([d3.min(year)-1,d3.max(year)+1]).range([padding, w - padding]);
    let yScale=d3.scaleTime().domain(d3.extent(time)).range([padding,h-padding]);
    let xAxis=d3.axisBottom(xScale).tickFormat(d3.format('d'));
    let yAxis=d3.axisLeft(yScale).tickFormat(k);
    let tool=d3.select('.let').append('div').attr('id','tooltip')
    let svg=d3.select('.let').append('svg').attr('width',w).attr('height',h).attr('class','scatter');
    svg.append('text').text('A scatter plot for highest time of cyclists').attr('id','title').attr('x',(w-padding)/3).attr('y',padding);
    
    svg.selectAll('.dot').data(json).enter().append('circle')
    .attr('cx', (d,i)=>xScale(year[i]))
    .attr('cy',(d,i)=>yScale(time[i]))
    .attr('r',7).attr('fill',(d)=>{
        if(d.Doping===''){
            return '#00695C'
        }
        else{
            return '#F50057'
        }
    }).style('opacity','0.75').attr('class','dot').attr('data-xvalue',(d,i)=>year[i]).attr('data-yvalue',(d,i)=>time[i].toISOString())
    
    .on('mouseover',(d,i)=>{
        tool.style('display','inline-block')
            .attr('data-year',year[i])
            .style('background-color','#B2DFDB')
            .style('color','black')
            .style('opacity',1)
            .html(d.Name+' from '+d.Nationality+' country in the Year: '+d.Year+', and clocked time- '+d.Time+'.  Allegations: '+d.Doping)
    })
    .on('mouseout',(d)=>{
        tool.style('display','inline-block')
            .style('opacity',0)
            .html()
    })
    //console.log(json)
    d3.select('.let').selectAll('circle').data(json).append('title').text((d)=>d.Name+' from '+d.Nationality+'\nYear: '+d.Year+', Time: '+d.Time+'\n'+d.Doping).style('fill','#B2DFDB')
    let legend=['pink','green']
    svg.selectAll('rect').data(legend).enter().append('rect').attr('x',700).attr('y',(d,i)=>150+(i*20)).attr('height',20).attr('width',20).style('fill',(d)=>{
        if(d=='pink'){
            return '#F50057'
        }
        else{
            return '#00695C'
        }
    }).attr('opacity','0.75').attr('id','legend').append('title').text((d)=>{
        if(d=='green'){
            return 'No doping allegations'
        }
        else{
            return 'Riders with doping allegations'
        }
    })
    svg.append('text').text('Riders with doping allegations').attr('x',730).attr('y',165).style('font-size','15px')
    svg.append('text').text('No doping allegations').attr('x',730).attr('y',185).style('font-size','15px')
    svg.append('g').attr('transform','translate(0,'+(h-padding)+')').attr('id','x-axis').call(xAxis);
    svg.append('g').attr('transform','translate('+(padding)+',0)').attr('id','y-axis').call(yAxis); 
    
}
