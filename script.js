var queues = [
    { id: "q1", maxSize: 10 },
    { id: "q2", maxSize: 20 },
    { id: "q3", maxSize: 30 }
];

var logTerminal = document.getElementById("logTerminal");
var globalIndex = 1;
var decreasedValue = document.getElementById("givenWeight");

function addCube() {
    // Get weight from input field
    var weight = parseInt(document.getElementById("weightInput").value);
	const q1MaxSize = queues.find(queue => queue.id === "q1").maxSize;
	const q2MaxSize = queues.find(queue => queue.id === "q2").maxSize;
	const q3MaxSize = queues.find(queue => queue.id === "q3").maxSize;

    // Validate that weight is a positive integer
    if (isNaN(weight) || weight <= 0) {
        alert("Please enter a valid positive integer for weight.");
        return;
    }

    // Call the function to add the cube to q1 with the global index if any queue still empty 
	if (q1.childElementCount < q1MaxSize || q2.childElementCount < q2MaxSize || q3.childElementCount < q3MaxSize) {
		addToQ1({ weight: weight, index: globalIndex++ });
	}else{
		alert("All Queues are full. Cannot add more cubes.");
		return;
	}
}

function addToQ1(cubeAttributes) {
    var q1 = document.getElementById("q1");

    // If no index is provided, use the next index
    if (!cubeAttributes.index) {
        cubeAttributes.index = q1.childElementCount + 1;
    }

    // If no color is provided, generate a random color
    if (!cubeAttributes.color) {
        cubeAttributes.color = getRandomColor();
    }

    // If q1 is full, move the first cube to q2 with its attributes
    if (q1.childElementCount === queues.find(queue => queue.id === "q1").maxSize) {
        var firstCube = q1.querySelector(".cube");
        q1.removeChild(firstCube);
		cube = getCubeAttributes(firstCube)
		 // Log the movement between queues in yellow
		logTerminal.innerHTML += `<span style="color: yellow;font-weight: bold;">  Movement from Queue 1 to Queue 2 Block: #${cube.index} </span>\n`;
		// Scroll to the bottom of the terminal
		logTerminal.scrollTop = logTerminal.scrollHeight;
        addToQ2(cube);
    }
	
	 // Create a new cube element
    var cube = createCube(cubeAttributes.weight, cubeAttributes.index, cubeAttributes.color);

    // Append the cube to q1
    q1.appendChild(cube);

    // Adjust spacing after adding the cube
    adjustQueueSpacing("q1");
}

function addToQ2(cubeAttributes) {
    var q2 = document.getElementById("q2");

    // If q2 is full, move the first cube to q3 with its attributes
    if (q2.childElementCount === queues.find(queue => queue.id === "q2").maxSize) {
        var firstCube = q2.querySelector(".cube");
        q2.removeChild(firstCube);
        addToQ3(getCubeAttributes(firstCube));
logTerminal.innerHTML += `<span style="color: yellow;font-weight: bold;">  Movement from Queue 2 to Queue 3 Block: #${firstCube.index} </span>\n`;
    }
	
	// Create a new cube element with attributes
    var cube = createCube(cubeAttributes.weight, cubeAttributes.index, cubeAttributes.color);
	
    // Append the cube to q2
    q2.appendChild(cube);

    // Adjust spacing after adding the cube
    adjustQueueSpacing("q2");
	// Scroll to the bottom of the terminal
	logTerminal.scrollTop = logTerminal.scrollHeight;
}

function addToQ3(cubeAttributes) {
    var q3 = document.getElementById("q3");

    // If q3 is full, alert an error
    if (q3.childElementCount === queues.find(queue => queue.id === "q3").maxSize) {
        alert("Queue Q3 is full. Cannot add more cubes.");
        return;
    }

    // Create a new cube element with attributes
    var cube = createCube(cubeAttributes.weight, cubeAttributes.index, cubeAttributes.color);

    // Append the cube to q3
    q3.appendChild(cube);

    // Adjust spacing after adding the cube
    adjustQueueSpacing("q3");
}


function getRandomColor() {
    // Generate a random hex color
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}

function getCubeAttributes(cube) {
    return {
        weight: parseInt(cube.querySelector(".lower").textContent),
        index: parseInt(cube.querySelector(".upper").textContent.substring(1)), // Extracting the index after "#"
        color: cube.querySelector(".lower").style.backgroundColor,
		age: parseInt(cycleCount - parseInt(cube.querySelector(".upper").textContent.substring(1)))
    };
}

function decreaseWeight(cubeList, givenWeight) {
    var allCubes = document.querySelectorAll(".cube");

    if (allCubes.length === 0) {
        return;
    }

    if (!givenWeight || givenWeight === 0) {
        givenWeight = decreasedValue;
    }

    var firstCubes;

    if (!cubeList || cubeList.length === 0) {
        // Find the cubes with the lowest index (i.e., the first cube)
        firstCubes = Array.from(allCubes).sort(function (a, b) {
            return parseInt(a.querySelector(".upper").textContent) - parseInt(b.querySelector(".upper").textContent);
        });
    } else {
        firstCubes = cubeList;
    }

    while (givenWeight > 0 && firstCubes.length !== 0) {
        var currentWeight = parseInt(firstCubes[0].querySelector(".lower").textContent);

        if (currentWeight > givenWeight) {
            // Decrease weight by the specified value
            firstCubes[0].querySelector(".lower").textContent = currentWeight - givenWeight;
            // Adjust the width based on the new weight
            firstCubes[0].style.width = (currentWeight - givenWeight < 4 ? 100 : (currentWeight - givenWeight) * 25) + "%";
            // Adjust spacing after decreasing the weight
            //var queueId = firstCubes[0].parentNode.id;
            // Log information for each cycle in red
			cubeAttributes = getCubeAttributes(firstCubes[0]);
            logTerminal.innerHTML += `<span style="color: red;font-weight: bold;">CPU Cycle ${cycleCount}:</span>\n`;
            // Log blocks removed in this cycle in red
            logTerminal.innerHTML += `<span style="color: red;font-weight: bold;">Block: #${cubeAttributes.index} Decreased By : ${givenWeight} (Weight)</span>\n`;

            adjustQueueSpacing("q1");
			adjustQueueSpacing("q2");
			adjustQueueSpacing("q3");
            break;
        } else if(currentWeight == givenWeight){
            // If weight equals givenWeight, remove the first cube
            //var queueId = firstCubes[0].parentNode.id;
			cubeAttributes = getCubeAttributes(firstCubes[0]);
            firstCubes[0].remove();
            // Log blocks removed in this cycle in red
            logTerminal.innerHTML += `<span style="color: red;font-weight: bold;">Block: #${cubeAttributes.index}Removed ${currentWeight} (Weight)</span>\n`;
            // Adjust spacing after decreasing the weight
            adjustQueueSpacing("q1");
			adjustQueueSpacing("q2");
			adjustQueueSpacing("q3");
            givenWeight = givenWeight - currentWeight;
            firstCubes.shift(); // Remove the first cube from the list
        }else{ break;}
    }
}

function getCubesInQueue(queueId, queueSelector) {
    const queueElement = document.getElementById(queueId);
    const queueBlocks = queueElement.querySelectorAll(".cube");

    if (queueSelector === "FCFS" || queueSelector === "RR") {
        // For FCFS or RR, return the queue blocks in the same order
        return Array.from(queueBlocks);
    } else if (queueSelector === "SJF") {
        // For SJF, return the queue blocks sorted by weight in ascending order
        return Array.from(queueBlocks).sort((a, b) => {
            const weightA = parseInt(a.querySelector(".lower").textContent);
            const weightB = parseInt(b.querySelector(".lower").textContent);
            return weightA - weightB;
        });
    } else {
        console.error("Invalid queueSelector value.");
        return [];
    }
}

function adjustQueueSpacing(queueId) {
    var cubes = document.getElementById(queueId).querySelectorAll(".cube");

    if (cubes.length > 0) {
        // Sort cubes by weight in descending order
        cubes = Array.from(cubes).sort(function (a, b) {
            return parseInt(b.querySelector(".lower").textContent) - parseInt(a.querySelector(".lower").textContent);
        });

        var totalWeight = 0;

        cubes.forEach(function (cube) {
            totalWeight += parseInt(cube.querySelector(".lower").textContent);
        });

        // Adjust the width of each cube based on the weight proportion
        cubes.forEach(function (cube) {
            var weight = parseInt(cube.querySelector(".lower").textContent);
            var percentageWidth = (weight / totalWeight) * 100;
            cube.style.width = percentageWidth + "%";
        });
    }
}



function cubeClickHandler(event) {
    const cube = event.currentTarget;
    const cubeAttributes = getCubeAttributes(cube);
    alert(`Cube Properties:
        Weight: ${cubeAttributes.weight}
        Index: ${cubeAttributes.index}
        Color: ${cubeAttributes.color}
        Age: ${cubeAttributes.age} cycle`);
	 // Set cube's index and weight in input fields
    document.getElementById("processId").value = cubeAttributes.index;
    document.getElementById("givenWeight").value = cubeAttributes.weight;
}

function createCube(weight, index, color) {
    const cube = document.createElement("div");
    cube.classList.add("cube");
    cube.style.cursor = "pointer"; // Change the cursor to a pointer to indicate clickability
    cube.addEventListener("click", cubeClickHandler); // Add click event listener

    const upper = document.createElement("div");
    upper.classList.add("upper");
    upper.textContent = "#" + index;
    cube.appendChild(upper);

    const lower = document.createElement("div");
    lower.classList.add("lower");
    lower.textContent = weight;
    lower.style.backgroundColor = color;
    cube.appendChild(lower);

    cube.style.width = weight < 4 ? "100%" : weight * 25 + "%";

    // Add a timestamp for creation time and age
    const timestamp = new Date();
    cube.dataset.creationTime = timestamp.getTime();
    cube.dataset.age = 0; // Initialize age as 0 seconds

    // Update age every second
    const ageInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        const creationTime = parseInt(cube.dataset.creationTime, 10);
        const age = Math.floor((currentTime - creationTime) / 1000); // Calculate age in seconds
        cube.dataset.age = age; // Update the age
    }, 1000);

    return cube;
}

function randomUpgradeDowngrade() {
    // Get references to the queues
    const q1 = document.getElementById("q1");
    const q2 = document.getElementById("q2");
    const q3 = document.getElementById("q3");

    // Generate random numbers (0 or 1) to decide between upgrade and between q1 to q2 or q2 to q3
    const moveType = Math.floor(Math.random() * 2); // 0 for upgrade, 1 for downgrade
	const targetQueue = moveType === 0 ? (Math.floor(Math.random() * 2) === 0? q2 : q1) : q2;
	var sourceQueue = q2;
	if( moveType == 1){
		sourceQueue = q1;
	}else if(targetQueue == q2){
		sourceQueue = q3;
	}
    // Check if sourceQueue is not full
    if (sourceQueue.childElementCount < queues.find(queue => queue.id === sourceQueue.id).maxSize) {
        if (targetQueue.childElementCount > 0) {
            // Move one block from sourceQueue to targetQueue
            const firstCube = targetQueue.querySelector(".cube");
            targetQueue.removeChild(firstCube);
			cubeAttributes = getCubeAttributes(firstCube);
            addToQueue(cubeAttributes, sourceQueue);
            // Log the movement between queues in purple
			if (moveType == 0){
				logTerminal.innerHTML += `<span style="color: purple;font-weight: bold;"> Process #${cubeAttributes.index} upgraded Between Queues: ${targetQueue.id} to ${sourceQueue.id}</span>\n\n`;
            }else{
				logTerminal.innerHTML += `<span style="color: purple;font-weight: bold;"> Process #${cubeAttributes.index} Downgraded Between Queues: ${targetQueue.id} to ${sourceQueue.id}</span>\n\n`;
			}
			// Scroll to the bottom of the terminal
            logTerminal.scrollTop = logTerminal.scrollHeight;
        }
    }
}

function decreaseWeightInQueue(queueId, qwpcElement, qValue) {
    const cubesInQueue = getCubesInQueue(queueId, "RR");

    for (let i = 0;i < qwpcElement.value; i++) {
        decreaseWeight([cubesInQueue[i%cubesInQueue.length]], qValue);
    }
}
// Helper function to add cube to the appropriate queue
function addToQueue(cubeAttributes, queue) {
    if (queue.id === "q1") {
        addToQ1(cubeAttributes);
    } else if (queue.id === "q2") {
        addToQ2(cubeAttributes);
    } else if (queue.id === "q3") {
        addToQ3(cubeAttributes);
    }
}

const q1SizeInput = document.getElementById("q1Size");
const q2SizeInput = document.getElementById("q2Size");
const q3SizeInput = document.getElementById("q3Size");
const runButton = document.getElementById("runButton");
const stopButton = document.getElementById("stopButton");
const speedRange = document.getElementById("speedRange");
const cycleCounter = document.getElementById("cycleCounter");

let insertInterval;
let cycleCount = 0;
document.addEventListener("DOMContentLoaded", function () {
    const runButton = document.getElementById("runButton");
	const stopButton = document.getElementById("stopButton");
    const speedRange = document.getElementById("speedRange");
	
    if (runButton) {
runButton.addEventListener("click", () => {
	var totalProcesses = document.getElementById("totalProcesses").value;
	var qValue = document.getElementById("qValue").value;
    // Disable inputs while running
    q1SizeInput.disabled = true;
    q2SizeInput.disabled = true;
    q3SizeInput.disabled = true;
    runButton.disabled = true;
    stopButton.disabled = false;
	
	queueSelector1.disabled = true;
	queueSelector2.disabled = true;
	queueSelector3.disabled = true;
	document.getElementById("qValue").disabled = true;
	document.getElementById("totalProcesses").disabled = true;

    const q1MaxSize = parseInt(q1SizeInput.value);
    const q2MaxSize = parseInt(q2SizeInput.value);
    const q3MaxSize = parseInt(q3SizeInput.value);
	

	
    let allowInsertion = true; // Flag to control insertion
	let done = false;
   function insertCube() {
    // Generate random weight between 0 and 100
    const randomWeight = Math.floor(Math.random() * 101);
	

    // Insert the cube into the first queue (q1) if insertion is allowed
    if (allowInsertion && (q1.childElementCount < q1MaxSize || q2.childElementCount < q2MaxSize || q3.childElementCount < q3MaxSize) && 
	!(done && q1.childElementCount == 0 && q2.childElementCount == 0 && q3.childElementCount == 0 )) {
		if (totalProcesses > 0){
			addToQ1({ weight: randomWeight, index: globalIndex++ });
		}
		totalProcesses --;
		done = true;
		
        // Log blocks added in this cycle in green
        logTerminal.innerHTML += `<span style="color: green;font-weight: bold;">\nAdded Blocks: ${randomWeight} (Weight)</span>\n`;
        // Increment cycle counter
        cycleCount++;
        cycleCounter.textContent = `Cycles: ${cycleCount}`;
        // Log information for each cycle in green
		addLogToTerminal(`<span style="color: green;font-weight: bold;">Cycle ${cycleCount}:</span>\n`);
        // Log the state of each queue in green
        queues.forEach((queue) => {
            const queueElement = document.getElementById(queue.id);
            const queueBlocks = queueElement.querySelectorAll(".cube");
            const blocksInfo = Array.from(queueBlocks).map((cube) => {
            const cubeAttributes = getCubeAttributes(cube);
                return `#${cubeAttributes.index} (${cubeAttributes.weight})`;
            });
            const totalWeight = Array.from(queueBlocks).reduce((sum, cube) => sum + parseInt(cube.querySelector(".lower").textContent), 0);
			addLogToTerminal(`<span style="color: green;font-weight: bold;">\n${queue.id} - Blocks: ${blocksInfo.join(", ")} - Total Weight: ${totalWeight}</span>\n\n`);
        });

        // Set flag to prevent further insertion
        allowInsertion = false;

        // Determine the delay based on the "Show Q Step" checkbox
        var delay = document.getElementById("showQStep").checked ? 500 / speedRange.value : 0;

        // Delay for 0.5 seconds and then call decreaseWeight three times

		const queueSelector1 = document.getElementById("queueSelector1").value;
		const queueSelector2 = document.getElementById("queueSelector2").value;
		const queueSelector3 = document.getElementById("queueSelector3").value;
		const QWPC1 = document.getElementById("QWPC1");
		const QWPC2 = document.getElementById("QWPC2");
		const QWPC3 = document.getElementById("QWPC3");
        randomUpgradeDowngrade()
        setTimeout(() => {
		if(q1.childElementCount !=0){
	    if (queueSelector1 === "RR"){
    		decreaseWeightInQueue("q1", QWPC1, qValue)
		} else { 
            decreaseWeight(getCubesInQueue("q1", queueSelector1), qValue);
		} }
            setTimeout(() => {
				if(q2.childElementCount !=0){
                if (queueSelector2 === "RR"){
					decreaseWeightInQueue("q2", QWPC2, qValue)
				} else { 
					decreaseWeight(getCubesInQueue("q2", queueSelector2), qValue);
				} }
                setTimeout(() => {
					if(q3.childElementCount !=0){
					if (queueSelector3 === "RR"){
						decreaseWeightInQueue("q3", QWPC3, qValue)
					} else { 
						decreaseWeight(getCubesInQueue("q3", queueSelector3), qValue);
					} }
                    // Reset flag to allow insertion again
                    allowInsertion = true;
					randomUpgradeDowngrade()
                }, delay);
            }, delay);
        }, delay);
    } else {
        if (!(q1.childElementCount < q1MaxSize || q2.childElementCount < q2MaxSize || q3.childElementCount < q3MaxSize)) {
            clearInterval(insertInterval); // Stop when the first queue is full
            alert("The first queue is full. Insertion stopped.");
            // Enable inputs after stopping
            q1SizeInput.disabled = false;
            q2SizeInput.disabled = false;
            q3SizeInput.disabled = false;
            runButton.disabled = false;
            stopButton.disabled = true;
			
			queueSelector1.disabled = false;
			queueSelector2.disabled = false;
			queueSelector3.disabled = false;
			qValue.disabled = false;
			totalProcesses.disabled = false;
			
        } else if (totalProcesses == 0){
			clearInterval(insertInterval); // Stop when the first queue is full
			// Enable inputs after stopping
            q1SizeInput.disabled = false;
            q2SizeInput.disabled = false;
            q3SizeInput.disabled = false;
            runButton.disabled = false;
            stopButton.disabled = true;
			
			queueSelector1.disabled = false;
			queueSelector2.disabled = false;
			queueSelector3.disabled = false;
			qValue.disabled = false;
			totalProcesses.disabled = false;
		}
    }
}

    // Initial run
    insertInterval = setInterval(insertCube, 1000 / speedRange.value); // Insert a cube every (1000 ms / speed) milliseconds

    // Update speed range dynamically
    speedRange.addEventListener("input", () => {
        clearInterval(insertInterval); // Clear existing interval
        insertInterval = setInterval(insertCube, 1000 / speedRange.value); // Insert a cube every (1000 ms / speed) milliseconds
    });
});
}

	if (stopButton) {
		stopButton.addEventListener("click", () => {
		clearInterval(insertInterval);
		// Enable inputs after stopping
		q1SizeInput.disabled = false;
		q2SizeInput.disabled = false;
		q3SizeInput.disabled = false;
		runButton.disabled = false;
		stopButton.disabled = true;
		
		queueSelector1.disabled = false;
		queueSelector2.disabled = false;
		queueSelector3.disabled = false;
		qValue.disabled = false;
		totalProcesses.disabled = false;
});
	}
	
	if (speedRange) {
		speedRange.addEventListener("input", () => {
		clearInterval(insertInterval);
		const speed = speedRange.value;
		if (runButton.disabled) {
			// Restart insertion with new speed
			runButton.click();
		}
});
	}

});




function decreaseWeightFromToolMenu() {
    var processIdInput = document.getElementById("processId");
    var givenWeightInput = document.getElementById("givenWeight");

    var processId = processIdInput.value.trim();
    var givenWeight = parseInt(givenWeightInput.value);

    var allCubes = document.querySelectorAll(".cube");
    var targetCube;

    for (var i = 0; i < allCubes.length; i++) {
        var cube = allCubes[i];
        var cubeProcessId = cube.querySelector(".upper").textContent.substring(1);

        if (cubeProcessId === processId) {
            targetCube = cube;
            break;
        }
    }

    if (!targetCube) {
        alert("Cube with Process ID " + processId + " not found.");
        return;
    }

    decreaseWeight([targetCube], givenWeight);
}

function addLogToTerminal(log) {
    const logTerminal = document.getElementById("logTerminal");
    logTerminal.innerHTML += log + "\n";
}

document.getElementById("downloadButton").addEventListener("click", downloadLogs);

function downloadLogs() {
    const logTerminal = document.getElementById("logTerminal");

    // Default file format is "txt"
    const format = "txt";

    const logs = logTerminal.innerText;

    // Create a Blob containing the logs
    const blob = new Blob([logs], { type: `text/${format}` });

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `logs.${format}`;
    link.style.display = "none";

    // Append the link to the terminal container and trigger the download
    document.getElementById("terminalContainer").appendChild(link);
    link.click();

    // Remove the link from the terminal container
    document.getElementById("terminalContainer").removeChild(link);
}
function toggleDarkMode() {
    const body = document.body;
    const darkModeToggle = document.getElementById("darkModeToggle");

    if (darkModeToggle.checked) {
        body.classList.add("dark-mode");
    } else {
        body.classList.remove("dark-mode");
    }
}
function toggleDrawer() {
    const myDrawer = document.getElementById("myDrawer");

    if (myDrawer) {
        myDrawer.style.left = myDrawer.style.left === "0px" ? "-300px" : "0px";
    }
}


function FromToolMenu() {
        // Get values from the new inputs
        var queueSelector1 = document.getElementById("queueSelector1").value;
        var queueSelector2 = document.getElementById("queueSelector2").value;
        var queueSelector3 = document.getElementById("queueSelector3").value;

        
}




document.addEventListener('click', function (event) {
            // Close the dialog when clicking anywhere outside the input field or its dialog
            if (!event.target.classList.contains('info-icon') && !event.target.classList.contains('info-dialog')) {
                var allDialogs = document.querySelectorAll('.info-dialog');
                allDialogs.forEach(function (dialog) {
                    dialog.style.display = 'none';
                });
            }
        });

        function showInfo(infoId) {
            var infoDialog = document.getElementById(infoId);
            if (infoDialog.style.display === 'block') {
                infoDialog.style.display = 'none';
            } else {
                // Hide all other dialogs before showing the current one
                var allDialogs = document.querySelectorAll('.info-dialog');
                allDialogs.forEach(function (dialog) {
                    dialog.style.display = 'none';
                });

                infoDialog.style.display = 'block';
            }
        }
		
		
		const queueSelector1 = document.getElementById("queueSelector1").value;
const queueSelector2 = document.getElementById("queueSelector2").value;
const queueSelector3 = document.getElementById("queueSelector3").value;

const QWPC1 = document.getElementById("QWPC1");
const QWPC2 = document.getElementById("QWPC2");
const QWPC3 = document.getElementById("QWPC3");

