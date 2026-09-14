cd /home/user/myjerseyplug
echo "=== 1) Valid checkout (server re-prices) ==="
RESP=$(curl -s -X POST http://localhost:3000/api/checkout -H 'Content-Type: application/json' -d '{
  "items":[{"lineId":"li_1","productId":"p-rmad-home","name":"Real Madrid Home 24/25","type":"standard","image":"/x","basePrice":38000,"customization":null,"customizationCost":0,"unitPrice":38000,"quantity":1}],
  "customer":{"fullName":"Chidi Okafor","email":"chidi@test.com","phone":"08012345678","address":"1 Allen Ave","city":"Lagos","state":"Lagos"},
  "delivery":{"method":"standard"}
}')
echo "$RESP"
OID=$(echo "$RESP" | python3 -c "import sys,json;print(json.load(sys.stdin).get('orderId',''))")
echo "orderId=$OID"

echo "=== 2) Tampered price (frontend lies: basePrice 100) must be REJECTED ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" -X POST http://localhost:3000/api/checkout -H 'Content-Type: application/json' -d '{
  "items":[{"lineId":"li_2","productId":"p-rmad-home","name":"x","type":"standard","image":"/x","basePrice":100,"customization":null,"customizationCost":0,"unitPrice":100,"quantity":1}],
  "customer":{"fullName":"A","email":"a@b.com","phone":"08012345678","address":"addr","city":"Lagos","state":"Lagos"},
  "delivery":{"method":"standard"}
}'

echo "=== 3) Dev webhook verify (server flips status) ==="
curl -s -X POST http://localhost:3000/api/verify-dev -H 'Content-Type: application/json' -d "{\"orderId\":\"$OID\"}"
echo ""

echo "=== 4) Order now (should be paid) ==="
curl -s "http://localhost:3000/api/orders/$OID" | python3 -m json.tool
