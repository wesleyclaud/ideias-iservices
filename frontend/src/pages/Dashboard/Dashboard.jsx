import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, PlusCircle, Calendar, BarChart2,
  CheckCircle, DollarSign, FileText, AlertTriangle,
  XCircle, UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getDashboardCounts } from '../../services/dashboardService';
import { SkeletonCard } from '../../components/ui/Skeleton';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newOSOpen, setNewOSOpen] = useState(false);
  const [newProspectOpen, setNewProspectOpen] = useState(false);
  const [osForm, setOsForm] = useState({ title: '', priority: 'media', description: '' });
  const [prospectForm, setProspectForm] = useState({ companyName: '', contactName: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDashboardCounts()
      .then(setCounts)
      .catch(() => toast.error('Erro ao carregar dados do dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  const handleNewOS = async (e) => {
    e.preventDefault();
    if (!osForm.title) { toast.error('Título obrigatório.'); return; }
    setSaving(true);
    try {
      await api.post('/service-orders', osForm);
      toast.success('OS criada com sucesso!');
      setNewOSOpen(false);
      setOsForm({ title: '', priority: 'media', description: '' });
      const updated = await getDashboardCounts();
      setCounts(updated);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao criar OS.');
    } finally { setSaving(false); }
  };

  const handleNewProspect = async (e) => {
    e.preventDefault();
    if (!prospectForm.companyName || !prospectForm.contactName) {
      toast.error('Empresa e contato são obrigatórios.'); return;
    }
    setSaving(true);
    try {
      await api.post('/prospects', prospectForm);
      toast.success('Prospect cadastrado!');
      setNewProspectOpen(false);
      setProspectForm({ companyName: '', contactName: '', email: '', phone: '' });
    } catch { toast.error('Erro ao cadastrar prospect.'); }
    finally { setSaving(false); }
  };

  const cards = counts ? [
    {
      icon: <ClipboardList size={24} />, color: 'blue',
      value: counts.os.em_andamento, label: 'Executar OS',
      sub: 'OS em andamento', action: () => navigate('/service-orders?status=em_andamento'),
    },
    {
      icon: <PlusCircle size={24} />, color: 'green',
      value: null, label: 'Nova Demanda',
      sub: 'Criar ordem de serviço', action: () => setNewOSOpen(true),
    },
    {
      icon: <Calendar size={24} />, color: 'yellow',
      value: counts.os.pendente, label: 'Planejar OS',
      sub: 'OS pendentes', action: () => navigate('/service-orders?status=pendente'),
    },
    {
      icon: <BarChart2 size={24} />, color: 'purple',
      value: null, label: 'Dashboard',
      sub: 'Gráficos de performance', action: () => toast('Em desenvolvimento', { icon: '🚧' }),
    },
    {
      icon: <CheckCircle size={24} />, color: 'teal',
      value: counts.os.executada, label: 'Qualificar OS',
      sub: 'OS executadas', action: () => navigate('/service-orders?status=executada'),
    },
    {
      icon: <DollarSign size={24} />, color: 'emerald',
      value: counts.os.qualificada, label: 'Faturamento',
      sub: 'OS qualificadas', action: () => navigate('/service-orders?status=qualificada'),
    },
    {
      icon: <FileText size={24} />, color: 'indigo',
      value: counts.contracts.ativos, label: 'Contratos',
      sub: 'Contratos ativos', action: () => navigate('/contracts'),
    },
    {
      icon: <AlertTriangle size={24} />, color: 'orange',
      value: counts.documents.aVencer, label: 'Docs a Vencer',
      sub: 'Próximos 30 dias', action: () => navigate('/documents?status=a_vencer'),
    },
    {
      icon: <XCircle size={24} />, color: 'red',
      value: counts.documents.vencidos, label: 'Docs Vencidos',
      sub: 'Documentos vencidos', action: () => navigate('/documents?status=vencido'),
    },
    {
      icon: <UserPlus size={24} />, color: 'pink',
      value: null, label: 'Novo Prospect',
      sub: 'Cadastrar prospect', action: () => setNewProspectOpen(true),
    },
  ] : [];

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <h2>Bem-vindo ao IDEIAS - iServices</h2>
        <p>Selecione uma ação para começar</p>
      </div>

      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          : cards.map((card, i) => (
            <button key={i} className={`${styles.card} ${styles[`card_${card.color}`]}`} onClick={card.action}>
              <div className={`${styles.cardIcon} ${styles[`icon_${card.color}`]}`}>
                {card.icon}
              </div>
              <div className={styles.cardBody}>
                {card.value !== null && (
                  <span className={styles.cardValue}>{card.value}</span>
                )}
                <span className={styles.cardLabel}>{card.label}</span>
                <span className={styles.cardSub}>{card.sub}</span>
              </div>
            </button>
          ))
        }
      </div>

      {/* Modal Nova OS */}
      <Modal open={newOSOpen} onClose={() => setNewOSOpen(false)} title="Nova Ordem de Serviço">
        <form onSubmit={handleNewOS} className={styles.modalForm}>
          <div className={styles.formField}>
            <label>Título *</label>
            <input value={osForm.title} onChange={(e) => setOsForm({ ...osForm, title: e.target.value })} placeholder="Descreva a OS..." />
          </div>
          <div className={styles.formField}>
            <label>Prioridade</label>
            <select value={osForm.priority} onChange={(e) => setOsForm({ ...osForm, priority: e.target.value })}>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
          <div className={styles.formField}>
            <label>Descrição</label>
            <textarea rows={3} value={osForm.description} onChange={(e) => setOsForm({ ...osForm, description: e.target.value })} placeholder="Detalhes da OS..." />
          </div>
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setNewOSOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Criar OS</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Novo Prospect */}
      <Modal open={newProspectOpen} onClose={() => setNewProspectOpen(false)} title="Novo Prospect">
        <form onSubmit={handleNewProspect} className={styles.modalForm}>
          <div className={styles.formField}>
            <label>Empresa *</label>
            <input value={prospectForm.companyName} onChange={(e) => setProspectForm({ ...prospectForm, companyName: e.target.value })} placeholder="Nome da empresa" />
          </div>
          <div className={styles.formField}>
            <label>Contato *</label>
            <input value={prospectForm.contactName} onChange={(e) => setProspectForm({ ...prospectForm, contactName: e.target.value })} placeholder="Nome do contato" />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>E-mail</label>
              <input type="email" value={prospectForm.email} onChange={(e) => setProspectForm({ ...prospectForm, email: e.target.value })} placeholder="email@empresa.com" />
            </div>
            <div className={styles.formField}>
              <label>Telefone</label>
              <input value={prospectForm.phone} onChange={(e) => setProspectForm({ ...prospectForm, phone: e.target.value })} placeholder="(00) 00000-0000" />
            </div>
          </div>
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setNewProspectOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Cadastrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
