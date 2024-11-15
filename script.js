// Function to play notification sound
function playNotificationSound() {
    const audio = new Audio('https://commondatastorage.googleapis.com/codeskulptor-assets/jump.ogg'); // Replace with your sound file URL
    audio.play();
}

// Function to fetch live records and claim requests
function fetchLiveRecords() {
    fetch('https://www.scaler.com/academy/help-request?academy_requests=true&acting_as=helper&all_requests_from_date=&asked_by=&dashboard_action=pending_on_helper&has_topics=%5B%5D&hr_scope=&is_mentee=false&item_type=&offset=0&type_of_doubt=%5B%5D')
        .then(response => response.json())
        .then(data => {
            if (data.success === false && data.data) {
                const liveRecords = data.data.live_records || [];
                const records = data.data.records || [];

                // Merge liveRecords and records arrays
                const mergedRecords = liveRecords.concat(records);

                // Check if mergedRecords has any entries
                if (mergedRecords.length > 0) {
                    // Play the notification sound when records are found
                    playNotificationSound();

                    // Refresh the page to load the latest state
                    console.log('Refreshing the page to ensure the latest buttons are loaded.');
                    location.reload();

                    // Wait for a few seconds to allow the page to reload
                    setTimeout(() => {
                        // After the page reloads, process each record
                        mergedRecords.forEach(record => {
                            const id = record.id; // Assuming each record has a unique 'id'
                            console.log(`Processing record with ID: ${id}`);

                            // Construct a selector to find the "Claim request" button based on the ID
                            const claimButton = document.querySelector(`a[data-ga-label="resolve_now_live"][ng-click*="${id}"]`);

                            // Simulate the button press (click) if the button is found
                            if (claimButton) {
                                console.log(`Simulating click for ID ${id}`);
                                claimButton.click(); // This triggers the ng-click event for that ID
                            } else {
                                console.log(`Claim button for ID ${id} not found.`);
                            }
                        });
                    }, 5000); // Wait 5 seconds after the page reloads to ensure the content is fully loaded
                } else {
                    console.log('No live records or open pool records found.');
                }
            } else {
                console.log('Data fetch was not successful.');
            }
        })
        .catch(error => console.error('Error fetching initial data:', error));
}

// Run the fetchLiveRecords function every 10 seconds (10,000 milliseconds)
setInterval(fetchLiveRecords, 10000);
