import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { getAdminReports, updateReportStatus } from '../../services/adminService';

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await getAdminReports();
      setReports(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id, status) => {
    try {
      await updateReportStatus(id, status);
      setReports(reports.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Community Reports Resolution</h1>
        <p className="text-xs text-slate-500 mt-1">Review flagged recipes or comments submitted by users.</p>
      </div>

      {loading ? (
        <p className="py-8 text-center text-slate-500">Loading reports...</p>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-2">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No active community reports</h3>
          <p className="text-xs text-slate-500">All community flags have been resolved!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px] uppercase">
                    {report.reason}
                  </span>
                  <span className="text-xs text-slate-400">Reported by {report.reportedBy?.name || 'User'}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{report.recipe?.title || 'Reported Content'}</h4>
                <p className="text-xs text-slate-500">{report.description || 'No description provided'}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleResolve(report._id, 'resolved')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Resolve
                </button>
                <button
                  onClick={() => handleResolve(report._id, 'rejected')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" /> Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
