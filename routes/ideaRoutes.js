import express from 'express';

const router = express.Router();

/**
 * @route           GET /api/ideas
 * @description     Get all ideas
 * @access          Public
 */
router.get('/', (req, res) => {
  const ideas = [
    { id: 1, title: 'Idea 1', description: 'Description for Idea 1' },
    { id: 2, title: 'Idea 2', description: 'Description for Idea 2' },
    { id: 3, title: 'Idea 3', description: 'Description for Idea 3' },
  ];

  res.json(ideas);
});

/**
 * @route           POST /api/ideas
 * @description     Create new idea
 * @access          Public
 */
router.post('/', (req, res) => {
  const { title, description } = req.body || {};
  const newIdea = { id: Date.now(), title, description };

  res.status(201).json(newIdea);
});

export default router;
