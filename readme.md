
# Gizmo Api 
Gizmo Api is a template or little framework allows to quickly launch an API.
Gizmo is based on a system of routes, controllers and model.
This template is fully customizable but with a basic configuration to quickly get started in the construction of the API.

## Requirements

- Node.js 🐭

### Useful (Not compulsory but useful)
- Gizmo CLI `npm i -g @maclow_/gizmo`
- Docker
## Installation instructions
### Without Gizmo CLI
1. Run `git clone https://github.com/MestrieEsteban/gizmo-api.git`
2. Run `yarn install`
### With Gizmo CLI
1. Run `gizmo clone | gizmo -c`
2. Run `gizmo install | gizmo -i`



## Configuration

- The configuration is quick you just need to add your database in the .env and also add a JWT_ENCRYPTION

-   You can also add entities to your database ~/src/core/models (using typeORM https://typeorm.io/#/)
 There is an example available with the User table
 
 - For routes add them in ~ /src/routes/api
	 If your routes are in the secured folder, a token will have to be sent to access the route
	 otherwise the API return "unauthorized"
## Roadmap
- [x] API Sécurisation (passport, jwt)
- [x] Add Controllers
- [ ]  Create a good documentation and implement a swagger
- [ ] Cors and Express 
- [ ] Unit tests
- [ ] Continuous integration with Gizmo CLI
