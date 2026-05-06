const HallMealPrice = require('../models/HallMealPrice');
const MealClosure = require('../models/MealClosure');
const SpecialMeal = require('../models/SpecialMeal');
const MealOrder = require('../models/MealOrder');
const StudentDeposit = require('../models/StudentDeposit');
const User = require('../models/User');

class MealController {
  constructor() {
    this.hallMap = new Map([
      ['smr hall', 'SMR Hall'],
      ['mm hall', 'MM Hall'],
      ['bptb hall', 'BPTB Hall'],
      ['tr hall', 'TR Hall'],
    ]);

    this.maleHalls = ['SMR Hall', 'MM Hall'];
    this.femaleHalls = ['BPTB Hall', 'TR Hall'];
  }

  normalizeHall(input) {
    if (!input || typeof input !== 'string') return null;
    const key = input.trim().toLowerCase();
    if (this.hallMap.has(key)) {
      return this.hallMap.get(key);
    }

    const allHalls = [...this.maleHalls, ...this.femaleHalls];
    const match = allHalls.find((hall) => hall.toLowerCase() === key);
    return match || null;
  }

  normalizeHallScope(input) {
    if (!input || typeof input !== 'string') return null;
    const key = input.trim().toLowerCase();
    if (key === 'all' || key === 'all halls') return 'ALL';
    return this.normalizeHall(input);
  }

  getAllowedHallsByGender(gender) {
    if (gender === 'male') return this.maleHalls;
    if (gender === 'female') return this.femaleHalls;
    return [...this.maleHalls, ...this.femaleHalls];
  }

  getDayStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  async isMealClosed(targetDate, hall) {
    const dayStart = this.getDayStart(targetDate);
    const closure = await MealClosure.findOne({
      startDate: { $lte: dayStart },
      endDate: { $gte: dayStart },
      hall: { $in: [hall, 'ALL'] },
    });

    return !!closure;
  }

  async getSpecialMealsForDate(targetDate, hall) {
    const dayStart = this.getDayStart(targetDate);
    const nextDay = new Date(dayStart);
    nextDay.setDate(nextDay.getDate() + 1);

    const specials = await SpecialMeal.find({
      date: { $gte: dayStart, $lt: nextDay },
      hall,
    }).sort({ mealType: 1, createdAt: -1 });

    const map = { lunch: null, dinner: null };
    for (const special of specials) {
      map[special.mealType] = special;
    }

    return map;
  }
  parseMealDateInput(mealDateInput) {
    if (!mealDateInput) return null;

    let dateValue = mealDateInput;
    if (typeof mealDateInput === 'string' && !mealDateInput.includes('T')) {
      dateValue = `${mealDateInput}T00:00:00`;
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return null;

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  getMealDateBounds() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const minDate = new Date(todayStart);
    minDate.setDate(minDate.getDate() + 1);
    const maxDate = new Date(todayStart);
    maxDate.setDate(maxDate.getDate() + 2);

    return { todayStart, minDate, maxDate };
  }

  getOrderDeadline(targetDate) {
    const deadline = new Date(targetDate);
    deadline.setHours(0, 0, 0, 0);
    return deadline;
  }

  getDefaultMealDate() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return tomorrow;
  }
  async getEffectivePricesForDate(targetDate, hall) {
    const effectiveDate = targetDate instanceof Date ? targetDate : new Date(targetDate);
    if (Number.isNaN(effectiveDate.getTime())) {
      throw new Error('Invalid effective date');
    }

    const mealTypes = ['lunch', 'dinner'];
    const priceData = {
      lunch: null,
      dinner: null,
    };

    for (const mealType of mealTypes) {
      let price = await HallMealPrice.findOne({
        hall,
        mealType,
        effectiveFrom: { $lte: effectiveDate },
      })
        .sort({ effectiveFrom: -1, createdAt: -1 })
        .populate('updatedBy', 'name');

      if (!price) {
        price = await HallMealPrice.findOne({ hall, mealType })
          .sort({ effectiveFrom: -1, createdAt: -1 })
          .populate('updatedBy', 'name');
      }

      if (price) {
        priceData[mealType] = {
          chicken: price.chickenPrice,
          fish: price.fishPrice,
          updatedAt: price.updatedAt,
          effectiveFrom: price.effectiveFrom,
        };
      }
    }

    return priceData;
  }

  // Get current meal prices
  async getMealPrices(req, res) {
    try {
      const dateParam = req.query.date;
      const hallParam = req.query.hall;
      const hall = this.normalizeHall(hallParam);
      if (!hall) {
        return res.status(400).json({ error: 'Hall is required' });
      }
      const targetDate = dateParam ? new Date(dateParam) : new Date();
      const priceData = await this.getEffectivePricesForDate(targetDate, hall);

      res.status(200).json({
        message: 'Meal prices retrieved successfully',
        data: priceData,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update meal prices (Admin only)
  async updateMealPrices(req, res) {
    try {
      const { chickenPrice, fishPrice, effectiveFrom, hall: hallBody } = req.body;
      const mealType = req.params.mealType || req.body.mealType;
      const hall = this.normalizeHall(hallBody);
      const adminId = req.user.id;

      if (!hall) {
        return res.status(400).json({ error: 'Valid hall is required' });
      }

      // Validate input
      if (!['lunch', 'dinner'].includes(mealType)) {
        return res.status(400).json({ error: 'Invalid meal type' });
      }

      if (chickenPrice === undefined || chickenPrice === null || fishPrice === undefined || fishPrice === null) {
        return res.status(400).json({ error: 'Please provide both chicken and fish prices' });
      }

      const chickenPriceNum = parseFloat(chickenPrice);
      const fishPriceNum = parseFloat(fishPrice);

      if (isNaN(chickenPriceNum) || isNaN(fishPriceNum)) {
        return res.status(400).json({ error: 'Prices must be valid numbers' });
      }

      if (chickenPriceNum < 0 || fishPriceNum < 0) {
        return res.status(400).json({ error: 'Prices cannot be negative' });
      }

      const effectiveDate = effectiveFrom ? new Date(effectiveFrom) : new Date();
      if (Number.isNaN(effectiveDate.getTime())) {
        return res.status(400).json({ error: 'Effective date is invalid' });
      }

      const mealPrice = await HallMealPrice.findOneAndUpdate(
        { hall, mealType },
        {
          hall,
          mealType,
          chickenPrice: chickenPriceNum,
          fishPrice: fishPriceNum,
          effectiveFrom: effectiveDate,
          updatedBy: adminId,
          updatedAt: new Date(),
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      ).populate('updatedBy', 'name');

      res.status(200).json({
        message: 'Meal prices updated successfully',
        data: mealPrice,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get student deposit information
  async getStudentDeposit(req, res) {
    try {
      const userId = req.user.id;

      let deposit = await StudentDeposit.findOne({ student: userId });

      if (!deposit) {
        deposit = new StudentDeposit({
          student: userId,
          totalPaid: 0,
          remainingBalance: 0,
          transactionHistory: [],
        });
        await deposit.save();
      }

      res.status(200).json({
        message: 'Deposit information retrieved',
        data: {
          totalPaid: deposit.totalPaid,
          remainingBalance: deposit.remainingBalance,
          transactionHistory: deposit.transactionHistory,
        },
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Add money to deposit (fake payment)
  async addDeposit(req, res) {
    try {
      const { amount, paymentMethod } = req.body;
      const userId = req.user.id;

      // Validate input
      if (amount === undefined || amount === null) {
        return res.status(400).json({ error: 'Amount is required' });
      }

      const amountNum = parseFloat(amount);

      if (isNaN(amountNum) || amountNum <= 0) {
        return res.status(400).json({ error: 'Amount must be a valid positive number' });
      }

      if (!['bkash', 'nagad', 'rocket'].includes(paymentMethod)) {
        return res.status(400).json({ error: 'Invalid payment method' });
      }

      let deposit = await StudentDeposit.findOne({ student: userId });

      if (!deposit) {
        deposit = new StudentDeposit({
          student: userId,
          totalPaid: amountNum,
          remainingBalance: amountNum,
          transactionHistory: [
            {
              type: 'deposit',
              amount: amountNum,
              paymentMethod,
              description: `Deposit added via ${paymentMethod}`,
              date: new Date(),
            },
          ],
        });
      } else {
        deposit.totalPaid += amountNum;
        deposit.remainingBalance += amountNum;
        deposit.transactionHistory.push({
          type: 'deposit',
          amount: amountNum,
          paymentMethod,
          description: `Deposit added via ${paymentMethod}`,
          date: new Date(),
        });
      }

      await deposit.save();

      res.status(200).json({
        message: 'Deposit added successfully',
        data: {
          totalPaid: deposit.totalPaid,
          remainingBalance: deposit.remainingBalance,
        },
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Create meal order
  async createMealOrder(req, res) {
    try {
      const { meals, paymentMethod, mealDate, hall: hallBody } = req.body;
      const userId = req.user.id;
      const hall = this.normalizeHall(hallBody);
      if (!hall) {
        return res.status(400).json({ error: 'Valid hall is required' });
      }

      const user = await User.findById(userId).select('gender');
      const allowedHalls = this.getAllowedHallsByGender(user?.gender);
      if (!allowedHalls.includes(hall)) {
        return res.status(400).json({ error: 'Selected hall is not allowed for your profile' });
      }

      // Validate meals
      if (!meals || !Array.isArray(meals) || meals.length === 0) {
        return res.status(400).json({ error: 'Invalid meals data' });
      }

      // Validate payment method
      if (!['deposit', 'bkash', 'nagad', 'rocket'].includes(paymentMethod)) {
        return res.status(400).json({ error: 'Invalid payment method' });
      }

      const targetDate = this.parseMealDateInput(mealDate) || this.getDefaultMealDate();
      const { minDate, maxDate } = this.getMealDateBounds();

      if (targetDate < minDate || targetDate > maxDate) {
        return res.status(400).json({
          error: 'Meal date must be between tomorrow and two days from today',
        });
      }

      const deadline = this.getOrderDeadline(targetDate);
      const now = new Date();
      if (now >= deadline) {
        return res.status(400).json({
          error: 'Meal ordering is closed for the selected date',
          deadline: deadline.toISOString(),
        });
      }

      const isClosed = await this.isMealClosed(targetDate, hall);
      if (isClosed) {
        return res.status(400).json({
          error: 'Meal ordering is closed for the selected date and hall',
        });
      }

      const specialMeals = await this.getSpecialMealsForDate(targetDate, hall);

      const priceData = await this.getEffectivePricesForDate(targetDate, hall);

      if (!priceData.lunch && !priceData.dinner && !specialMeals.lunch && !specialMeals.dinner) {
        return res.status(400).json({ error: 'Meal prices not configured by admin' });
      }
      const priceMap = {
        lunch: priceData.lunch || null,
        dinner: priceData.dinner || null,
      };

      // Validate and calculate total price
      let totalPrice = 0;
      const processedMeals = [];

      for (const meal of meals) {
        if (!['lunch', 'dinner'].includes(meal.mealType)) {
          return res.status(400).json({ error: 'Invalid meal type' });
        }

        if (!['chicken', 'fish', 'special'].includes(meal.mealOption)) {
          return res.status(400).json({ error: 'Invalid meal option' });
        }

        let price = null;
        if (specialMeals[meal.mealType]) {
          if (meal.mealOption !== 'special') {
            return res.status(400).json({
              error: `Normal meals are disabled for ${meal.mealType} on this date`,
            });
          }
          price = specialMeals[meal.mealType].price;
        } else {
          if (meal.mealOption === 'special') {
            return res.status(400).json({
              error: `Special meal is not available for ${meal.mealType}`,
            });
          }
          price = priceMap[meal.mealType]?.[meal.mealOption];
        }

        if (!price) {
          return res.status(400).json({ error: `Price not set for ${meal.mealType} - ${meal.mealOption}` });
        }

        totalPrice += price;

        // Generate unique token
        const token = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

        processedMeals.push({
          mealType: meal.mealType,
          mealOption: meal.mealOption,
          price,
          token,
        });
      }

      // Check if using deposit
      if (paymentMethod === 'deposit') {
        const deposit = await StudentDeposit.findOne({ student: userId });
        
        if (!deposit || deposit.remainingBalance < totalPrice) {
          return res.status(400).json({ 
            error: 'Insufficient deposit balance',
            required: totalPrice,
            available: deposit?.remainingBalance || 0,
          });
        }

        // Deduct from deposit
        deposit.remainingBalance -= totalPrice;
        deposit.transactionHistory.push({
          type: 'meal_charge',
          amount: totalPrice,
          description: 'Meal order charge',
          date: new Date(),
        });
        await deposit.save();
      }

      // Create meal order
      const mealOrder = new MealOrder({
        student: userId,
        mealDate: targetDate,
        hall,
        meals: processedMeals,
        totalPrice,
        paymentMethod,
        status: 'confirmed',
        transactionId: `TXN-${Date.now()}`,
      });

      await mealOrder.save();
      await mealOrder.populate('student', 'name studentId email');

      res.status(201).json({
        message: 'Meal order created successfully',
        data: {
          orderId: mealOrder._id,
          meals: processedMeals,
          totalPrice,
          mealDate: mealOrder.mealDate,
          hall: mealOrder.hall,
          status: 'confirmed',
        },
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get student's meal orders
  async getStudentMealOrders(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const orders = await MealOrder.find({ student: userId })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await MealOrder.countDocuments({ student: userId });

      res.status(200).json({
        message: 'Meal orders retrieved',
        data: orders,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
        },
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all meal orders (Admin)
  async getAllMealOrders(req, res) {
    try {
      const { page = 1, limit = 20, status } = req.query;

      let filter = {};
      if (status) filter.status = status;

      const orders = await MealOrder.find(filter)
        .populate('student', 'name studentId email')
        .sort({ mealDate: -1, createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await MealOrder.countDocuments(filter);

      res.status(200).json({
        message: 'All meal orders retrieved',
        data: orders,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
        },
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Check if student can order meals (before midnight)
  async canOrderMeals(req, res) {
    try {
      const dateParam = req.query.date;
      const hallParam = req.query.hall;
      const hall = this.normalizeHall(hallParam);
      if (!hall) {
        return res.status(200).json({
          message: 'Hall is required',
          canOrder: false,
        });
      }
      const targetDate = this.parseMealDateInput(dateParam) || this.getDefaultMealDate();
      const { minDate, maxDate } = this.getMealDateBounds();

      if (targetDate < minDate || targetDate > maxDate) {
        return res.status(200).json({
          message: 'Meal date must be between tomorrow and two days from today',
          canOrder: false,
          targetDate: targetDate.toISOString(),
        });
      }

      const now = new Date();
      const deadline = this.getOrderDeadline(targetDate);
      const canOrder = now < deadline;
      if (!canOrder) {
        return res.status(200).json({
          message: 'Meal ordering is closed for the selected date',
          canOrder: false,
          targetDate: targetDate.toISOString(),
          deadline: deadline.toISOString(),
        });
      }

      const isClosed = await this.isMealClosed(targetDate, hall);
      if (isClosed) {
        return res.status(200).json({
          message: 'Meal ordering is closed for the selected date and hall',
          canOrder: false,
          targetDate: targetDate.toISOString(),
        });
      }

      res.status(200).json({
        message: 'Meal ordering is open',
        canOrder: true,
        targetDate: targetDate.toISOString(),
        deadline: deadline.toISOString(),
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMealClosures(req, res) {
    try {
      const closures = await MealClosure.find({})
        .sort({ date: -1, createdAt: -1 })
        .populate('createdBy', 'name');

      res.status(200).json({
        message: 'Meal closures retrieved',
        data: closures,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getSpecialMeals(req, res) {
    try {
      const dateParam = req.query.date;
      const hallParam = req.query.hall;
      const hall = this.normalizeHall(hallParam);
      if (!hall) {
        return res.status(400).json({ error: 'Hall is required' });
      }

      const targetDate = this.parseMealDateInput(dateParam) || this.getDefaultMealDate();
      const specialMeals = await this.getSpecialMealsForDate(targetDate, hall);

      res.status(200).json({
        message: 'Special meals retrieved',
        data: specialMeals,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAdminSpecialMeals(req, res) {
    try {
      const specials = await SpecialMeal.find({})
        .sort({ date: -1, mealType: 1, createdAt: -1 })
        .populate('createdBy', 'name');

      res.status(200).json({
        message: 'Special meals retrieved',
        data: specials,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createSpecialMeal(req, res) {
    try {
      const { date, hall, mealType, title, description, price } = req.body;
      const adminId = req.user.id;

      const parsedDate = this.parseMealDateInput(date);
      if (!parsedDate) {
        return res.status(400).json({ error: 'Valid date is required' });
      }

      const hallScope = this.normalizeHall(hall);
      if (!hallScope) {
        return res.status(400).json({ error: 'Valid hall is required' });
      }

      if (!['lunch', 'dinner'].includes(mealType)) {
        return res.status(400).json({ error: 'Invalid meal type' });
      }

      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const priceNum = parseFloat(price);
      if (Number.isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({ error: 'Valid price is required' });
      }

      const dayStart = this.getDayStart(parsedDate);

      const special = await SpecialMeal.findOneAndUpdate(
        { date: dayStart, hall: hallScope, mealType },
        {
          date: dayStart,
          hall: hallScope,
          mealType,
          title: title.trim(),
          description: description?.trim() || '',
          price: priceNum,
          createdBy: adminId,
        },
        {
          upsert: true,
          returnDocument: 'after',
          setDefaultsOnInsert: true,
        }
      ).populate('createdBy', 'name');

      res.status(200).json({
        message: 'Special meal saved',
        data: special,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteSpecialMeal(req, res) {
    try {
      const { id } = req.params;
      const removed = await SpecialMeal.findByIdAndDelete(id);
      if (!removed) {
        return res.status(404).json({ error: 'Special meal not found' });
      }

      res.status(200).json({ message: 'Special meal removed' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createMealClosure(req, res) {
    try {
      const { startDate, endDate, hall } = req.body;
      const adminId = req.user.id;

      const parsedStartDate = this.parseMealDateInput(startDate);
      const parsedEndDate = this.parseMealDateInput(endDate || startDate);
      if (!parsedStartDate || !parsedEndDate) {
        return res.status(400).json({ error: 'Valid start and end dates are required' });
      }

      const startDay = this.getDayStart(parsedStartDate);
      const endDay = this.getDayStart(parsedEndDate);
      if (endDay < startDay) {
        return res.status(400).json({ error: 'End date cannot be before start date' });
      }

      const hallScope = this.normalizeHallScope(hall);
      if (!hallScope) {
        return res.status(400).json({ error: 'Valid hall scope is required' });
      }

      const closure = await MealClosure.findOneAndUpdate(
        { startDate: startDay, endDate: endDay, hall: hallScope },
        {
          startDate: startDay,
          endDate: endDay,
          hall: hallScope,
          createdBy: adminId,
        },
        {
          upsert: true,
          returnDocument: 'after',
          setDefaultsOnInsert: true,
        }
      ).populate('createdBy', 'name');

      res.status(200).json({
        message: 'Meal closure saved',
        data: closure,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteMealClosure(req, res) {
    try {
      const { id } = req.params;
      const removed = await MealClosure.findByIdAndDelete(id);
      if (!removed) {
        return res.status(404).json({ error: 'Meal closure not found' });
      }

      res.status(200).json({ message: 'Meal closure removed' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = MealController;
