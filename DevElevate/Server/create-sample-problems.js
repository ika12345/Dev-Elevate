import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import the model properly
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the model
const programmingProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Link must be a valid URL'
      }
    },
    category: {
      type: String,
      required: true,
      enum: ["DSA", "System Design", "Database", "Web Development", "Mobile Development", "Machine Learning", "Other"],
      default: "DSA"
    },
    tags: {
      type: [String],
      required: true,
      default: ["dsa"]
    },
    description: {
      type: String,
      trim: true,
    },
    platformName: {
      type: String,
      default: "LeetCode"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

programmingProblemSchema.index({ category: 1, difficulty: 1 });
programmingProblemSchema.index({ tags: 1 });
programmingProblemSchema.index({ isActive: 1 });

const ProgrammingProblem = mongoose.model("ProgrammingProblem", programmingProblemSchema);

dotenv.config();

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/dev-elevate';
console.log('Connecting to MongoDB:', mongoUri);
mongoose.connect(mongoUri);

const sampleProblems = [
  // Arrays
  {
    title: "Two Sum",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/two-sum/",
    category: "DSA",
    tags: ["dsa", "array", "hash-table"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    platformName: "LeetCode"
  },
  {
    title: "3Sum",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/3sum/",
    category: "DSA",
    tags: ["dsa", "array", "two-pointers"],
    description: "Given an integer array nums, return all the triplets such that they sum to zero.",
    platformName: "LeetCode"
  },
  {
    title: "Container With Most Water",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/container-with-most-water/",
    category: "DSA",
    tags: ["dsa", "array", "two-pointers"],
    description: "Find two lines that together with the x-axis form a container that holds the most water.",
    platformName: "LeetCode"
  },
  
  // Strings
  {
    title: "Valid Anagram",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/valid-anagram/",
    category: "DSA",
    tags: ["dsa", "string", "hash-table"],
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    platformName: "LeetCode"
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    category: "DSA",
    tags: ["dsa", "string", "sliding-window"],
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    platformName: "LeetCode"
  },
  {
    title: "Valid Palindrome",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/valid-palindrome/",
    category: "DSA",
    tags: ["dsa", "string", "two-pointers"],
    description: "A phrase is a palindrome if it reads the same forward and backward after converting to lowercase and removing non-alphanumeric characters.",
    platformName: "LeetCode"
  },

  // Trees
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    category: "DSA",
    tags: ["dsa", "tree", "binary-tree", "recursion"],
    description: "Given the root of a binary tree, return its maximum depth.",
    platformName: "LeetCode"
  },
  {
    title: "Invert Binary Tree",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/invert-binary-tree/",
    category: "DSA",
    tags: ["dsa", "tree", "binary-tree", "recursion"],
    description: "Given the root of a binary tree, invert the tree, and return its root.",
    platformName: "LeetCode"
  },
  {
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    category: "DSA",
    tags: ["dsa", "tree", "binary-tree", "bfs"],
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
    platformName: "LeetCode"
  },

  // Graphs
  {
    title: "Number of Islands",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/number-of-islands/",
    category: "DSA",
    tags: ["dsa", "graph", "dfs", "bfs"],
    description: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    platformName: "LeetCode"
  },
  {
    title: "Course Schedule",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/course-schedule/",
    category: "DSA",
    tags: ["dsa", "graph", "topological-sort", "dfs"],
    description: "There are a total of numCourses courses you have to take. Can you finish all courses?",
    platformName: "LeetCode"
  },

  // Dynamic Programming
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/climbing-stairs/",
    category: "DSA",
    tags: ["dsa", "dynamic-programming", "recursion"],
    description: "You are climbing a staircase. It takes n steps to reach the top. How many distinct ways can you climb to the top?",
    platformName: "LeetCode"
  },
  {
    title: "House Robber",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/house-robber/",
    category: "DSA",
    tags: ["dsa", "dynamic-programming"],
    description: "You are a robber planning to rob houses along a street. You cannot rob two adjacent houses.",
    platformName: "LeetCode"
  },
  {
    title: "Coin Change",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/coin-change/",
    category: "DSA",
    tags: ["dsa", "dynamic-programming"],
    description: "You are given an integer array coins and an integer amount. Return the fewest number of coins needed to make up that amount.",
    platformName: "LeetCode"
  },

  // Linked Lists
  {
    title: "Reverse Linked List",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/reverse-linked-list/",
    category: "DSA",
    tags: ["dsa", "linked-list", "recursion"],
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    platformName: "LeetCode"
  },
  {
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/merge-two-sorted-lists/",
    category: "DSA",
    tags: ["dsa", "linked-list", "recursion"],
    description: "You are given the heads of two sorted linked lists. Merge the two lists into one sorted list.",
    platformName: "LeetCode"
  },

  // Stacks and Queues
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/valid-parentheses/",
    category: "DSA",
    tags: ["dsa", "stack", "string"],
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    platformName: "LeetCode"
  },

  // Heaps
  {
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    category: "DSA",
    tags: ["dsa", "heap", "priority-queue"],
    description: "Given an integer array nums and an integer k, return the kth largest element in the array.",
    platformName: "LeetCode"
  },

  // Greedy
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    category: "DSA",
    tags: ["dsa", "greedy", "array"],
    description: "You want to maximize your profit by choosing a single day to buy one stock and a different day to sell that stock.",
    platformName: "LeetCode"
  },

  // Backtracking
  {
    title: "Generate Parentheses",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/generate-parentheses/",
    category: "DSA",
    tags: ["dsa", "backtracking", "recursion"],
    description: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    platformName: "LeetCode"
  }
];

const createSampleProblems = async () => {
  try {
    console.log('Creating sample programming problems...');
    
    // Clear existing problems first
    await ProgrammingProblem.deleteMany({});
    console.log('Cleared existing problems');
    
    // Insert sample problems
    await ProgrammingProblem.insertMany(sampleProblems);
    console.log(`✅ Created ${sampleProblems.length} sample programming problems`);
    
    // Print summary
    const totalProblems = await ProgrammingProblem.countDocuments();
    const dsaProblems = await ProgrammingProblem.countDocuments({
      $or: [
        { category: "DSA" },
        { tags: { $in: ["dsa"] } }
      ]
    });
    
    console.log(`📊 Database Summary:`);
    console.log(`   Total Problems: ${totalProblems}`);
    console.log(`   DSA Problems: ${dsaProblems}`);
    console.log(`   Easy: ${await ProgrammingProblem.countDocuments({ difficulty: "Easy" })}`);
    console.log(`   Medium: ${await ProgrammingProblem.countDocuments({ difficulty: "Medium" })}`);
    console.log(`   Hard: ${await ProgrammingProblem.countDocuments({ difficulty: "Hard" })}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating sample problems:', error);
    process.exit(1);
  }
};

createSampleProblems();
