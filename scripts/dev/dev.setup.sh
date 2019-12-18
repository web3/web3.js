# --------------------------------------------------
# Does set local registry up for the dev-environment
# --------------------------------------------------


# Launch local registry
verdaccio --config verdaccio.yml & npx wait-port 4873

# `npm add user`
curl -XPUT \
   -H "Content-type: application/json" \
   -d '{ "name": "test", "password": "test" }' \
   'http://localhost:4873/-/user/org.couchdb.user:test'

# `npm login`
npm-auth-to-token \
  -u test \
  -p test \
  -e test@test.com \
  -r http://localhost:4873