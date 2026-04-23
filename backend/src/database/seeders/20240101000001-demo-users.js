'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    const users = [
      { id: uuidv4(), name: 'Administrador', email: 'admin@ideias.com.br', password_hash: await bcrypt.hash('Admin@123', 12), role: 'admin', is_active: true, created_at: now, updated_at: now },
      { id: uuidv4(), name: 'Gestor Padrão', email: 'gestor@ideias.com.br', password_hash: await bcrypt.hash('Gestor@123', 12), role: 'gestor', is_active: true, created_at: now, updated_at: now },
      { id: uuidv4(), name: 'Coordenador Padrão', email: 'coordenador@ideias.com.br', password_hash: await bcrypt.hash('Coord@123', 12), role: 'coordenador', is_active: true, created_at: now, updated_at: now },
      { id: uuidv4(), name: 'Técnico Padrão', email: 'tecnico@ideias.com.br', password_hash: await bcrypt.hash('Tec@12345', 12), role: 'tecnico', is_active: true, created_at: now, updated_at: now },
      { id: uuidv4(), name: 'Financeiro Padrão', email: 'financeiro@ideias.com.br', password_hash: await bcrypt.hash('Fin@12345', 12), role: 'financeiro', is_active: true, created_at: now, updated_at: now },
    ];
    await queryInterface.bulkInsert('users', users);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
