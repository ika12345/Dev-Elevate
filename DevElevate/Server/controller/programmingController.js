import ProgrammingProblem from "../model/ProgrammingProblem.js";

// Get all programming problems
export const getAllProgrammingProblems = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      tags,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (difficulty && difficulty !== "all") {
      filter.difficulty = difficulty;
    }

    if (tags && tags.length > 0) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const [problems, totalCount] = await Promise.all([
      ProgrammingProblem.find(filter)
        .select("_id title difficulty link category tags description platformName")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      ProgrammingProblem.countDocuments(filter),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      problems,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error fetching programming problems:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch programming problems",
      error: error.message,
    });
  }
};

// Get DSA-specific problems
export const getDSAProblems = async (req, res) => {
  try {
    const {
      difficulty,
      tags,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    // Build filter object for DSA problems
    const filter = {
      isActive: true,
      $or: [
        { category: "DSA" },
        { tags: { $in: ["dsa"] } }
      ]
    };

    if (difficulty && difficulty !== "all") {
      filter.difficulty = difficulty;
    }

    if (tags && tags.length > 0) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const [problems, totalCount] = await Promise.all([
      ProgrammingProblem.find(filter)
        .select("_id title difficulty link category tags description platformName")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      ProgrammingProblem.countDocuments(filter),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      problems,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error fetching DSA problems:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch DSA problems",
      error: error.message,
    });
  }
};

// Create a new programming problem (Admin only)
export const createProgrammingProblem = async (req, res) => {
  try {
    const { title, difficulty, link, category, tags, description, platformName } = req.body;

    // Validate required fields
    if (!title || !difficulty || !link || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, difficulty, link, category",
      });
    }

    const problem = new ProgrammingProblem({
      title,
      difficulty,
      link,
      category,
      tags: tags || ["dsa"],
      description,
      platformName: platformName || "LeetCode"
    });

    await problem.save();

    res.status(201).json({
      success: true,
      message: "Programming problem created successfully",
      problem: problem
    });
  } catch (error) {
    console.error("Error creating programming problem:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create programming problem",
      error: error.message,
    });
  }
};

// Update a programming problem (Admin only)
export const updateProgrammingProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const updateData = req.body;

    const updatedProblem = await ProgrammingProblem.findByIdAndUpdate(
      problemId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProblem) {
      return res.status(404).json({
        success: false,
        message: "Programming problem not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Programming problem updated successfully",
      problem: updatedProblem
    });
  } catch (error) {
    console.error("Error updating programming problem:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update programming problem",
      error: error.message,
    });
  }
};

// Delete a programming problem (Admin only)
export const deleteProgrammingProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    const deletedProblem = await ProgrammingProblem.findByIdAndUpdate(
      problemId,
      { isActive: false },
      { new: true }
    );

    if (!deletedProblem) {
      return res.status(404).json({
        success: false,
        message: "Programming problem not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Programming problem deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting programming problem:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete programming problem",
      error: error.message,
    });
  }
};
