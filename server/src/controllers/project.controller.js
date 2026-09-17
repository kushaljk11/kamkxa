const projectService = require('../services/project.service');

/**
 * @route   GET /api/projects
 * @desc    Get all projects for authenticated user
 * @access  Private
 */
const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getProjects(req.userId, req.query);
    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project by ID
 * @access  Private
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.userId, req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private
 */
const createProject = async (req, res, next) => {
  try {
    const { name, description, color, icon } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required',
      });
    }

    const project = await projectService.createProject(req.userId, {
      name: name.trim(),
      description,
      color,
      icon,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/projects/:id
 * @desc    Update project
 * @access  Private
 */
const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.userId, req.params.id, req.body);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Private
 */
const deleteProject = async (req, res, next) => {
  try {
    const result = await projectService.deleteProject(req.userId, req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
