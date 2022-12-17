const localCyclistApi = "http://localhost:8080/racer"
const divtoput = document.getElementById("jerseyContainer")

function getJerseys() {
    // Retrieve the data from the database
    fetch(localCyclistApi)
        .then(response => response.json())
        .then(riders => {
            // Calculate the values for each jersey
            let yellowJersey = getFastestOverall(riders);
            let mountainJersey = getMostMountainPoints(riders);
            let greenJersey = getMostSprintPoints(riders);
            let whiteJersey = getFastestUnder26(riders);

            // Build the HTML for the view
            let html = "";
            html += "<div class='container'>";
            html += "<div class='row'>";
            html += "<div class='col-12'>";
            html += "<h1 class='text-center'>Jersey Status</h1>";
            html += "</div>";
            html += "</div>";
            html += "<div class='row'>";
            html += "<div class='col-12'>";
            html += "<div class='card-deck'>";
            html += "<div class='card'>";
            html += "<div class='card-header'>Yellow Jersey</div>";
            html += "<div class='card-body'>";
            html += "<h5 class='card-title'>" + yellowJersey.name +" "+ yellowJersey.surname+ "</h5>";
            html += "</div>";
            html += "</div>";
            html += "<div class='card'>";
            html += "<div class='card-header'>Mountain Jersey</div>";
            html += "<div class='card-body'>";
            html += "<h5 class='card-title'>" + mountainJersey.name +" "+ mountainJersey.surname+ "</h5>";
            html += "</div>";
            html += "</div>";
            html += "<div class='card'>";
            html += "<div class='card-header'>Green Jersey</div>";
            html += "<div class='card-body'>";
            html += "<h5 class='card-title'>" + greenJersey.name +" "+ greenJersey.surname+ "</h5>";
            html += "</div>";
            html += "</div>";
            html += "<div class='card'>";
            html += "<div class='card-header'>White Jersey</div>";
            html += "<div class='card-body'>";
            html += "<h5 class='card-title'>" + whiteJersey.name +" "+ whiteJersey.surname+ "</h5>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";

            // Insert the HTML into the page
            divtoput.innerHTML = html;
        });
}

// Calculate the rider with the fastest overall time
function getFastestOverall(riders) {
    // Sort the riders by time
    riders.sort(function (a, b) {
        return a.totalTime - b.totalTime;
    });

    // Return the rider with the fastest time
    return riders[0];
}

// Calculate the rider with the most mountain points
function getMostMountainPoints(riders) {
    // Sort the riders by mountain points
    riders.sort(function (a, b) {
        return b.mountainPoints - a.mountainPoints;
    });

    // Return the rider with the most mountain points
    return riders[0];
}

// Calculate the rider with the most sprint points
function getMostSprintPoints(riders) {
    // Sort the riders by sprint points
    riders.sort(function (a, b) {
        return b.sprintPoints - a.sprintPoints;
    });

    // Return the rider with the most sprint points
    return riders[0];
}

// Calculate the rider with the fastest overall time and age under 26
function getFastestUnder26(riders) {
    // Filter the riders by age
    var under26 = riders.filter(function(rider) {
        // Calculate the age of the rider based on their date of birth
        let dob = new Date(rider.dateOfBirth);
        let today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        let month = today.getMonth() - dob.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        return age < 26;
    });

    // Sort the riders by time
    under26.sort(function(a, b) {
        return a.time - b.time;
    });

    // Return the rider with the fastest time
    return under26[0];
}
