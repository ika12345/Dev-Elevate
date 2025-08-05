import mongoose from 'mongoose';

const programmingProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  },
  platformName: {
    type: String,
    trim: true,
    default: 'LeetCode'
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
programmingProblemSchema.index({ category: 1 });
programmingProblemSchema.index({ difficulty: 1 });
programmingProblemSchema.index({ tags: 1 });

// Export as default
export default mongoose.model('ProgrammingProblem', programmingProblemSchema);