// Get the modal element
const modal = document.getElementById("editCyclistModal");
const localCyclistApi = "http://localhost:8080/racer"
const localCyclistTeamApi = "http://localhost:8080/team"
const localCountriesApi = "http://localhost:8080/country"
const tableBody = document.getElementById("cyclistTableBody")

async function getCyclists() {
    // Send a GET request to the API endpoint

    await fetch(localCyclistApi)
        .then(response => response.json()) // Parse the response as JSON
        .then(cyclists => {
            // Do something with the list of cyclists
            console.log(cyclists);
            displayCyclistTable(cyclists);
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
}


document.addEventListener("DOMContentLoaded", () => {
    getCyclists()
});

function displayCyclistTable(cyclists, teams, countries) {
    // Clear the table
    document.getElementById("cyclistTableBody").innerHTML = "";

    // Loop through the list of cyclists
    for (let i = 0; i < cyclists.length; i++) {
        const cyclist = cyclists[i];

        // Create the table row
        const row = document.createElement("tr");

        // Create the table cells
        const firstNameCell = document.createElement("td");
        firstNameCell.innerHTML = cyclist.name;
        row.appendChild(firstNameCell);

        const lastNameCell = document.createElement("td");
        lastNameCell.innerHTML = cyclist.surname;
        row.appendChild(lastNameCell);

        const dateOfBirthCell = document.createElement("td");
        dateOfBirthCell.innerHTML = cyclist.dateOfBirth;
        row.appendChild(dateOfBirthCell);

        const teamCell = document.createElement("td");
        teamCell.innerHTML = cyclist.team.teamName;
        row.appendChild(teamCell);

        const countryCell = document.createElement("td");
        countryCell.innerHTML = cyclist.country.countryName;
        row.appendChild(countryCell);

        const timeCell = document.createElement("td");
        timeCell.innerHTML = cyclist.totalTime;
        row.appendChild(timeCell);

        const mountainCell = document.createElement("td");
        mountainCell.innerHTML = cyclist.mountainPoints;
        row.appendChild(mountainCell);

        const sprintCell = document.createElement("td");
        sprintCell.innerHTML = cyclist.sprintPoints;
        row.appendChild(sprintCell);

        // Create the edit button
        const editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.classList.add("btn", "btn-primary", "btn-sm");
        editButton.addEventListener("click", () => {
            initEditCyclistModal('edit', cyclist);
            // Handle the edit button click event
            // (e.g., open a modal to edit the cyclist)
        });
        const editButtonCell = document.createElement("td");
        editButtonCell.appendChild(editButton);
        row.appendChild(editButtonCell);

        // Create the delete button
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.addEventListener("click", () => {
            if (confirm("Are you sure you want to delete " +cyclist.name+" "+ cyclist.surname+ "?")) {
                deleteRequest(cyclist.id).then(()=>location.reload())
            }
            // Handle the delete button click event
            // (e.g., send a DELETE request to the server)
        });
        const deleteButtonCell = document.createElement("td");
        deleteButtonCell.appendChild(deleteButton);
        row.appendChild(deleteButtonCell);

        // Add the row to the table body
        document.getElementById("cyclistTableBody").appendChild(row);
        $(document).ready(function() {
            $("#cyclistTable").tablesorter({
                sortReset: true,
                sortRestart: true
            });
        });

    }
}

$(document).ready(function () {
    $("#searchInput").keyup(function () {
        // Get the search term
        let searchTerm = $(this).val().toLowerCase();

        // Filter the table rows
        $("#cyclistTable tbody tr").filter(function () {
            // Hide rows that don't match the search term
            $(this).toggle($(this).text().toLowerCase().indexOf(searchTerm) > -1);
        });
    });
});

// Initialize the modal
function initEditCyclistModal(mode, cyclist) {
    // Get the modal elements
    const modal = $('#editCyclistModal');
    const modalTitle = $('#editCyclistModalLabel');
    const modalFooter = document.getElementById("modal-footer");

    const createButton = $('#modal-create');
    createButton.hide()


    // Set the modal title based on the mode
    if (mode === 'create') {
        modalTitle.text('Create Cyclist');
        createButton.show()

    } else if (mode === 'edit') {
        modalTitle.text('Edit Cyclist');
        const editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.classList.add("btn", "btn-primary");
        editButton.addEventListener("click", () => {
                submit(cyclist.id).then(r => r.ok)
        });
        modalFooter.appendChild(editButton)
    }

    fillOptions(localCyclistTeamApi, "teamName")
    fillOptions(localCountriesApi, "countryName")

    // If in edit mode, populate the form fields with the cyclist's data
    if (mode === 'edit' && cyclist) {
        $('#firstName').val(cyclist.name);
        $('#lastName').val(cyclist.surname);
        $('#dateOfBirth').val(cyclist.dateOfBirth);
        $('#totalTime').val(cyclist.totalTime);
        $('#mountainPoints').val(cyclist.mountainPoints);
        $('#sprintPoints').val(cyclist.sprintPoints);
        $('#countryName').val(cyclist.country.id);
        $('#teamName').val(cyclist.team.id);
    }

    // Show the modal
    modal.modal('show');

}

// Handle the submit button click
async function submit(text) {
    // Get the form data
    const name = $('#firstName').val();
    const surname = $('#lastName').val();
    const dateOfBirth = $('#dateOfBirth').val();
    const totalTime = $('#totalTime').val();
    const mountainPoints = $('#mountainPoints').val();
    const sprintPoints = $('#sprintPoints').val();
    const countryId = $('#countryName').val();
    const teamId = $('#teamName').val();


    // Create a new cyclist object from the form data
    const newCyclist = {
        "name": name,
        "surname": surname,
        "dateOfBirth": dateOfBirth,
        "totalTime": totalTime,
        "mountainPoints": mountainPoints,
        "sprintPoints": sprintPoints,
        "team": {
            "id": teamId
        },
        "country": {
            "id": countryId
        }
    };
    // Send the cyclist object to the server (via AJAX or some other method) to create or update it
    // ...
    if (text === "Create") {
        if (confirm("Are you sure you want to create " + newCyclist.name + " " + newCyclist.surname + "?")) {
            await postRequest(newCyclist).then(() => location.reload())
        }
    } else if (confirm("Are you sure you want to edit " +newCyclist.name+" "+ newCyclist.surname+ "?")) {
        newCyclist.id = text
        await putRequest(newCyclist).then(()=>location.reload())
    }

    // Close the modal
    $('#editCyclistModal').modal('hide');

}


async function postRequest(newCyclist) {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }
    fetchOptions.body = JSON.stringify(newCyclist);
    const response = await fetch(localCyclistApi, fetchOptions);
    // Refresh table on reload
    if (response.ok) {
    }
    return response;
}

async function putRequest(updatedCyclistObject) {
    const fetchOptions = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }
    fetchOptions.body = JSON.stringify(updatedCyclistObject);
    const response = await fetch(localCyclistApi, fetchOptions);
    // Refresh table on reload
    if (response.ok) {
    }
    return response;
}

async function deleteRequest(id) {
    const fetchOptions = {
        method: "DELETE",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }
    const response = await fetch(localCyclistApi + "/" + id, fetchOptions);
    // Refresh table on reload
    if (response.ok) {
    }
    return response;
}

function fillOptions(url, selectedId) {
    // Make an HTTP request to the API to retrieve the data
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Parse the data and extract the information you need
            const items = data;
            // Create the HTML for the dropdown menu
            const selectElement = document.getElementById(selectedId);
            // Loop through the items and create an option element for each one
            items.forEach(item => {
                const optionElement = document.createElement('option');
                optionElement.value = item.id;
                optionElement.textContent = item[selectedId];
                selectElement.appendChild(optionElement);
            });
        })
}

