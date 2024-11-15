import requests

# Function to fetch data from the initial API
def fetch_initial_data(api_url):
    try:
        response = requests.get(api_url)
        print(response)
        response.raise_for_status()  # Check for HTTP errors
        data = response.json()       # Parse response as JSON
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching initial data: {e}")
        return None

# Function to extract request IDs from the initial data
def extract_request_ids(data, id_key='request_id'):
    # Assuming request IDs are stored in a list or in a key within the response
    # Customize based on the API's response structure
    request_ids = []
    
    if isinstance(data, list):
        request_ids = [item[id_key] for item in data if id_key in item]
    elif isinstance(data, dict):
        request_ids = data.get(id_key, [])
    
    return request_ids

# Function to call API using each request ID
def fetch_request_data(api_base_url, request_ids):
    results = []
    
    for request_id in request_ids:
        url = f"{api_base_url}/{request_id}"  # Construct the URL using the request ID
        try:
            response = requests.get(url)
            response.raise_for_status()  # Check for HTTP errors
            result = response.json()     # Parse response as JSON
            results.append(result)
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data for request ID {request_id}: {e}")
    
    return results

# Main function to perform the entire workflow
def main():
    initial_api_url = "https://www.scaler.com/academy/help-request?academy_requests=true&acting_as=helper&all_requests_from_date=&asked_by=&dashboard_action=pending_on_helper&has_topics=%5B%5D&hr_scope=&is_mentee=false&item_type=&offset=0&type_of_doubt=%5B%5D"  # Replace with the initial API URL
    api_base_url = "https://www.scaler.com/help_requests/"              # Replace with the base URL for request details

    # Step 1: Fetch initial data
    data = fetch_initial_data(initial_api_url)
    if data is None:
        return
    
    # Step 2: Extract request IDs from the initial response
    request_ids = extract_request_ids(data)
    if not request_ids:
        print("No request IDs found.")
        return

    # Step 3: Use request IDs to fetch additional data
    results = fetch_request_data(api_base_url, request_ids)
    
    # Step 4: Process the results (e.g., print, save to file, etc.)
    for result in results:
        print(result)

if __name__ == "__main__":
    main()
