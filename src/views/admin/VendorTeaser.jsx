import React, { useState, useEffect } from 'react';
import { FaUsers, FaPhone, FaFileDownload, FaChartLine, FaPalette } from 'react-icons/fa';
import { MdEmail, MdCalendarToday } from 'react-icons/md';
import moment from 'moment';
import toast from 'react-hot-toast';

const VendorTeaser = () => {
    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        thisWeek: 0
    });
    const [vendors, setVendors] = useState([]);
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVendorTeaserData();
        // Écouter l'événement de rafraîchissement des notifications
        const handleRefreshNotifications = () => {
            window.dispatchEvent(new CustomEvent('refreshNotifications'));
        };
        window.addEventListener('refreshNotifications', handleRefreshNotifications);
        return () => window.removeEventListener('refreshNotifications', handleRefreshNotifications);
    }, []);

    useEffect(() => {
        filterVendors();
    }, [vendors, searchTerm]);

    const loadVendorTeaserData = async () => {
        try {
            setLoading(true);
            
            // Charger les statistiques
            const baseURL = process.env.NODE_ENV === 'production' 
                ? 'https://diayal-backend.onrender.com/api' 
                : 'http://localhost:5000/api';
            const statsResponse = await fetch(`${baseURL}/vendor-teaser/stats`);
            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                setStats({
                    total: statsData.total || 0,
                    today: statsData.today || 0,
                    thisWeek: statsData.thisWeek || 0
                });
            }
            
            // Charger la liste des vendeurs
            const vendorsResponse = await fetch(`${baseURL}/vendor-teaser/list`);
            if (vendorsResponse.ok) {
                const vendorsData = await vendorsResponse.json();
                setVendors(vendorsData.vendors || []);
                setFilteredVendors(vendorsData.vendors || []);
            }
            
        } catch (error) {
            console.error('Erreur API vendor teaser:', error);
            toast.error('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const filterVendors = () => {
        if (!searchTerm) {
            setFilteredVendors(vendors);
        } else {
            const filtered = vendors.filter(vendor =>
                vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vendor.phone.includes(searchTerm)
            );
            setFilteredVendors(filtered);
        }
    };

    const exportVendors = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Nom,Email,Téléphone,Date d'inscription\\n"
            + vendors.map(vendor => 
                `"${vendor.name}","${vendor.email}","${vendor.phone}","${moment(vendor.createdAt).format('DD/MM/YYYY HH:mm')}"`
            ).join('\\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `inscriptions_teaser_${moment().format('YYYY-MM-DD')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Export réalisé avec succès');
    };

    const StatCard = ({ title, value, icon, bgColor, iconBg }) => (
        <div className={`${bgColor} rounded-2xl p-6 shadow-lg`}>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='text-sm font-medium text-gray-600 mb-1'>{title}</p>
                    <p className='text-3xl font-bold text-gray-800'>{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 md:px-8 py-6'>
                <div className='flex items-center justify-center h-64'>
                    <div className='text-center'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
                        <p className='text-gray-600'>Chargement des inscriptions teaser...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 md:px-8 py-6'>
            {/* Header */}
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-gray-800 mb-2'>Inscriptions Teaser</h1>
                <p className='text-gray-600'>Artisans intéressés par la plateforme Diayal</p>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
                <StatCard
                    title="Total Inscriptions"
                    value={stats.total}
                    icon={<FaPalette className='text-xl text-white' />}
                    bgColor='bg-gradient-to-br from-purple-50 to-purple-100'
                    iconBg='bg-gradient-to-br from-purple-500 to-purple-600'
                />
                <StatCard
                    title="Aujourd'hui"
                    value={stats.today}
                    icon={<FaChartLine className='text-xl text-white' />}
                    bgColor='bg-gradient-to-br from-green-50 to-green-100'
                    iconBg='bg-gradient-to-br from-green-500 to-green-600'
                />
                <StatCard
                    title="Cette Semaine"
                    value={stats.thisWeek}
                    icon={<MdCalendarToday className='text-xl text-white' />}
                    bgColor='bg-gradient-to-br from-blue-50 to-blue-100'
                    iconBg='bg-gradient-to-br from-blue-500 to-blue-600'
                />
            </div>

            {/* Actions Bar */}
            <div className='bg-white rounded-2xl shadow-lg p-6 mb-8'>
                <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
                    {/* Search */}
                    <div className='relative flex-1 max-w-md'>
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email ou téléphone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        />
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={loadVendorTeaserData}
                        className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'
                    >
                        🔄 Actualiser
                    </button>

                    {/* Export Button */}
                    <button
                        onClick={exportVendors}
                        className='flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors'
                    >
                        <FaFileDownload />
                        Exporter CSV
                    </button>
                </div>
            </div>

            {/* Vendors Table */}
            <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
                <div className='p-6 border-b border-gray-200'>
                    <h2 className='text-xl font-bold text-gray-800'>
                        Liste des Artisans ({filteredVendors.length})
                    </h2>
                </div>
                
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Nom
                                </th>
                                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Email
                                </th>
                                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Téléphone
                                </th>
                                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Date d'inscription
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {filteredVendors.length > 0 ? filteredVendors.map((vendor) => (
                                <tr key={vendor._id} className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center'>
                                            <FaUsers className='text-purple-400 mr-3' />
                                            <span className='text-sm font-medium text-gray-900'>{vendor.name}</span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center'>
                                            <MdEmail className='text-gray-400 mr-3' />
                                            <span className='text-sm text-gray-900'>{vendor.email}</span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center'>
                                            <FaPhone className='text-gray-400 mr-3' />
                                            <span className='text-sm text-gray-900'>{vendor.phone}</span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <span className='text-sm text-gray-500'>
                                            {moment(vendor.createdAt).format('DD/MM/YYYY à HH:mm')}
                                        </span>
                                        <br />
                                        <span className='text-xs text-gray-400'>
                                            {moment(vendor.createdAt).fromNow()}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan='4' className='px-6 py-12 text-center text-gray-500'>
                                        <FaPalette className='mx-auto text-4xl mb-3 opacity-50' />
                                        <p>Aucune inscription teaser trouvée</p>
                                        {searchTerm && (
                                            <p className='text-sm mt-2'>
                                                Essayez de modifier votre recherche
                                            </p>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorTeaser;