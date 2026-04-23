'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    const [users] = await queryInterface.sequelize.query("SELECT id, role FROM users LIMIT 5");
    const adminId = users.find(u => u.role === 'admin')?.id || users[0].id;
    const tecnicoId = users.find(u => u.role === 'tecnico')?.id || users[0].id;

    // Service Orders
    const statuses = ['pendente', 'em_andamento', 'executada', 'qualificada', 'faturada'];
    const priorities = ['baixa', 'media', 'alta', 'urgente'];
    const serviceOrders = Array.from({ length: 10 }, (_, i) => ({
      id: uuidv4(),
      code: `OS-${String(i + 1).padStart(5, '0')}`,
      title: `Manutenção preventiva ${i + 1}`,
      description: `Descrição da ordem de serviço ${i + 1}`,
      status: statuses[i % statuses.length],
      priority: priorities[i % priorities.length],
      assigned_to: tecnicoId,
      created_by: adminId,
      scheduled_at: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)),
      created_at: now,
      updated_at: now,
    }));
    await queryInterface.bulkInsert('service_orders', serviceOrders);

    // Contracts
    const contracts = Array.from({ length: 5 }, (_, i) => ({
      id: uuidv4(),
      code: `CTR-${String(i + 1).padStart(5, '0')}`,
      title: `Contrato de Manutenção ${i + 1}`,
      client_name: `Empresa Cliente ${i + 1}`,
      value: (10000 + i * 5000).toFixed(2),
      start_date: '2024-01-01',
      end_date: i < 3 ? '2025-12-31' : '2023-12-31',
      status: i < 3 ? 'ativo' : 'encerrado',
      created_by: adminId,
      created_at: now,
      updated_at: now,
    }));
    await queryInterface.bulkInsert('contracts', contracts);

    // Documents
    const today = new Date();
    const in20 = new Date(today); in20.setDate(today.getDate() + 20);
    const in40 = new Date(today); in40.setDate(today.getDate() + 40);
    const past = new Date(today); past.setDate(today.getDate() - 10);
    const documents = [
      { id: uuidv4(), title: 'Licença de Operação', type: 'Licença', expiry_date: in20.toISOString().split('T')[0], status: 'a_vencer', created_by: adminId, created_at: now, updated_at: now },
      { id: uuidv4(), title: 'Certificado de Calibração', type: 'Certificado', expiry_date: past.toISOString().split('T')[0], status: 'vencido', created_by: adminId, created_at: now, updated_at: now },
      { id: uuidv4(), title: 'Apólice de Seguro', type: 'Seguro', expiry_date: in40.toISOString().split('T')[0], status: 'vigente', created_by: adminId, created_at: now, updated_at: now },
      { id: uuidv4(), title: 'Alvará Municipal', type: 'Alvará', expiry_date: in20.toISOString().split('T')[0], status: 'a_vencer', created_by: adminId, created_at: now, updated_at: now },
      { id: uuidv4(), title: 'Laudo de Vistoria', type: 'Laudo', expiry_date: past.toISOString().split('T')[0], status: 'vencido', created_by: adminId, created_at: now, updated_at: now },
      { id: uuidv4(), title: 'Contrato Social', type: 'Societário', expiry_date: null, status: 'vigente', created_by: adminId, created_at: now, updated_at: now },
      { id: uuidv4(), title: 'Certificado NR-10', type: 'Certificado', expiry_date: in40.toISOString().split('T')[0], status: 'vigente', created_by: adminId, created_at: now, updated_at: now },
      { id: uuidv4(), title: 'AVCB', type: 'Licença', expiry_date: past.toISOString().split('T')[0], status: 'vencido', created_by: adminId, created_at: now, updated_at: now },
    ];
    await queryInterface.bulkInsert('documents', documents);

    // Prospects
    const prospects = [
      { id: uuidv4(), company_name: 'Indústria Alpha Ltda', contact_name: 'João Silva', email: 'joao@alpha.com', phone: '(11) 99999-0001', status: 'novo', created_by: adminId, created_at: now, updated_at: now },
      { id: uuidv4(), company_name: 'Comércio Beta SA', contact_name: 'Maria Santos', email: 'maria@beta.com', phone: '(21) 99999-0002', status: 'contatado', created_by: adminId, created_at: now, updated_at: now },
      { id: uuidv4(), company_name: 'Tech Gama ME', contact_name: 'Carlos Oliveira', email: 'carlos@gama.com', phone: '(31) 99999-0003', status: 'qualificado', created_by: adminId, created_at: now, updated_at: now },
    ];
    await queryInterface.bulkInsert('prospects', prospects);

    // Fuel Records
    const fuelRecords = Array.from({ length: 5 }, (_, i) => ({
      id: uuidv4(),
      vehicle_plate: `ABC-${1234 + i}`,
      driver_id: tecnicoId,
      liters: (40 + i * 5).toFixed(2),
      cost_per_liter: '5.8500',
      total_cost: ((40 + i * 5) * 5.85).toFixed(2),
      odometer: 10000 + i * 500,
      fueled_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      created_by: adminId,
      created_at: now,
      updated_at: now,
    }));
    await queryInterface.bulkInsert('fuel_records', fuelRecords);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('fuel_records', null, {});
    await queryInterface.bulkDelete('prospects', null, {});
    await queryInterface.bulkDelete('documents', null, {});
    await queryInterface.bulkDelete('contracts', null, {});
    await queryInterface.bulkDelete('service_orders', null, {});
  },
};
