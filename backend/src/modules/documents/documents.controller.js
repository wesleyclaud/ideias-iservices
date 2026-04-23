const { Document } = require('../../models');
const { Op } = require('sequelize');

const list = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) where.title = { [Op.like]: `%${search}%` };

    const { count, rows } = await Document.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    res.json({ total: count, page: parseInt(page), data: rows });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Documento não encontrado.' });
    res.json(doc);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const doc = await Document.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(doc);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Documento não encontrado.' });
    await doc.update(req.body);
    res.json(doc);
  } catch (err) { next(err); }
};

const counts = async (req, res, next) => {
  try {
    const today = new Date();
    const in30 = new Date();
    in30.setDate(today.getDate() + 30);

    const [aVencer, vencidos] = await Promise.all([
      Document.count({ where: { expiryDate: { [Op.between]: [today, in30] }, status: { [Op.ne]: 'vencido' } } }),
      Document.count({ where: { status: 'vencido' } }),
    ]);
    res.json({ aVencer, vencidos });
  } catch (err) { next(err); }
};

module.exports = { list, getOne, create, update, counts };
