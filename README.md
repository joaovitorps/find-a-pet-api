# Find a pet API

## Tech stack

- Fastify
  - JWT
  - Cookies
- zod
- prima
- PostgreSQL

- biome

- vitest
- supertest

## Tasks

- [x] Route to register an ORG, ensuring it includes address and WhatsApp number
- [ ] Login route for an ORG
  - [ ] login table {id, email, pass, org_id}
  - [ ] create test for the use case
  - [ ] add cookie (fastify-cookie)
  - [ ] use case login
  - [ ] crete test for controller
  - [ ] create controller
- [ ] Route to register a pet, ensuring it is associated with an ORG
- [ ] Route to list pets, requiring the city as a mandatory parameter
- [ ] Implement optional filter functionality by pet characteristics in the listing
- [ ] Route to view the details of a specific pet
- [ ] Ensure that the ORG’s admin access is restricted to logged-in users
- [ ] Apply SOLID principles while developing the API structure
- [ ] Create tests to validate the functionalities and business rules

remember to includes a richer README.md with as much details as possible
