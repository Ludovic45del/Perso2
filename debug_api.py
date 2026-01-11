import json
import urllib.request
import urllib.error
import uuid

BASE_URL = "http://127.0.0.1:8000/api/v1"

def post_json(url, data):
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    try:
        with urllib.request.urlopen(req) as response:
            return response.getcode(), json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')

def get_json(url):
    try:
        with urllib.request.urlopen(url) as response:
            return response.getcode(), json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')

def debug_api():
    # 1. Create Campaign
    print("--- Creating Campaign ---")
    payload = {
        "name": "Test Python Debug " + str(uuid.uuid4())[:8],
        "year": 2030,
        "semester": "S1",
        "type_id": 0,
        "status_id": 0,
        "installation_id": 0,
        "description": "This is a debug description from Python script."
    }
    
    code, result = post_json(f"{BASE_URL}/campaigns/", payload)
    print(f"Status: {code}")
    
    if code != 201:
        print(f"Error: {result}")
        return
    
    campaign_uuid = result['uuid']
    print(f"Created Campaign UUID: {campaign_uuid}")
    print(f"Returned Description: {result.get('description')}")
    
    # Verify persistence by GET
    code_get, fetched = get_json(f"{BASE_URL}/campaigns/{campaign_uuid}/")
    print(f"Fetched Description: {fetched.get('description')}")
    
    if fetched.get('description') == "This is a debug description from Python script.":
        print("SUCCESS: Description saved correctly.")
    else:
        print("FAILURE: Description NOT saved.")

    # 2. Add Team Member
    print("\n--- Adding Team Member ---")
    team_payload = {
        "campaign_uuid": campaign_uuid,
        "role_id": 0, # MOE
        "name": "Dupont Python"
    }
    
    code_team, result_team = post_json(f"{BASE_URL}/campaign-teams/", team_payload)
    print(f"Team Add Status: {code_team}")
    print(f"Team Add Response: {result_team}")
    
    if code_team == 201:
         print("SUCCESS: Team member added.")
    else:
         print("FAILURE: Team member add failed.")

if __name__ == "__main__":
    debug_api()
