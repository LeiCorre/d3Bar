import React from 'react';
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import './App.css';


// used answer from https://stackoverflow.com/questions/27530462/tag-error-react-jsx-style-tag-error-on-render by Sebastian to show me how to place CSS styling directly in App.js
const hov = `
      body {
        font-size: 16px
      }
      .bar:hover {
            fill: azure;
}
      #title {
        text-align: center;
        font-size: 50px;
        font-weight: 500
      }
      svg {
        margin-top: -100px
      }

      #tooltip {
        background-color: rgb(255, 204, 255, 0.7);
        box-shadow: 0 0 5px 3px rgb(15, 15, 15, 0.8);
        font-size: 16px;
        float: right;
        height: 40px;
        border-radius: 10px;
        width: 120px;
        text-align: center;
        padding-top: 10px;
        padding-bottom: 10px;
        z-index: 999;
        position: absolute;
        top: 90px;
      }

     
`

const req = new XMLHttpRequest();
    req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true)
    req.send()
    req.onload = function() {
      let json = JSON.parse(req.responseText);
  
      const w = 1000;
      const h = 600;
      const p = 100;
      const dataL = json['data'].length
  
      d3.select('.App').append('h1').text("United States GDP").attr('id', 'title')
     

      const xScale = d3.scaleTime()
                       .domain([new Date(1947, 1, 1), new Date(d3.max(json['data'], (d) => d[0])) ])
                       .range([p, w-p])

      const yScale = d3.scaleLinear()
                       .domain([0, d3.max(json['data'], (d)=> d[1])])
                       .range([h-p, p])

      const svg = d3.select('.App')
                    .append('svg')
                    .attr('height', h)
                    .attr('width', w);

  let box = d3.select('body').append('div').text('hello').attr('id', 'tooltip').style('display', 'none'); //inspired by the last answer on this post (https://www.freecodecamp.org/forum/t/d3-tooltip-wanted-is-that-15-chars-now/92398/6)    

      svg.selectAll('rect')
         .data(json['data']) 
         .enter()    
         .append('rect')
         .attr('x', (d,i) => p + i * (w-p*2)/dataL) 
         .attr('y', (d,i) => h-(h-yScale(d[1])-p) - p)
         .attr('width', 2.8)
         .attr('height', (d, i) => h-yScale(d[1])-p )
         .attr('data-date', (d) => d[0])
         .attr('data-gdp', (d) => d[1])
         .attr('fill', 'purple')
         .attr('class', 'bar')
         
         .on('mouseover', function() {
           box = box.attr('data-date', this.getAttribute('data-date')) 
                    .style('display', 'inline')
                    .style('transform', (i) => "translate(" + this.getAttribute('x') + "px" + "," + (h-p*2.5) + "px)")
                    .text((e) => this.getAttribute('data-date') + "\n\n " +  this.getAttribute('data-gdp') + ' Billion' ) })
                             
         .on('mouseout', function (e) {
           box = box.style('display', 'none')
         })
      
      const xA = d3.axisBottom(xScale)
 
      const yA = d3.axisLeft(yScale)

      svg.append('g')
         .attr('transform', "translate(0," + (h-p) + ")")
         .attr('id', 'x-axis')
         .call(xA)
  
      svg.append('g') 
         .attr('transform', "translate(" + p + ",0)")  
         .attr('id', 'y-axis')
         .call(yA) 


      
        


}


class App extends React.Component {
 
  render() {
    return (
    
    
    <div className="App">
      <div id='info' />
      <style> {hov}</style>
      <a href='https://stackoverflow.com/questions/27530462/tag-error-react-jsx-style-tag-error-on-render'>CSS Styling Reference</a> | <a href='https://www.freecodecamp.org/forum/t/d3-tooltip-wanted-is-that-15-chars-now/92398/6'>Tooltip Reference</a> | Coded by Lei Corre &hearts;
    </div>
  );
}
}



ReactDOM.render(<App />, document.getElementById('root'))
export default App;
