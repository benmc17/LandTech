# Corporate Land Ownership Tool

## Contents
- [Description](#description)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Build and Test](#build-and-test)
- [Example](#example)
- [Design](#design)
- [Further Development](#further-development)
  * [Data](#data)
  * [User Interface](#user-interface)
  * [Authentication/Authorisation](#authentication/authorisation)
  * [DevOps](#devops)
- [Code Coverage](#code-coverage)

## Description
The purpose of this tool is to provide a means of displaying complex corporate land ownership heirarchies. It has been developed with TypeScript/Node.js using a top-down TDD approach.

## Prerequisites
1. Node.js (12.19)

## Installation
To install the application:
1. Clone the repository to your local machine
1. Navigate to the repositories root
1. Run ```npm install``` or install globall ```npm install -g```
1. Build the application ```npm run build```
1. The executable file is located in ```./bin```
1. to run:
```
landtree --mode from_root <company id>
landtree --mode expand <company id>
```
Note: The default 'mode' is from_root
1. for more options:
```
landtree help
```

## Build and Test
The build process uses typescripts ```tsc``` transpiler and also applies linting before build (using ESLint)

The unit tests use the following frameworks:
- Mocha - Test Runner
- Chai - Fluent assertions library
- TypeMoq - Mocking framework for TypeScript (based on .NET Moq)

To run the tests, execute ```npm run test```

## Example
To display the ownership heirarchy of a company with the id ```CR265329157208```
```
landtree --mode from_root CR265329157208

 CR801928624634; Chitestruni; owner of 0 land parcels
 |  -  C561835659951; CHITESTRUNI TANILETAN & CO LIMITED; owner of 0 land parcels
 |  |  -  C155678654036; taniletan b & co ltd; owner of 0 land parcels
 |  |  -  C675120702367; Resonebrora & Co; owner of 0 land parcels
 |  |  -  C953584838063; Taniletan sanetanile Ltd; owner of 0 land parcels
 |  |  -  CR823594892586; Taniletan gloratanite Properties; owner of 0 land parcels
 |  |  -  CR835157274516; Taniletan Midlands UK Plc; owner of 0 land parcels
 |  |  -  R486083349658; TANILETAN ASSOCIATED; owner of 0 land parcels
 |  |  |  -  C848448201561; TANILETAN OLD INTERNATIONAL LTD; owner of 0 land parcels
 |  |  |  -  R35929259874; Taniletan grallitanea Limited; owner of 2 land parcels
 |  |  |  |  -  C86708450985; TANEABR GROUP; owner of 0 land parcels
 |  |  |  |  -  CR265329157208; Chane International Limited; owner of 0 land parcels
 |  |  |  |  -  CR266345544451; Chonegl Plc; owner of 0 land parcels
 |  |  |  |  -  CR49340755304; SANEGREE & CO LIMITED; owner of 223 land parcels
 |  |  |  |  -  R319811135363; GRALLITANEA TANUNI UK; owner of 0 land parcels
 |  |  |  |  -  R920080963685; RESONES UK; owner of 0 land parcels
 |  |  |  |  -  R954396333133; GRALLITANEA MIDLANDS INTERNATIONAL PLC; owner of 0 land parcels
 |  |  |  |  -  R96630368062; GRALLITANEA LESANELESORA; owner of 204 land parcels
 |  |  |  |  -  S3204071518; GRALLITANEA NEW; owner of 770 land parcels
 |  |  |  |  -  S447185148162; GRALLITANEA STRALLIGR LAND; owner of 0 land parcels
 |  |  |  |  -  S534766570880; Grallitanea London Land Ltd; owner of 1 land parcels
 |  |  |  |  -  S91869613886; Grallitanea B Properties Plc; owner of 0 land parcels
 |  |  |  |  -  S949186899925; Brite Limited; owner of 0 land parcels
 |  |  |  |  -  S954202958806; GRALLITANEA ASSOCIATED LTD; owner of 0 land parcels
 |  -  C989090813684; Chitestruni Associated; owner of 0 land parcels
 |  -  R469421498321; Chitestruni Midlands UK Plc; owner of 0 land parcels
 |  -  R772421139605; CHITESTRUNI WALES LAND LTD; owner of 0 land parcels
 |  -  S899130543471; chitestruni wales international plc; owner of 0 land parcels
```

## Design
The application adopts a SOLID approach and uses the Inversify framework for TypeScript dependency injection.

Design considerations:
- It has been designed to use a 'service' layer that can be easily adapted and called from any user interface.
- The application loads static data from CSV files that are included in the repository.
- The data is modelled as a tree which is held in memory and then traversed to retrieve the data for the requested operation.
- The tree structure is designed to be easily traversable bottom up and top down by referencing both its parent node and child nodes.
- Each node in the tree is also stored in a key-value data structure in order to allow efficient look ups of an individual record O(1) whilst traversal is generally O(n) (worst case)

## Further Development
The following sections outline how the application could be 'productionized' to enable deployment to a web service infrastructure.

### Data
Currently the data is loaded and parsed from CSV files on every request, this is not ideal for a production environment:

Option 1 - Ideally the ```LandOwnershipCsvDataLoader``` would be replaced with a data access layer sitting on top of a relational database (Postgres, MySQL, etc..) which would then read the tree from the database at startup. This tree could be cached either in memory or for scalability, in a Redis cache. Keeping the cached tree in Redis would allow for easy horizontal scaling as many instances of the application could access the same data.

Option 2 - Similar to option 1 except the tree could be maintained in a document database (Mongo, Dynamo, Cosmos, etc..) with a seperate document/record for each root level company. The downsides to this are potentially an impact on performance as each tree would need to be completely traversed in order to build up a mapping of each node against its company id.

### User Interface
The user interface is a basic CLI however for a production application this could be replaced by a REST interface that could provide a 'controller' layer to interact with the service:

Option 1 - Deploy the application to a standalone server (using Express or similar web application framework) as a service accessible via an Nginx proxy. This could be hosted on a VM/Instance (such as AWS EC2, Azure, etc.) or it could be hosted as a docker container in an orchestration environment such as Kubernetes.

Option 2 - Deploy as a serverless component. The application could easily be adapted to run serverless, deployed to a serverless PaaS offering such as AWS Lambda or Azure functions. It could be written to use the Serverless framework for easy deployment whilst avoiding vendor lock-in (to an extent). Consideration would have to be made about hosting a Redis cache to store/update the tree, as it would be inefficient to load the tree from storage on every 'spin up'.

### Authentication/Authorisation
Currently there is no authentication/authorisation mechanism. This would probably be required if the service was to be exposed via a API as the returned data may contain sensitive information. Authorisation could be achieved using the OAuth protocol which would enforce seperation between the security layer and the service. If third party login services were used (Google, Facebook, etc..) then user accounts (and any other PII) would not need to be managed or stored.

### DevOps
For deployment to production a CI/CD build and release pipeline would need to be built to enable easy deployment and automated testing through the stages (dev, test, uat, live, etc..) and also to ensure predictable deployments for every code change. This could be achieved using a cloud provider such as Azure DevOps or using a self managed solution by running a Jenkins server (or similiar).

## Code Coverage
A code test coverage report can be generate using NYC by executing the command ```npm run coverage```

The following is the latest coverage report:
```
=============================== Coverage summary ===============================
Statements   : 92.53% ( 285/308 )
Branches     : 81.82% ( 45/55 )
Functions    : 86.27% ( 44/51 )
Lines        : 92.53% ( 260/281 )
================================================================================
```