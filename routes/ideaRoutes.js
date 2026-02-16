import express from 'express';
const router = express.Router();
import Idea from '../models/Idea.js';
import mongoose from 'mongoose';

/**
 * @route           GET /api/ideas
 * @description     Get all ideas
 * @access          Public
 * @query           _limit (optional limit for ideas returned)
 */
router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query._limit);
    const query = Idea.find().sort({ createdAt: -1 });

    if (!isNaN(limit)) {
      query.limit(limit);
    }

    const ideas = await query.exec();
    res.json(ideas);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/**
 * @route           Get /api/ideas/:id
 * @description     Get single idea
 * @access          Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error('Idea Not Found');
    }

    const idea = await Idea.findById(id);

    if (!idea) {
      res.status(404);
      throw new Error('Idea Not Found');
    }

    res.json(idea);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/**
 * @route           POST /api/ideas
 * @description     Create new idea
 * @access          Public
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, summary, description, tags } = req.body;

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error('Title, summary and description are required');
    }

    const newIdea = Idea({
      title,
      summary,
      description,
      tags:
        typeof tags === 'string'
          ? tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : Array.isArray(tags)
            ? tags
            : [],
    });

    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/**
 * @route           DELETE /api/ideas/:id
 * @description     Delete idea
 * @access          Public
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error('Idea Not Found');
    }

    const idea = await Idea.findByIdAndDelete(id);

    if (!idea) {
      res.status(404);
      throw new Error('Idea Not Found');
    }

    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/**
 * @route           PATCH /api/ideas/:id
 * @description     Update idea
 * @access          Public
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error('Idea Not Found');
    }

    const { title, description, summary, tags } = req.body;

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error('Title, summary and description are required');
    }

    const update = {
      title,
      summary,
      description,
      tags:
        typeof tags === 'string'
          ? tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : Array.isArray(tags)
            ? tags
            : [],
    };

    const savedIdea = await Idea.findByIdAndUpdate(
      id,
      { $set: update },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!savedIdea) {
      res.status(404);
      throw new Error('Idea not found');
    }

    res.json(savedIdea);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
