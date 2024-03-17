
var tickers = JSON.parse(localStorage.getItem('tickers')) || [];
var lastPrices = {};
var counter = 15;

// Will update the prices
function startUpdateCycle() {
    updatePrices();
    var countdown = setInterval(function() {
        counter--;
        $('#counter').text(counter);
        if (counter <= 0) {
            updatePrices();
            counter = 15;
        }
    }, 1000); 
}

$(document).ready(function (){

    tickers.forEach(function(ticker){
        addTickerToGrid();
    })

    updatePrices();

    $('add-ticker-form').submit(function(e){
        e.preventDefault();
        var newTicker = $('#new-ticker')
    })

    
})
    
