const { FuelRecord, User } = require('../../models');

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { count, rows } = await FuelRecord.findAndCountAll({
      include: [{ model: User, as: 'driver', attributes: ['id', 'name'] }],
      order: [['fueledAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    res.json({ total: count, page: parseInt(page), data: rows });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { vehiclePlate, driverId, liters, costPerLiter, odometer, fueledAt } = req.body;
    const totalCost = (parseFloat(liters) * parseFloat(costPerLiter)).toFixed(2);
    const record = await FuelRecord.create({
      vehiclePlate, driverId, liters, costPerLiter, totalCost, odometer, fueledAt, createdBy: req.user.id,
    });
    res.status(201).json(record);
  } catch (err) { next(err); }
};

module.exports = { list, create };
