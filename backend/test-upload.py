import requests
import sys

base_url = "http://localhost:8081/api"

print("Logging in to get token...")
res = requests.post(f"{base_url}/auth/login", json={
    "email": "test@example.com",
    "password": "password123"
})
if res.status_code != 200:
    print("Login failed!", res.text)
    sys.exit(1)

token = res.json()["data"]["token"]
print("Testing Transcribe endpoint...")

headers = {
    'Authorization': f'Bearer {token}'
}

files = {
    'file': ('sample.wav', open('sample.wav', 'rb'), 'audio/wav')
}

response = requests.post(f"{base_url}/answers/transcribe", headers=headers, files=files)
print(response.status_code)
print(response.json())
