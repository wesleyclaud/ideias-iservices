import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PageLayout from '../../components/ui/PageLayout';
import { Table, TableSearch, Pagination } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import styles from './Prospects.module.css';

const columns = [
  { key: 'companyName', label: 'Empresa' },
  { key: 'contactName', label: 'Contato' },
  { key: 'email', label: 'E-mail', render: (v) => v || '—' },
  { key: 'phone', label: 'Telefone', width: '150px', render: (v) => v || '—' },
  { key: 'status', label: 'Status', width: '130px', render: (v) => <Badge status={v} /> },
  { key: 'createdAt', label: 'Cadastro', width: '130px', render: (v) => new Date(v).toLocaleDateString('pt-BR') },
];

export default function Prospects() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ companyName: '', contactName: '', email: '', phone: '', notes: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/prospects', { params: { page, search, limit: 15 } });
      setData(res.data.data);
      setTotal(res.data.total);
    } catch { toast.error('Erro ao carregar prospects.'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.companyName || !form.contactName) { toast.error('Empresa e contato são obrigatórios.'); return; }
    setSaving(true);
    try {
      await api.post('/prospects', form);
      toast.success('Prospect cadastrado!');
      setModalOpen(false);
      setForm({ companyName: '', contactName: '', email: '', phone: '', notes: '' });
      fetchData();
    } catch { toast.error('Erro ao cadastrar prospect.'); }
    finally { setSaving(false); }
  };

  return (
    <PageLayout actions={
      <>
        <TableSearch value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar prospect..." />
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Novo Prospect</Button>
      </>
    }>
      <div className={styles.tableCard}>
        <Table columns={columns} data={data} loading={loading} />
        <Pagination page={page} total={total} limit={15} onPage={setPage} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Prospect">
        <form onSubmit={handleCreate} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}><label>Empresa *</label><input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="Nome da empresa" /></div>
            <div className={styles.field}><label>Contato *</label><input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} placeholder="Nome do contato" /></div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}><label>E-mail</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contato@empresa.com" /></div>
            <div className={styles.field}><label>Telefone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(00) 00000-0000" /></div>
          </div>
          <div className={styles.field}><label>Observações</label><textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Anotações sobre o prospect..." /></div>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Cadastrar</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
