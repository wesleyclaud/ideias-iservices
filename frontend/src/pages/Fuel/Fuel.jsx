import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PageLayout from '../../components/ui/PageLayout';
import { Table, Pagination } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import styles from './Fuel.module.css';

const columns = [
  { key: 'vehiclePlate', label: 'Placa', width: '120px' },
  { key: 'driver', label: 'Motorista', render: (v) => v?.name || '—' },
  { key: 'liters', label: 'Litros', render: (v) => `${parseFloat(v).toFixed(2)} L` },
  { key: 'costPerLiter', label: 'R$/L', render: (v) => `R$ ${parseFloat(v).toFixed(4)}` },
  { key: 'totalCost', label: 'Total', render: (v) => `R$ ${parseFloat(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` },
  { key: 'odometer', label: 'Odômetro', render: (v) => v ? `${v} km` : '—' },
  { key: 'fueledAt', label: 'Data', render: (v) => new Date(v).toLocaleDateString('pt-BR') },
];

export default function Fuel() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ vehiclePlate: '', liters: '', costPerLiter: '', odometer: '', fueledAt: new Date().toISOString().split('T')[0] });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/fuel', { params: { page, limit: 15 } });
      setData(res.data.data);
      setTotal(res.data.total);
    } catch { toast.error('Erro ao carregar registros.'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.vehiclePlate || !form.liters || !form.costPerLiter) { toast.error('Preencha os campos obrigatórios.'); return; }
    setSaving(true);
    try {
      const me = await api.get('/auth/me');
      await api.post('/fuel', { ...form, driverId: me.data.user.id });
      toast.success('Registro criado!');
      setModalOpen(false);
      fetchData();
    } catch { toast.error('Erro ao criar registro.'); }
    finally { setSaving(false); }
  };

  return (
    <PageLayout actions={
      <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Novo Registro</Button>
    }>
      <div className={styles.tableCard}>
        <Table columns={columns} data={data} loading={loading} />
        <Pagination page={page} total={total} limit={15} onPage={setPage} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Registro de Combustível">
        <form onSubmit={handleCreate} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}><label>Placa *</label><input value={form.vehiclePlate} onChange={(e) => setForm({ ...form, vehiclePlate: e.target.value })} placeholder="ABC-1234" /></div>
            <div className={styles.field}><label>Data *</label><input type="date" value={form.fueledAt} onChange={(e) => setForm({ ...form, fueledAt: e.target.value })} /></div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}><label>Litros *</label><input type="number" step="0.01" value={form.liters} onChange={(e) => setForm({ ...form, liters: e.target.value })} placeholder="0.00" /></div>
            <div className={styles.field}><label>R$/Litro *</label><input type="number" step="0.0001" value={form.costPerLiter} onChange={(e) => setForm({ ...form, costPerLiter: e.target.value })} placeholder="0.0000" /></div>
            <div className={styles.field}><label>Odômetro (km)</label><input type="number" value={form.odometer} onChange={(e) => setForm({ ...form, odometer: e.target.value })} placeholder="0" /></div>
          </div>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Salvar</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
