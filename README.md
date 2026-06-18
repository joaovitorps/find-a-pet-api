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
- [x] Login route for an ORG
  - [x] login table {id, email, pass, org_id}
  - [x] create test for the use case
  - [x] add cookie (fastify-cookie)
  - [x] use case login
  - [x] crete test for controller
  - [x] create controller
- [ ] Route to register a pet, ensuring it is associated with an ORG
  - [ ] add req.org.id if authenticated correctly
  - [ ] unit.test for create-pet use case
  - [ ] create-pet use case
  - [ ] create POST `/pet` route protected by jwt middleware inside the controller
  - [ ] verify if params are correctly:
    - [ ] `org_id` will come from req.org
    - [ ] `name` string
    - [ ] `about` string
    - [ ] `age` number
    - [ ] `size` string
    - [ ] `energy level` string
    - [ ] `independency level` string
    - [ ] `environment` string
    - [ ] `pictures`\*
    - [ ] `adoption_requirements` string[]
  - [ ] must return 201
  - [ ] create e2e.test
- [ ] Route to list pets, requiring the city as a mandatory parameter
- [ ] Implement optional filter functionality by pet characteristics in the listing
- [ ] Route to view the details of a specific pet
- [ ] Ensure that the ORG’s admin access is restricted to logged-in users
- [ ] Apply SOLID principles while developing the API structure
- [ ] Create tests to validate the functionalities and business rules

remember to includes a richer README.md with as much details as possible
