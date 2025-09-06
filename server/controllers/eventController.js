import EventSchema from '../models/EventSchema.js';
const Event = EventSchema;

export const CreateEvent = async (req, res) => {
  try {
    const eventData = req.body;
    const newEvent = new Event(eventData);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

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

