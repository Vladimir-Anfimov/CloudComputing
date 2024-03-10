import requests

secret = "zeSblgU5SWdLS9WVFwDqoONV3rhvt94BU32utE7I00lYt0lNKpTSIdCe"

url = "https://api.pexels.com/v1/curated?per_page=1"

response = requests.get(url,
    headers={
        "Authorization": secret
    }
)

print(response.json())
