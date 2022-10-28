# Vaccination Microservice: API Spec

# API @ https://vacc-microservice.uw.r.appspot.com

## Change log

|**Version** |**Change** |**Date** |
| - | - | - |
|1.0 |Initial version. |October 26, 2022 |

## UML Sequence Diagram

<img src ="https://github.com/JasonMRash/Vaccination-Microservice/blob/main/Sequence%20diagram.jpeg">

## Data Model

The app stores two kinds of entities in Datastore, Organizations and Requirements.

### Organization

|**Property** |**Data Type** |**Notes** |
| - | - | - |
|id |Integer |The unique id of the organization. Datastore automatically generates it. Don't add it yourself as a property of the entity. |
|name |String |Name of the organization. |
|initial\_required |Bool |Whether or not initial round of vaccination is required. |
|num\_boosters |Integer |The number of booster shots required by the organization. |
|requirements |Array |Array of requirement id’s |

### Requirement

|**Property** |**Data Type** |**Notes** |
| - | - | - |
|id |Integer |The id of the requirement. Datastore automatically generates it. Don't add it yourself as a property of the entity. |
|category |Integer |The category the vaccine falls under. |
|days\_max |Integer |How long the organization considers the person immune after this vaccination. |
|days\_min |Integer |How long the organization considers for immunity to take place after injection. |
|quantity |String |Number of shots needed for this requirement. |
|type |String |Initial vaccine or booster vaccine |

## Create an Organization

Allows you to create a new organization.

POST /organizations

### Request

#### Path Parameters

None

#### Request Body

Required

#### Request Body Format

##### JSON

#### Request JSON Attributes

|**Name** |**Description** |**Required?** |
| - | - | - |
|name |The name of the organization. |Yes |
|initial\_required |Whether or not initial round of vaccination is required. |Yes |
|num\_boosters |The number of booster shots required by the organization. |Yes |

#### Request Body Example

```
{
  "name": "Wendy’s",
  "initial_required": true,
  "num_boosters": 0
}
```

### Response

#### Response Body Format

##### JSON

#### Response Statuses

**Outcome Status Code Notes**
Success 201 Created
Failure 400 Bad Request If the request is missing any of the 3 required attributes, the organization must not be created, and 400 status code must be returned.

#### Response Examples

- Datastore will automatically generate an ID and store it with the entity being created. Your app mustsend back this value in the response body as shown in the example.

_Success_

Status: 201 Created
```
{
  "id": 5161561354,
  "name": "Wendy’s",
  "initial_required": true,
  "num_boosters": 0,
  "self": "/organizations/5161561354"
}
```

_Failure_

Status: 400 Bad Request
```
{
  "Error": "The request object is missing at least one of the required attributes"
}
```

## Get an Organization

Allows you to get an existing organization

GET /organizations/:organization_id

### Request

### Path Parameters

|**Name** |**Description** |
| - | - |
|organization\_id |ID of the organization |

#### Request Body

None

### Response

#### Response Body Format

##### JSON

#### Response Statuses

|**Outcome** |**Status Code** |**Notes** |
| - | - | - |
|Success |200 OK ||
|Failure |404 Not Found |No organization with this organization ID exists |

#### Response Examples

_Success_

Status: 200 OK

```
{
  "id": “ 5161561354 ”,
  "name": "Wendy’s",
  "initial_required": true,
  "num_boosters": 0,
  “requirements”: [{
    "id": "5744430225031168",
    “owner”: “organizations/5161561354”,
    “category”: 1,
    “days_max”: 365,
    “days_min”: 14,
    “quantity”: 2,
    “type”: 1,
    "self": /requirements/5744430225031168"
  }],
  "self": "/organizations/ 5161561354"
}
```

_Failure_

Status: 404 Not Found
```
{
  "Error": "No organization with this organization ID exists"
}
```

## List all Organizations

List all the organizations.

GET /organizations

### Request

#### Path Parameters

None

#### Request Body

None

### Response

#### Response Body Format

##### JSON

#### Response Statuses

|**Outcome** |**Status Code** |**Notes** |
| - | - | - |
|Success |200 OK ||

#### Response Examples

_Success_

Status: 200 OK

```
{
  "organizations": [{
    "id": “ 5161561354 ”,
    "name": "Wendy’s",
    "initial_required": true,
    "num_boosters": 0,
      “requirements”: [{
      "id": "5744430225031168",
      “owner”: “organization/ 5161561354 ”,
      “category”: 1,
      “days_max”: 365,
      “days_min”: 14,
      “quantity”: 2,
      “type”: 1,
      "self": /requirements/5744430225031168"
    }],
    "self": "/organizations/ 5161561354"
  }]
}
```

## Delete an Organization

Allows you to delete an organization. Note that if the organization currently has any requirements,
deleting the organization removes the organization ID from requirement.

DELETE /organizations/:organization_id

### Request

#### Path Parameters

|**Name** |**Description** |
| - | - |
|organization\_id |ID of the organization |

#### Request Body

None

### Response

No body

#### Response Body Format

Success: No body

Failure: JSON

#### Response Statuses

|**Outcome** |**Status Code** |**Notes** |
| - | - | - |
|Success |204 No Content ||
|Failure |404 Not Found |No organization with this organization ID exists |

#### Response Examples

_Success_

Status: 204 No Content

_Failure_

Status: 404 Not Found

```
{
  "Error": "No organization with this organization ID exists"
}
```

## Create a Requirement

Allows you to create a new requirement.

POST /requirements

### Request

#### Path Parameters

None

#### Request Body

Required

#### Request Body Format

##### JSON

#### Request JSON Attributes

|**Name** |**Description** |**Required?** |
| - | - | - |
|category |Integer |The category the vaccine falls under. |
|days\_max |Integer |How long the organization considers the person immune after this vaccination. |
|days\_min |Integer |How long the organization considers for immunity to take place after injection. |
|quantity |String |Number of shots needed for this requirement. |
|type |String |Initial vaccine or booster vaccine |

#### Request Body Example

```
{
  “category”: 1,
  “days_max”: 365 ,
  “days_min”: 14,
  “quantity”: 2,
  “type”: 1,
}
```

### Response

#### Response Body Format

##### JSON

#### Response Statuses

|**Outcome** |**Status Code** |**Notes** |
| - | - | - |
|Success |201 Created ||
|Failure |400 Bad Request |If the request is missing required attributes, the requirement must not be created, and 400 status code |

#### Response Examples

- Datastore will automatically generate an ID and store it with the entity being created. This value will be sent in the response body as shown in the example.

_Success_

Status: 201 Created

```
{
  "id": "5744430225031168",
  “organization”: null,
  “category”: 1,
  “days_max”: 365,
  “days_min”: 14,
  “quantity”: 2,
  “type”: 1,
  "self": "/requirements/5744430225031168"
}
```

_Failure_

Status: 400 Bad Request

```
{
  "Error": "The request object is missing the required number of attributes"
}
```

## Get a Requirement

Allows you to get an existing requirement.

GET /requirements/:requirements_id

### Request

#### Path Parameters

|**Name** |**Description** |
| - | - |
|requirement\_id |ID of the requirement |

#### Request Body

None

### Response

#### Response Body Format

##### JSON

#### Response Statuses

|**Outcome** |**Status Code** |**Notes** |
| - | - | - |
|Success |200 OK ||
|Failure |404 Not Found |No requirement with this requirement\_id exists |

#### Response Examples

_Success_

Status: 200 OK

```
{
  "id": "5744430225031168",
  “organization_id”: “5161561354 ”,
  “category”: 1,
  “days_max”: 365,
  “days_min”: 14,
  “quantity”: 2,
  “type”: 1,
  "self": /requirements/5744430225031168"
}
```

_Failure_

Status: 404 Not Found

```
{
  "Error": "No requirement with this requirement ID exists"
}
```

## List all Requirements

List all the requirements.

GET /requirements

### Request

#### Path Parameters

None

#### Request Body

None

### Response

#### Response Body Format

##### JSON

#### Response Statuses

|**Outcome** |**Status Code** |**Notes** |
| - | - | - |
|Success |200 OK ||

#### Response Examples

_Success_

Status: 200 OK

```
{
  "requirements": [{
    "id": "5744430225031168",
    “organization_id”: “5161561354 ”,
    “category”: 1,
    “days_max”: 365,
    “days_min”: 14,
    “quantity”: 2,
    “type”: 1,
    "self": "/requirements/5744430225031168"
  }]
}
```

## Delete a Requirement

Allows you to delete a requirement.

DELETE /requirements/:requirement_id

### Request

#### Path Parameters

|**Name** |**Description** |
| - | - |
|requirement\_id |ID of the requirement |

#### Request Body

None

### Response

No body

#### Response Body Format

Success: No body

Failure: JSON

#### Response Statuses

|**Outcome** |**Status Code** |**Notes** |
| - | - | - |
|Success |204 No Content ||
|Failure |404 Not Found |No requirement with this requirement ID exists |

#### Response Examples

_Success_

Status: 204 No Content

_Failure_

Status: 404 Not Found

```
{
"Error": "No requirement with this requirement ID exists"
}
```

## Assign Requirement to an Organization

Organization has adopted requirement.

PUT /organizations/:organization_id/requirements/:requirement_id

### Request

#### Path Parameters

|**Name** |**Description** |
| - | - |
|organization\_id |ID of the organization |
|requirement\_id |ID of the requirement |

#### Request Body

None

### Response

No body

#### Response Body Format

Success: No body

Failure: JSON

#### Response Statuses

|**Outcome** |**Status Code** |**Notes** |
| - | - | - |
|Success |204 No Content |Succeeds only if an organization with this organization\_id exists, and a requirement exists with this requirement\_id. |
|Failure |403 Forbidden | Requirement is already linked to a different organization. |
|Failure |404 Not Found |The specified organization and/or requirement does not exist. |

#### Response Examples

_Success_

Status: 204 No Content

_Failure_

Status: 403 Forbidden

```
{
  'Forbidden': 'Requirement is already linked to a different organization.'
}
```

Status: 404 Not Found

```
{
  "Error": "The specified organization and/or requirement does not exist."
}
```

## Remove Requirement from Organization

Requirement has been removed from Organization. Requirement no longer associated with
organization.

DELETE /requirements/:requirement_id/organizations/:organization_id

### Request

#### Path Parameters

|**Name** |**Description** |
| - | - |
|organization\_id |ID of the organization |
|requirement\_id |ID of the requirement |

#### Request Body

None

### Response

No body

#### Response Body Format

Success: No body

Failure: JSON

#### Response Statuses

|**Outcome** |**Status Code** |**Notes** |
| - | - | - |
|Success |204 No Content |Succeeds only if an organization exists with this organization\_id, and a requirement exists with this requirement\_id |
|Failure |404 Not Found |No organization with this organization\_id is associated with this requirement\_id. This could be because no organization with this organization\_id exists, or because no requirement with requirement\_id exists, or even if both organization\_id and requirement\_id are valid, the organization with this organization\_id is not associated with this requirement.|

#### Response Examples

_Success_

Status: 204 No Content

_Failure_

Status: 404 Not Found

```
{
"Error": "No organization with this organization ID exists"
}
```

Status: 404 Not Found

```
{
"Error": "No requirement with this requirement ID exists"
}
```

Status: 404 Not Found

```
{
"Error": "Requirement is not associated with this organization."
}
```

## View All Requirements for an Organization

GET /organizations/:organization_id/requirements/

### Request

#### Path Parameters

|**Name** |**Description** |
| - | - |
|organization\_id |ID of the organization |

#### Request Body

None

### Response

No body

#### Response Body Format

##### JSON

#### Response Statuses

|**Outcome** |**Status Code** |**Notes** |
| - | - | - |
|Success |200 OK ||
|Failure |404 Not Found |No organization with this organization ID exists |
|Failure |404 Not Found |No requirement with this requirement ID exists |

#### Response Examples

_Success_

Status: 200

```
{
  "requirements": [{
    "id": "5744430225031168",
    “owner”: “organization/ 5161561354 ”,
    “days_max”: 365,
    “days_min”: 14,
    “quantity”: 2,
    “type”: 1,
    "self": “/requirements/5744430225031168”
  }]
}
```

_Failure_

Status: 404 Not Found
```
{
"Error": "No organization with this organization ID exists"
}
```
Status: 404 Not Found
```
{
"Error": "No requirement with this requirement ID exists"
}
```
