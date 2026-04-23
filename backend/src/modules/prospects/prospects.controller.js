const { Prospect } = require('../../models');
const { Op } = require('sequelize');

const list = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) where.companyName = { [Op.like]: `%${search}%` };

    const { count, rows } = await Prospect.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    res.json({ total: count, page: parseInt(page), data: rows });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const prospect = await Prospect.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(prospect);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const prospect = await Prospect.findByPk(req.params.id);
    if (!prospect) return res.status(404).json({ error: 'Prospect não encontrado.' });
    await prospect.update(req.body);
    res.json(prospect);
  } catch (err) { next(err); }
};

module.exports = { list, create, update };
