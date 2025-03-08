const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const userService = require('./user.service');
const Role = require('_helpers/role');

// routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// route functions
function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own record and admins can get any record
    if (parseInt(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function create(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'User created successfully' }))
        .catch(next);
}

function update(req, res, next) {
    // users can update their own record and admins can update any record
    if (parseInt(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their own record and admins can delete any record
    if (parseInt(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}

// schema functions
function createSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email : Joi.string.email().required(),
        role: Joi.string().valid(Role.Admin, Role.User).required(),
        password: Joi.string().min(6).required(),
        confirmPassword : Joi.string().valid(Joi.ref('password').required())
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email : Joi.string.email().required(),
        role: Joi.string().valid(Role.Admin, Role.User).required(),
        password: Joi.string().min(6).required(),
        confirmPassword : Joi.string().valid(Joi.ref('password').required())
    


    }).with ('password','confirmPassword');
    validateRequest(req, next, schema);
}