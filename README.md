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
- [x] Route to register a pet, ensuring it is associated with an ORG
  - [x] add req.org.id if authenticated correctly
  - [x] create pet table
  - [x] create pet entity
  - [x] create repository for pet
  - [x] unit.test for create-pet use case
  - [x] create-pet use case
  - [x] create POST `/pet` route protected by jwt middleware inside the controller
  - [x] verify if params are correctly:
    - [x] `org_id` will come from req.org
    - [x] `name` string
    - [x] `about` string
    - [x] `age` number
    - [x] `size` string
    - [x] `energy level` string
    - [x] `independency level` string
    - [x] `environment` string
    - [x] `pictures`\*
    - [x] `adoption_requirements` string[]
  - [x] must return 201
  - [x] create e2e.test
- [x] Route to list pets, requiring the city as a mandatory parameter
  - [x] fetchPet use case test
  - [x] fetchPet use case
  - [x] GET `/pets` e2e test
    - [x] return 400 if city is not passed
  - [x] GET `/pets`
- [ ] Route to publish pet
  - [ ] if (pet.pictures.length === 0) throw "needs at least one photo"`. | same for adoption req
- [ ] Implement optional filter functionality by pet characteristics in the listing
- [ ] Route to view the details of a specific pet
- [ ] Ensure that the ORG’s admin access is restricted to logged-in users
- [ ] Apply SOLID principles while developing the API structure
- [ ] Create tests to validate the functionalities and business rules

remember to includes a richer README.md with as much details as possible
