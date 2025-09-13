import EventSchema from '../models/EventSchema.js';
const Event = EventSchema;
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

export const CreateEvent = async (req, res) => {
  try {
    // If frontend sends a JSON string in `event` field:
    const eventData = req.body.event ? JSON.parse(req.body.event) : { ...req.body };
    
    // Normalize tags if frontend sent comma-separated string
    if (typeof eventData.tags === 'string') {
      eventData.tags = eventData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
    }

    // Parse nested date strings to Date objects (if needed)
    if (eventData.date) {
      if (eventData.date.start) eventData.date.start = new Date(eventData.date.start);
      if (eventData.date.end) eventData.date.end = new Date(eventData.date.end);
    }

    // Attach creator if auth middleware set req.user_id
    if (req.user_id) {
      eventData.createdBy = { userId: req.user_id };
    }
    
    // If a file was uploaded, stream it to Cloudinary
    if (req.file && req.file.buffer) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'campus/events', resource_type: 'image' }, // folder optional
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
     
      // Save Cloudinary info on the event data
      eventData.image = {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      };
    }

    // Create and save the event
    const newEvent = new EventSchema(eventData);
    await newEvent.save();

    return res.status(201).json(newEvent);
  } catch (error) {
    console.error('CreateEvent error:', error);
    // Don't leak full error in production
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const GetEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId).populate('comments.user', 'name').populate('attendees.userId', 'name');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

export const UpdateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updatedData = req.body;

    const event = await Event.findByIdAndUpdate(eventId, updatedData, { new: true });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }   
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

export const DeleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findByIdAndDelete(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}
export const AddComment = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { text } = req.body;
        const userId = req.user._id;
    
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const comment = {
            user: userId,
            text
        };  
        event.comments.push(comment);
        await event.save();

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }               
}

export const GetAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('comments.user', 'name').populate('attendees.userId', 'name');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

