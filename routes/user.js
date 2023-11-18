const express = require('express');
const {loginController, registerController} = require('../controllers/userController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with required parameters for testing.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       '201':
 *         description: User successfully registered
 *       '400':
 *         description: Invalid request body
 */
router.post('/register', registerController)




/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login for existing user
 *     description: Login for an existing user with required parameters for testing.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       '200':
 *         description: User successfully logged in
 *       '401':
 *         description: Unauthorized, invalid credentials
 */
router.post('/login', loginController)



module.exports = router;