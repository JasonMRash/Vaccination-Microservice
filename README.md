# Vaccination Microservice: API Spec

### Data Model
The app stores two kinds of entities in Datastore, Organizations and Requirements.

#### Organization
| **Property**     | **Data Type** | **Notes**                                                                                                                   |
|------------------|---------------|-----------------------------------------------------------------------------------------------------------------------------|
| id               | Integer       | The unique id of the organization. Datastore automatically generates it. Don't add it yourself as a property of the entity. |
| name             | String        | Name of the organization.                                                                                                   |
| initial_required | Bool          | Whether or not initial round of vaccination is required.                                                                    |
| num_boosters     | Integer       | The number of booster shots required by the organization.                                                                   |
| requirements     | Array         | Array of requirements         

#### Requirement
| **Property**    | **Data Type** | **Notes**                                                                                                           |
|-----------------|---------------|---------------------------------------------------------------------------------------------------------------------|
| id              | Integer       | The id of the requirement. Datastore automatically generates it. Don't add it yourself as a property of the entity. |
| organization_id | String        | The id of the organization that uses this requirement.                                                              |
| days_max        | Integer       | How long the organization considers the person immune after this vaccination.                                       |
| days_min        | Integer       | How long the organization considers for immunity to take place after injection.                                     |
| quantity        | String        | Number of shots needed for this requirement.                                                                        |
| type            | String        | Initial vaccine or booster vaccine                                                                                  |

### Create an Organization
Allows you to create a new organization.
| POST /organizations |
|---------------------|

#### Request
##### Path Parameters: None
##### Request Body: Required
##### Request Body Format: JSON
##### Request JSON Attributes
| **Name**         | **Description**                                           | **Required?** |
|------------------|-----------------------------------------------------------|---------------|
| name             | The name of the organization.                             | Yes           |
| initial_required | Whether or not initial round of vaccination is required.  | Yes           |
| num_boosters     | The number of booster shots required by the organization. | Yes           |
##### Request Body Example
| { "name": "Wendy’s", "initial_required": true, "num_boosters": 0 } |
|---------------------------------------------------------------------|
#### Response
##### Response Body Format: JSON
##### Response Statuses
| **Outcome** | **Status Code** | **Notes**                                                                                                                               |
|-------------|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| Success     | 201 Created     |                                                                                                                                         |
| Failure     | 400 Bad Request | If the request is missing any of the 3 required attributes, the organization must not be created, and 400 status code must be returned. |
##### _Success_
| Status: 201 Created { "id": 5161561354, "name": "Wendy’s", "initial_required": true, "num_boosters": 0, "self": "/organizations/5161561354"} |
|----------------------------------------------------------------------------------------------------------------------------------------------|
##### _Failure_
| Status: 400 Bad Request { "Error": "The request object is missing at least one of the required attributes" } |
|--------------------------------------------------------------------------------------------------------------|
