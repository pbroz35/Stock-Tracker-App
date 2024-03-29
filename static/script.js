// Load tickers from local storage or initialize as an empty array
var tickers = JSON.parse(localStorage.getItem('tickers')) || [];
// Store the last fetched prices for each ticker
var lastPrices = {};
// Counter for the update cycle
var counter = 15;

// Function to start the update cycle
function startUpdateCycle() {
    // Initial update of prices
    updatePrices();
    // Set interval to update prices every second
    setInterval(function () {
        counter--;
        $('#counter').text(counter); // Update the counter display
        if (counter <= 0) {
            // Update prices when counter reaches zero and reset counter
            updatePrices();
            counter = 15;
        }
    }, 1000);
}

$(document).ready(function () {
    // Add existing tickers to the grid on page load
    tickers.forEach(function (ticker) {
        addTickerToGrid(ticker);
    })

    // Initial update of prices on page load
    updatePrices();

    // Handle form submission to add new ticker
    $('#add-ticker-form').submit(function (e) {
        e.preventDefault();
        var newTicker = $('#new-ticker').val().toUpperCase();
        if (!tickers.includes(newTicker)) {
            // Add new ticker to tickers array and local storage
            tickers.push(newTicker);
            localStorage.setItem('tickers', JSON.stringify(tickers))
            addTickerToGrid(newTicker)
        }

        $('#new-ticker').val(''); // Clear input field
        updatePrices(); // Update prices after adding new ticker
    });

    // Handle click event to remove ticker
    $('#tickers-grid').on('click', '.remove-btn', function () {
        var tickerToRemove = $(this).data('ticker');
        // Filter out the ticker to be removed from tickers array
        tickers = tickers.filter(t => t !== tickerToRemove);
        localStorage.setItem('tickers', JSON.stringify(tickers))
        $(`#${tickerToRemove}`).remove(); // Remove ticker from grid
    });

    // Start the update cycle
    startUpdateCycle();

});

// Function to add ticker to the grid
function addTickerToGrid(ticker) {
    $('#tickers-grid').append(`<div id="${ticker}" class="stock-box"><h2>${ticker}</h2><p id="${ticker}-price"></p><p id="${ticker}-pct"></p><button class="remove-btn" data-ticker="${ticker}">Remove</button></div>`);
}

// Function to update prices for all tickers
function updatePrices() {

    // Iterate through each ticker in the tickers array
    tickers.forEach(function (ticker) {

        // Send an AJAX request to fetch stock data for the current ticker
        $.ajax({
            url: '/get_stock_data',
            type: 'POST',
            data: JSON.stringify({ 'ticker': ticker }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {

                // Calculate the percentage change in price
                var changePercent = ((data.currentPrice - data.openPrice) / data.openPrice) * 100;
                var colorClass;

                // Determine the color class based on the price change percentage
                if (changePercent <= -2) {
                    colorClass = 'dark-red';
                } else if (changePercent < 0) {
                    colorClass = 'red';
                } else if (changePercent == 0) {
                    colorClass = 'gray';
                } else if (changePercent <= 2) {
                    colorClass = 'green';
                } else {
                    colorClass = 'dark-green';
                }

                // Update the displayed price and percentage change for the ticker
                $(`#${ticker}-price`).text(`$${data.currentPrice.toFixed(2)}`);
                $(`#${ticker}-pct`).text(`${changePercent.toFixed(2)}%`);
                $(`#${ticker}-price`).removeClass('dark-red red gray green dark-green');
                $(`#${ticker}-pct`).removeClass('dark-red red gray green dark-green');

                var flashClass;

                // Determine the flash class based on the change in price compared to the last fetched price
                if (lastPrices[ticker] > data.currentPrice) {
                    flashClass = 'red-flash';
                } else if (lastPrices[ticker] < data.currentPrice) {
                    flashClass = 'green-flash';
                } else {
                    flashClass = 'gray-flash';
                }

                // Update the last fetched price for the current ticker
                lastPrices[ticker] = data.currentPrice;

                // Add the flash class to the ticker element for a visual effect
                $(`#${ticker}`).addClass(flashClass);

                // Remove the flash class after 1000 milliseconds (1 second) for a brief visual effect
                setTimeout(function () {
                    $(`#${ticker}`).removeClass(flashClass);
                }, 1000);
            }
        });
    });
}
