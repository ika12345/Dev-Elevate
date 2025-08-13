import React, { useState } from 'react';
import { Plus, Search, Filter, DollarSign, TrendingUp, TrendingDown, PieChart as PieChartIcon, BarChart3, Calendar, Receipt } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Button } from '../ui/button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/modal';
import { Budget, Expense, useBudgets } from '../../contexts/AppContext';
import { formatDate, generateId } from '../../utils/helperAI';
import { AIService } from '../../services/aiService';

const COLORS = ['#2563eb', '#7c3aed', '#dc2626', '#16a34a', '#ea580c', '#0891b2'];

export const BudgetView: React.FC = () => {
  const { budgets, addBudget, updateBudget, deleteBudget } = useBudgets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [aiOptimization, setAiOptimization] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [newBudget, setNewBudget] = useState({
    name: '',
    description: '',
    totalAmount: 0,
    category: '',
  });
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Safety check for budgets
  if (!budgets) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="mx-auto mb-4 w-8 h-8 rounded-full border-4 border-blue-500 animate-spin border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading budgets...</p>
        </div>
      </div>
    );
  }

  const filteredBudgets = budgets.filter(budget =>
    budget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    budget.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    budget.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.totalAmount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  const budgetData = budgets.map(budget => ({
    name: budget.name,
    spent: budget.spent,
    remaining: budget.totalAmount - budget.spent,
    total: budget.totalAmount,
  }));

  const expensesByCategory = budgets.reduce((acc, budget) => {
    const existing = acc.find(item => item.name === budget.category);
    if (existing) {
      existing.value += budget.spent;
    } else {
      acc.push({ name: budget.category, value: budget.spent });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const handleCreateBudget = () => {
    if (!newBudget.name.trim()) return;

    const budget: Budget = {
      id: generateId(),
      name: newBudget.name,
      description: newBudget.description,
      totalAmount: newBudget.totalAmount,
      spent: 0,
      category: newBudget.category,
      createdAt: new Date(),
      updatedAt: new Date(),
      expenses: [],
    };

    addBudget(budget);
    setIsCreateModalOpen(false);
    setNewBudget({ name: '', description: '', totalAmount: 0, category: '' });
  };

  const handleAddExpense = () => {
    if (!selectedBudget || !newExpense.description.trim()) return;

    const expense: Expense = {
      id: generateId(),
      description: newExpense.description,
      amount: newExpense.amount,
      date: new Date(newExpense.date),
      category: newExpense.category,
    };

    const updatedBudget = {
      ...selectedBudget,
      expenses: [...selectedBudget.expenses, expense],
      spent: selectedBudget.spent + newExpense.amount,
      updatedAt: new Date(),
    };

    updateBudget(selectedBudget.id, updatedBudget);
    setIsExpenseModalOpen(false);
    setNewExpense({ description: '', amount: 0, category: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleOptimizeBudget = async () => {
    if (budgets.length === 0) return;

    try {
      setAiLoading(true);
      const expenses = budgets.map(budget => ({
        category: budget.category,
        amount: budget.spent,
      }));
      
      const optimization = await AIService.optimizeBudget(expenses);
      setAiOptimization(optimization);
    } catch (error) {
      console.error('Failed to optimize budget:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const BudgetCard: React.FC<{ budget: Budget }> = ({ budget }) => {
    const percentage = (budget.spent / budget.totalAmount) * 100;
    const isOverBudget = budget.spent > budget.totalAmount;
    
    return (
      <div
        className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:shadow-md"
        onClick={() => setSelectedBudget(budget)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {budget.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {budget.description}
            </p>
            <span className="inline-block px-2 py-1 mt-2 text-xs text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900/20 dark:text-blue-200">
              {budget.category}
            </span>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
              ${budget.spent.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              of ${budget.totalAmount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
              {percentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-orange-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {budget.expenses.length} expenses
            </span>
            <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              ${(budget.totalAmount - budget.spent).toLocaleString()} remaining
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Budget & Expenses</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Track spending and optimize your budget with AI insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={handleOptimizeBudget}
            loading={aiLoading}
          >
            <TrendingUp size={16} className="mr-2" />
            AI Optimize
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} className="mr-2" />
            New Budget
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalBudget.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/20">
              <DollarSign size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg dark:bg-red-900/20">
              <TrendingDown size={24} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalRemaining.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900/20">
              <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Optimization */}
      {aiOptimization && (
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <h3 className="mb-3 text-lg font-semibold text-blue-900 dark:text-blue-100">
            AI Budget Optimization
          </h3>
          <div className="max-w-none prose prose-blue dark:prose-invert">
            <p className="text-blue-800 whitespace-pre-wrap dark:text-blue-200">
              {aiOptimization}
            </p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Budget Progress */}
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Budget Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
              <Bar dataKey="remaining" fill="#e5e7eb" name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expenses by Category */}
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search budgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
        <Button variant="outline">
          <Filter size={16} className="mr-2" />
          Filter
        </Button>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBudgets.map(budget => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>

      {/* Create Budget Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Budget"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            placeholder="Budget name..."
            value={newBudget.name}
            onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
          />
          
          <textarea
            placeholder="Budget description..."
            value={newBudget.description}
            onChange={(e) => setNewBudget({ ...newBudget, description: e.target.value })}
            rows={3}
            className="p-3 w-full text-gray-900 bg-white rounded-lg border border-gray-300 resize-none dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Total amount"
              value={newBudget.totalAmount}
              onChange={(e) => setNewBudget({ ...newBudget, totalAmount: Number(e.target.value) })}
            />
            
            <Input
              placeholder="Category"
              value={newBudget.category}
              onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateBudget}
            >
              Create Budget
            </Button>
          </div>
        </div>
      </Modal>

      {/* Budget Detail Modal */}
      <Modal
        isOpen={!!selectedBudget}
        onClose={() => setSelectedBudget(null)}
        title={selectedBudget?.name || 'Budget Details'}
        size="xl"
      >
        {selectedBudget && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedBudget.name}
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {selectedBudget.description}
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setIsExpenseModalOpen(true)}
              >
                <Plus size={16} className="mr-2" />
                Add Expense
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ${selectedBudget.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ${selectedBudget.spent.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ${(selectedBudget.totalAmount - selectedBudget.spent).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Expenses ({selectedBudget.expenses.length})
              </h4>
              <div className="overflow-y-auto space-y-3 max-h-64">
                {selectedBudget.expenses.map(expense => (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                    <div className="flex items-center space-x-3">
                      <Receipt size={16} className="text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {expense.description}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {expense.category} • {formatDate(expense.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${expense.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Add New Expense"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            placeholder="Expense description..."
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
            />
            
            <Input
              placeholder="Category"
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            />
          </div>

          <Input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            label="Date"
          />

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsExpenseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddExpense}
            >
              Add Expense
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};