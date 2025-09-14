import ProjectSchema from '../models/ProjectSchema.js';
const Project = ProjectSchema;
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// Get all projects
export const GetAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 }); // latest first

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: 'No projects found' });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new project
export const CreateProject = async (req, res) => {
  try {
    const projectData = req.body.project ? JSON.parse(req.body.project) : { ...req.body };

    // console.log('Received project data:', projectData);

    // Normalize tags and tech stack if sent as comma-separated strings
    if (typeof projectData.tags === 'string') {
      projectData.tags = projectData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
    }

    if (typeof projectData.techStack === 'string') {
      projectData.techStack = projectData.techStack
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
    }

    // Attach creator if auth middleware sets req.user
    if (req.user) {
      projectData.createdBy = { userId: req.user._id };
    }

    // Handle image uploads if any
    if (req.file && req.file.buffer) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'campus/projects', resource_type: 'image' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      projectData.image = {
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        }; 
    };

    const newProject = new Project(projectData);
    await newProject.save();

    res.status(201).json(newProject);
  } catch (error) {
    console.error('CreateProject error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single project by ID
export const GetProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId)
      .populate('comments.user', 'name');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('GetProject error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a project
export const UpdateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const updatedData = req.body;

    const project = await Project.findByIdAndUpdate(projectId, updatedData, { new: true });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('UpdateProject error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a project
export const DeleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('DeleteProject error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add a comment to a project
export const AddComment = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { text } = req.body;
    const userId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const comment = { user: userId, text };
    project.comments.push(comment);
    await project.save();

    res.status(201).json(project);
  } catch (error) {
    console.error('AddComment error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
