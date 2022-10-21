# Vaccination Microservice

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
