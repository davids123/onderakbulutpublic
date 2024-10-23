<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slider with 60 Seconds Timer</title>
    <style>
        body {
            background-color: #1b1b1b;
            color: white;
            font-family: Arial, sans-serif;
        }

        .slider-container {
            position: relative;
            width: 300px;
            margin: 100px auto;
            text-align: center;
        }

        .range-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 10px;
            background: #ddd;
            border-radius: 5px;
            outline: none;
            margin-top: 20px;
        }

        .range-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #333;
            border-radius: 50%;
            cursor: pointer;
        }

        .range-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #333;
            border-radius: 50%;
            cursor: pointer;
        }

        .range-labels {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
        }

        .range-labels span {
            font-size: 16px;
        }

        /* Timer display styling */
        .timer-display {
            margin-top: 20px;
            font-size: 24px;
        }
    </style>
</head>
<body>

    <div class="slider-container">
        <h2>Slider Timer (Milliseconds up to 60)</h2>
        <!-- Range Slider -->
        <input type="range" min="0" max="60" value="0" step="1" class="range-slider" id="slider">
        
        <!-- Labels on the sides -->
        <div class="range-labels">
            <span id="minValue">0</span>
            <span id="maxValue">6</span>
        </div>

        <!-- Timer display below the slider -->
        <div class="timer-display">
            <span>Time: </span>
            <span id="timeDisplay">0.00</span> seconds
        </div>
    </div>

    <script>
        const slider = document.getElementById('slider');
        const timeDisplay = document.getElementById('timeDisplay'); // Timer display element

        // let seconds = 0;
        // let milliseconds = 0;
        const maxSeconds = 60; // Ensure the timer stops at 60 seconds
        const intervalTime = 20.66; // Approximately 1/60th of a second (60 FPS)
        let timer; // Define the timer variable
        let isDragging = false; // Variable to track if slider is being dragged

        // Timer function to increment milliseconds and display time
        function startSliderTimer() {
            timer = setInterval(() => {
                if (!isDragging && seconds < maxSeconds) {
                    milliseconds++; // Increment milliseconds
                    if (milliseconds >= 60) {
                        milliseconds = 0;
                        seconds++; // Increment seconds when milliseconds hit 60
                    }
                    
                    if (seconds >= maxSeconds) {
                        clearInterval(timer); // Stop the timer at 60 seconds
                        milliseconds = 0;
                        seconds = maxSeconds; // Cap the value at 60
                    }

                    // Update slider and display
                    slider.value = seconds;
                    timeDisplay.textContent = `${seconds}.${milliseconds < 10 ? '0' : ''}${milliseconds}`;
                } 
            }, intervalTime); // 1 frame every 16.66 milliseconds
        }

        // Event listener: Start timer when the slider is clicked or dragged
        slider.addEventListener('mousedown', function() {
            isDragging = true; // Start dragging
            seconds = parseInt(slider.value); // Start from the current slider value
        });

        // Update time display while dragging
        slider.addEventListener('input', function() {
            seconds = parseInt(slider.value); // Update current value during drag
            milliseconds = 0; // Reset milliseconds during manual slider drag
            timeDisplay.textContent = `${seconds}.${milliseconds < 10 ? '0' : ''}${milliseconds}`; // Update display in real-time
        });

        // Stop dragging when the mouse is released
        slider.addEventListener('mouseup', function() {
            isDragging = false; // Stop dragging
            clearInterval(timer); // Stop the existing timer
            startSliderTimer(); // Start the timer again
        });

        // Stop the timer when mouse leaves the slider area
        slider.addEventListener('mouseleave', function() {
            isDragging = false; // Stop dragging
            clearInterval(timer); // Stop the timer
        });

        // Start the timer initially when the page loads
        startSliderTimer();
    </script>

</body>
</html>
