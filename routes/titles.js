/**
 * @openapi
 * /titles:
 *   post:
 *     summary: Seed a new movie title
 *     tags:
 *       - Titles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               tmdbId:
 *                 type: number
 *                 example: 12345
 *               title:
 *                 type: string
 *                 example: Inception
 *               posterPath:
 *                 type: string
 *                 example: /path/to/poster.jpg
 *               overview:
 *                 type: string
 *                 example: A dream-within-a-dream thriller.
 *               type:
 *                 type: string
 *                 enum: [movie, tv]
 *                 example: movie
 *     responses:
 *       201:
 *         description: Title created successfully
 *       400:
 *         description: Missing title field
 */
const express = require('express');
const router = express.Router();
const { createTitle, getPool, getTitleById, updateTitle, deleteTitle } = require('../controllers/titleController');

router.post('/', createTitle);

/**
 * @openapi
 * /titles/pool:
 *   get:
 *     summary: Fetch all available movie titles
 *     tags:
 *       - Titles
 *     responses:
 *       200:
 *         description: A list of available movie titles
 */
router.get('/pool', getPool);

/**
 * @openapi
 * /titles/{id}:
 *   get:
 *     summary: Get a title by id
 *     tags:
 *       - Titles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the title by id
 *       404:
 *         description: Title not found
 */
router.get('/:id', getTitleById);

/**
 * @openapi
 * /titles/{id}:
 *   put:
 *     summary: Update movie title metadata
 *     tags:
 *       - Titles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tmdbId:
 *                 type: number
 *               title:
 *                 type: string
 *               posterPath:
 *                 type: string
 *               overview:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [movie, tv]
 *     responses:
 *       200:
 *         description: Title updated successfully
 *       404:
 *         description: Title not found
 */
router.put('/:id', updateTitle);

/**
 * @openapi
 * /titles/{id}:
 *   delete:
 *     summary: Remove a movie title from the pool
 *     tags:
 *       - Titles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Title removed successfully
 *       404:
 *         description: Title not found
 */
router.delete('/:id', deleteTitle);

module.exports = router;
