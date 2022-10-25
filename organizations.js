const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const ds = require('./datastore');
const datastore = ds.datastore;

router.use(bodyParser.json());

const ORGANIZATION = "Organization";
const REQUIREMENT = "Requirement";

/* ------------- Begin Model Functions ------------- */

async function get_organization(req, id) {
    const key = datastore.key([ORGANIZATION, parseInt(id, 10)]);
    const entity = await datastore.get(key);
    if (entity[0] === undefined || entity[0] === null) {
        return entity;
    } else {
        return entity.map(ds.fromDatastore);
    }
}

async function get_organizations(req) {
    var results = {};
    const q = datastore.createQuery(ORGANIZATION);
    return datastore.runQuery(q).then((entities) => {
        results = entities[0].map(ds.fromDatastore);
        for (var i = 0; i < results.length; i++) {
            var self_url = '/organizations/' + results[i].id;
            results[i].self = self_url;
        }
        return {"organizations": results};
    });
}

async function get_requirement(req, id) {
    const key = datastore.key([REQUIREMENT, parseInt(id, 10)]);
    const entity = await datastore.get(key);
    if (entity[0] === undefined || entity[0] === null) {
        return entity;
    } else {
        return entity.map(ds.fromDatastore);
    }
}

async function post_organization(req, name, initial_required, num_boosters) {
    var key = datastore.key(ORGANIZATION);
    var requirements = [];
    const new_organization = {"name": name, "initial_required": initial_required, "num_boosters": num_boosters, 
        "requirements": requirements};
    await datastore.insert({ "key": key, "data": new_organization });
    var self_url = req.baseUrl + "/" + key.id;
    return { "id": key.id, "name": name, "initial_required": initial_required, "num_boosters": num_boosters, 
        "requirements": requirements, "self": self_url };
}

async function delete_organization(req, id) {
    const key = datastore.key([ORGANIZATION, parseInt(id, 10)]);
    return datastore.delete(key);
}

async function remove_owner_from_requirement(requirement_id) {
    const key = datastore.key([REQUIREMENT, parseInt(requirement_id, 10)]);
    return datastore.get(key).then(async requirement => {
        if (requirement[0] === undefined || requirement[0] === null) {
            return requirement;
        }
        else {
            var owner = null;
            const remove_owner = {"category": requirement[0].category, "days_max": requirement[0].days_max,
                "days_min": requirement[0].days_min, "quantity": requirement[0].quantity, "type": requirement[0].type, 
                "organization_id": owner};
            return await datastore.save({"key": key, "data": remove_owner});
        }
    });
}

async function assign_requirement_to_organization(organization_id, requirement_id) {
    const organization = get_organization(req, organization_id);
    const key = datastore.key([ORGANIZATION, parseInt(organization_id, 10)]);
    const key2 = datastore.key([REQUIREMENT, parseInt(requirement_id, 10)]);
    const requirement = get_requirement(req, requirement_id);
    var update_organization =  {"name": organization.name, "initial_required": organization.initial_required,
        "num_boosters": organization.num_boosters, 
        "requirements": organization.requirements};
    requirement.organization_id = organization_id;
    update_organization.requirements.push(requirement);
    return await datastore.save({"key": key, "data": update_organization}).then(datastore.save({"key": key2, "data": requirement}));

}

/* ------------- End Model Functions ------------- */

/* ------------- Begin Controller Functions ------------- */

// GET organizations/:id
router.get('/:id', function (req, res) {
    get_organization(req, req.params.id)
        .then(organization => {
            if (organization[0] === undefined || organization[0] === null) {
                return res.status(404).json({ 'Error': 'No organization with this organization ID exists' });
            } else {
                return res.status(200).json(organization[0]);
            }
        });
});

// GET organizations/
router.get('/', function (req, res) {
    get_organizations(req)
    .then( organizations => {
        res.status(200).json(organizations);
    });
});

// POST organizations/
router.post('/', function (req, res) {
    if (req.body.name === undefined || req.body.name === null ||
    req.body.initial_required === undefined || req.body.initial_required === null ||
    req.body.num_boosters === undefined || req.body.num_boosters === null) {
        res.status(400).json({'Error': 'The request object is missing at least one of the required attributes.'});
    }
    else {
        post_organization(req, req.body.name, req.body.initial_required, req.body.num_boosters)
        .then(organization => {
            res.status(201).json(organization);
        })
    } 
});

// PUT organizations/:organization_id/requirements/:requirement_id
router.put('/:organization_id/requirements/:requirement_id', function (req, res) {
    get_organization(req, req.params.organization_id).then( async organization => {
        if (organization[0] === undefined || organization[0] === null) {
            res.status(404).json({'Error': 'No organization with that organization_id exists.'});
        }
        else {
            get_requirement(req, req.params.requirement_id).then (async requirement => {
                if (requirement[0] === undefined || requirement[0] === null) {
                    res.status(404).json({'Error': 'No requirement with that requirement_id exists'});
                }
                else {
                    await assign_requirement_to_organization(req.params.organization_id, req.params.requirement_id).then(res.status(204).end());
                }
            })
        }
    });
});

// DELETE organizations/:id
router.delete('/:id', function (req, res) {
    get_organization(req, req.params.id).then( async organization => {
        if (organization[0] === undefined || organization[0] === null) {
            res.status(404).json({'Error': 'No organization with that organization_id exists.'});
        }
        else
        {
            for (var i = 0; i< organization[0].requirements.length; i++) {
                await remove_owner_from_requirement(organization[0].requirement[i].id);
            }
            await delete_organization(req, req.params.id).then(res.status(204).end());
        }
    });
});
/* ------------- End Controller Functions ------------- */

module.exports = router;