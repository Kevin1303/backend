const Todo = require('../models/todoModel');

// @desc    Get all todos
// @route   GET /api/todos
// @access  Private
exports.getAllTodos = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    const query = { userId: req.user.id };
    
    if (search) {
      query.todo = { $regex: search, $options: 'i' };
    }
    
    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'active') {
      query.completed = false;
    }
    
    const todos = await Todo.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await Todo.countDocuments(query);
    
    res.json({
      todos,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create todo
// @route   POST /api/todos
// @access  Private
exports.createTodo = async (req, res, next) => {
  try {
    const { todo } = req.body;
    
    const newTodo = await Todo.create({
      todo,
      userId: req.user.id,
    });
    
    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
exports.updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
exports.deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle todo completion
// @route   PATCH /api/todos/:id/toggle
// @access  Private
exports.toggleTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    todo.completed = !todo.completed;
    await todo.save();
    
    res.json(todo);
  } catch (error) {
    next(error);
  }
};