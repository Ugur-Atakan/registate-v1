import { useEffect, useState } from 'react';
import { Building2, FileText, Clock, ArrowRight, AlertCircle, File, AArrowDown as Pdf, ExternalLink, BarChart3, Plus, Rocket, ArrowUpRight, Check, Info, ListTodo, CheckCircle2, CreditCard } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { CompanyResponse } from '../../types/Company';
import { setActiveCompany } from '../../store/slices/companySlice';
import { setActiveCompanyId } from '../../utils/storage';
import { getCompanyDetails, getCompanyDocuments, getCompanyTasks } from '../../http/requests/companyRequests';
import instance from '../../http/instance';
import NoCompanyComponent from '../../components/NoCompanyComponent';
import useQueryHandler from '../../hooks/useQueryHandler';
import LoadingComponent from '../../components/Loading';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const companies = useAppSelector((state) => state.company.companies);
  const user = useAppSelector((state) => state.user.userData);
  const activeCompanyId=useAppSelector((state)=>state.company.activeCompanyId);

  const {tryQuery}= useQueryHandler();

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

const getStatusText = (status: string) => {
    switch (status) {
      case 'PAYMENT_PENDING':
        return 'Payment Pending';
        case 'PAID':
        return 'Paid';
      case 'INPROGRESS':
        return 'In Progress';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      case 'PENDING':
        return 'Pending';
      default:
        return 'Unknown';
    }
  }
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600 bg-red-50';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50';
      case 'LOW':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };




  // Tüm verileri paralel fetch eden useEffect
  useEffect(() => {
    const fetchData = async () => {
      if (!companies || companies.length === 0) {
        setError('No companies available.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Eğer activeCompanyId yoksa, ilk şirketi aktif yap
        const currentCompanyId = activeCompanyId || companies[0].companyId;
        setActiveCompanyId(currentCompanyId);

        // Paralel veri çekimi: şirket detayları, belgeler ve görevler
        const [companyDetails, docs, tasksData] = await Promise.all([
          getCompanyDetails(currentCompanyId),
          tryQuery(getCompanyDocuments, 'Company'),
          tryQuery(getCompanyTasks, 'Task'),
        ]);

        dispatch(setActiveCompany(companyDetails));
        setCompany(companyDetails);
        setDocuments(docs);
        setTasks(tasksData);
      } catch (err: any) {
        console.error('Error fetching company data:', err);
        setError(err.message || 'Failed to fetch company data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companies, activeCompanyId, dispatch]);

  const handleRetryIncompleteFormation=async()=>{
    try {
      console.log('Retrying formation...');
      console.log('Active Company ID:', activeCompanyId);
      const response = await instance.post(`/checkout/retry-incomplete-formation`,{companyId:activeCompanyId});
      window.location.href=response.data.url;
    } catch (error: any) {
      console.error('Error retrying formation:', error);
      setError(error.message || 'Failed to retry formation.');
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
      <LoadingComponent />;
      </DashboardLayout>
    );
  }


  if(!companies || companies.length===0){
    return (
      <DashboardLayout>
        <NoCompanyComponent />;
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div>
        {/* Payment Pending Banner */}
        {company?.status === 'PAYMENT_PENDING' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-medium text-amber-900">Payment Required</h3>
                  <p className="text-amber-700 mt-1">
                    Please complete your payment to begin the company formation process.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleRetryIncompleteFormation}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Complete Payment
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/dashboard/support')}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-amber-600 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  Get Help
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[--primary] to-blue-600 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user.firstName}! 👋
              </h1>
              <p className="text-blue-100">
                Here's what's happening with your business today
              </p>
            </div>
            <div className="hidden md:block">
              <BarChart3 size={48} className="text-white/20" />
            </div>
          </div>
        </div>

        {/* Company Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[--primary]/10 rounded-lg">
                <Building2 className="w-5 h-5 text-[--primary]" />
              </div>
              <h2 className="text-lg font-semibold">Company Information</h2>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              company?.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
            }`}>
              {company&&getStatusText(company.status)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Company Name</p>
              <p className="font-medium">{company?.companyName}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Company Type</p>
              <p className="font-medium">{company?.companyType}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Registration State</p>
              <p className="font-medium">{company?.state}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Registration Date</p>
              <p className="font-medium">{formatDate(company?.createdAt || '')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[--primary]/10 rounded-lg">
                  <Clock className="w-5 h-5 text-[--primary]" />
                </div>
                <h2 className="text-lg font-semibold">Upcoming Tasks</h2>
              </div>
              <button 
                onClick={() => navigate('/dashboard/tasks')}
                className="text-sm text-[--primary] hover:text-[--primary]/80 flex items-center gap-1"
              >
                View all <ArrowRight size={16} />
              </button>
            </div>

            {tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task: any) => (
                  <div 
                    key={task.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/dashboard/tasks/details`, { state: { taskId: task.id } })}
                  >
                    <div className={`p-2 rounded-lg ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'HIGH' ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500">
                          Due {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4">
                <div className="w-16 h-16 bg-[--primary]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ListTodo className="w-8 h-8 text-[--primary]" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Upcoming Tasks
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  You're all caught up! When you have tasks to complete, they'll appear here. We'll notify you when new tasks are assigned.
                </p>
                <div className="inline-flex items-center gap-2 text-[--primary] hover:text-[--primary]/80 transition-colors">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-medium">All tasks completed</span>
                </div>
              </div>
            )}
          </div>

          {/* Recent Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[--primary]/10 rounded-lg">
                  <FileText className="w-5 h-5 text-[--primary]" />
                </div>
                <h2 className="text-lg font-semibold">Recent Documents</h2>
              </div>
              <button 
                onClick={() => navigate('/dashboard/documents')}
                className="text-sm text-[--primary] hover:text-[--primary]/80 flex items-center gap-1"
              >
                View all <ArrowRight size={16} />
              </button>
            </div>

            {documents.length > 0 ? (
              <div className="space-y-4">
                {documents.map((doc: any) => (
                  <div 
                    key={doc.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      {doc.fileType === 'pdf' ? (
                        <Pdf className="w-5 h-5" />
                      ) : (
                        <File className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Updated {formatDate(doc.updatedAt)}
                      </p>
                    </div>
                    <a 
                      href={doc.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-[--primary] transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4">
                <div className="w-16 h-16 bg-[--primary]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-[--primary]" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Documents Yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Your important documents will appear here once they're ready. We'll notify you when new documents are available for review.
                </p>
                <div className="inline-flex items-center gap-2 text-[--primary] hover:text-[--primary]/80 transition-colors">
                  <Info size={18} />
                  <span className="text-sm font-medium">Documents will be added soon</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}