// Calendar Visualization with D3 and Year Selection

const monthsToNumbers = {
  "1": "01",
  "2": "02",
  "3": "03",
  "4": "04",
  "5": "05",
  "6": "06",
  "7": "07",
  "8": "08",
  "9": "09",
  "10": "10",
  "11": "11",
  "12": "12",
  "-": "-"
};

function calendar(){
    let dispatcher;
  function chart(){
  document.addEventListener('DOMContentLoaded', () => {
      const monthNames = [
          '1', '2', '3',
          '4', '5', '6',
          '7', '8', '9',
          '10', '11', '12'
      ];
  
      // Years to include in the selection
      const years = ['-', ...Array.from({ length: 9 }, (_, i) => 2016 + i)];
  
  
      // Select the calendar container in the HTML
      const calendarContainer = d3.select('#calendar');
  
      // Create a container for the entire calendar section
      const calendarWrapper = d3.select('#calendar').append('div')
          .style('display', 'flex')
         //  .style('gap', '0px');
  
      // Create year selection sidebar
      const yearSidebar = calendarWrapper.append('div')
          .attr('class', 'year-selection-sidebar')

      // Add "Select Year(s)" heading
      yearSidebar.append('div')
          .attr('class', 'calendar-heading')
          .text('Years');
  
      // Create year selection grid
      const yearGrid = yearSidebar.append('div')
          .style('display', 'grid')
         // .style('grid-template-columns', 'repeat(1, 1fr)');
          //.style('grid-gap', '0px');
  
      // Store selected years
      let selectedYears = [];
  
      // Function to toggle year selection
      function toggleYearSelection(year) {
          if (year === '-') {
              console.log("toggled")
              // If "-" is selected, clear other selections
              selectedYears = [];
              yearGrid.selectAll('.year-cell')
                  .style('background-color', d => d === '-' ? 'rgb(109, 46, 109)' : '#fff')
                  .style('color', d => d === '-' ? '#fff' : '#000');
          } else {
  
              // Toggle the specific year
              if (selectedYears.includes(year)) {
                  selectedYears = selectedYears.filter(y => y !== year);
                  console.log(selectedYears.length)
              } else {
                  selectedYears.push(year);
              }
  
              if(selectedYears.length == 0){
                console.log("toggling")
                toggleYearSelection('-')
              } else{
                // Update button styles
                yearGrid.selectAll('.year-cell')
                    .style('background-color', d => {
                        if (d === '-') return '#fff';
                        return selectedYears.includes(d) ? 'rgb(109, 46, 109)' : '#fff';
                    })
                    .style('color', d => {
                        if (d === '-') return '#000';
                        return selectedYears.includes(d) ? '#fff' : '#000';
                    });
                }
          }
  
          // Update calendar based on selected years
          updateCalendar();
          dispatchProtocol();
      }
  
      // Create year selection buttons
      yearGrid.selectAll('.year-cell')
          .data(years)
          .enter()
          .append('div')
          .attr('class', 'year-cell')
          .style('background-color', d => d === '-' ? 'rgb(109, 46, 109)' : '#fff')
          .style('color', d => d === '-' ? '#fff' : '#000')
          .text(d => d)
          .on('click', function(d) {
              toggleYearSelection(d);
              dispatchProtocol();
          });
  
      // Create a container for the calendar grid
      const calendarContent = calendarWrapper.append('div')
          .attr('class', 'year-selection-sidebar')
          .style('flex-grow', '1')
          .style('position', 'relative'); // For positioning reset button
  
      // Add reset button
      const resetButton = calendarContent.append('div')
          .attr('class', 'reset-button')
          .text('Reset')
          .on('click', () => {
              toggleYearSelection('-');
              toggleMonthSelection('-');
              dispatchProtocol();
          });
  
      // Function to update calendar
      let selectedMonths = [];
      function updateCalendar() {
          const currentYear = selectedYears.includes('-') ? '-' : selectedYears.join(', ');
          createCalendar(currentYear);
      }
  
      // Function to create the calendar
      function createCalendar(year) {
          // Clear any existing calendar
          calendarContent.selectAll('*').filter(':not(.reset-button)').remove();
  
          // Create year heading
          calendarContent.append('div')
              .attr('class', 'calendar-heading')
              .text('Months');
  
          // Create a grid for months
          const monthGrid = calendarContent.append('div')

          // Create month cells, starting with "-"
          const monthCells = monthGrid.selectAll('.month-cell')
              .data(['-', ...monthNames])
              .enter()
              .append('div')
              .attr('class', 'month-cell')
              .style('background-color', d => {
                  if (d === '-') {
                      return selectedMonths.length === 0 || selectedMonths.length === monthNames.length 
                          ? 'rgb(109, 46, 109)' 
                          : '#fff';
                  }
                  return selectedMonths.includes(d) ? 'rgb(109, 46, 109)' : '#fff';
              })
              .style('color', d => {
                  if (d === '-') {
                      return selectedMonths.length === 0 || selectedMonths.length === monthNames.length 
                          ? '#fff' 
                          : '#000';
                  }
                  return selectedMonths.includes(d) ? '#fff' : '#000';
              })
              .text(d => d)
              .on('click', function(d) {
                  toggleMonthSelection(d);
                  dispatchProtocol()

                 
              });
      }

    
      /**
       * processes year and month before actually dispatching
       * @param {*} year 
       * @param {*} month 
       */
      function dispatchProtocol(){
                
                console.log(selectedYears, selectedMonths);
                  //if(selectedMonths[0] === "-" || selectedMonths.length == 0){
                  //  console.log("clearing!" + "yaer: " + year + "month: " + month + " :D")
                    //dispatchMonth("CLEAR")
                  //}
                  console.log("updating!" + ":D")

                  dispatcher.call("calendarUpdated", this, (selectedYears).join() + "|" + selectedMonths.map((x) => monthsToNumbers[x]).join());

      }
  
  
  
  
      // Function to toggle month selection
      function toggleMonthSelection(month) {
          if (month === '-') {
              // If "-" is selected, clear other selections
              selectedMonths = [];
              updateMonthStyles();
          } else {
              // Remove "-" from considerations
              const allMonthsIndex = selectedMonths.indexOf('-');
              if (allMonthsIndex > -1) {
                  selectedMonths.splice(allMonthsIndex, 1);
              }
  
              // Toggle the specific month
              if (selectedMonths.includes(month)) {
                  selectedMonths = selectedMonths.filter(m => m !== month);
              } else {
                  selectedMonths.push(month);
              }
  
              updateMonthStyles();
          }
      }
  
      // Function to update month styles
      function updateMonthStyles() {
          calendarContent.selectAll('.month-cell')
              .style('background-color', d => {
                  if (d === '-') {
                      return selectedMonths.length === 0 || selectedMonths.length === monthNames.length 
                          ? 'rgb(109, 46, 109)' 
                          : '#fff';
                  }
                  return selectedMonths.includes(d) ? 'rgb(109, 46, 109)' : '#fff';
              })
              .style('color', d => {
                  if (d === '-') {
                      return selectedMonths.length === 0 || selectedMonths.length === monthNames.length 
                          ? '#fff' 
                          : '#000';
                  }
                  return selectedMonths.includes(d) ? '#fff' : '#000';
              });
      }
  
      // Initialize calendar with "-" and "-"
      createCalendar('-');
  });
    }
    chart.selectionDispatcher = function (_) {
      if (!arguments.length) return dispatcher;
      dispatcher = _;
      return chart;
    };
    return chart;
  
  
  }  