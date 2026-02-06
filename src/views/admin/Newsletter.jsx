import React, { useState, useEffect } from 'react';
import { MdEmail, MdDelete, MdFileDownload, MdTrendingUp, MdPeople } from 'react-icons/md';
import { FaSearch, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_newsletter_stats, get_newsletter_subscribers, delete_newsletter_subscriber, messageClear } from '../../store/Reducers/newsletterReducer';
import { useMarkNotificationsRead } from '../../hooks/useMarkNotificationsRead';
import moment from 'moment';
import toast from 'react-hot-toast';

const Newsletter = () => {
    const dispatch = useDispatch();
    const { subscribers, loader, successMessage, errorMessage, totalSubscribers } = useSelector(state => state.newsletter);
    
    // Marquer les notifications comme lues
    useMarkNotificationsRead('newsletter');
    
    const [localStats, setLocalStats] = useState({
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0
    });
    const [localSubscribers, setLocalSubscribers] = useState([]);
    const [filteredSubscribers, setFilteredSubscribers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubscribers, setSelectedSubscribers] = useState([]);

    useEffect(() => {
        loadNewsletterData();
    }, []);

    useEffect(() => {
        filterSubscribers();
    }, [localSubscribers, searchTerm]);
    
    const loadNewsletterData = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const statsResponse = await fetch(`${API_URL}/newsletter/stats`)
            const subscribersResponse = await fetch(`${API_URL}/newsletter/subscribers`)
            
            if (statsResponse.ok) {
                const statsData = await statsResponse.json()
                setLocalStats({
                    total: statsData.total || 0,
                    today: statsData.today || 0,
                    thisWeek: statsData.thisWeek || 0,
                    thisMonth: statsData.thisMonth || 0
                })
            }
            
            if (subscribersResponse.ok) {
                const subscribersData = await subscribersResponse.json()
                console.log('Données subscribers reçues:', subscribersData)
                setLocalSubscribers(subscribersData.subscribers || [])
                setFilteredSubscribers(subscribersData.subscribers || [])
            } else {
                console.error('Erreur subscribers response:', subscribersResponse.status)
            }
        } catch (error) {
            console.error('Erreur API newsletter:', error)
        }
    }
    
    const loadFromLocalStorage = () => {
        const stored = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]')
        setLocalSubscribers(stored)
        setFilteredSubscribers(stored)
        
        // Calculer les stats
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        
        // Mettre à jour les stats locales
        const calculatedStats = {
            total: stored.length,
            today: stored.filter(sub => new Date(sub.createdAt) >= today).length,
            thisWeek: stored.filter(sub => new Date(sub.createdAt) >= weekAgo).length,
            thisMonth: stored.filter(sub => new Date(sub.createdAt) >= monthAgo).length
        }
        
        setLocalStats(calculatedStats)
    }

    const filterSubscribers = () => {
        if (!searchTerm) {
            setFilteredSubscribers(localSubscribers);
        } else {
            const filtered = localSubscribers.filter(sub =>
                sub.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSubscribers(filtered);
        }
    };

    const deleteSubscriber = async (id) => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/newsletter/subscriber/${id}`, { 
                method: 'DELETE' 
            });
            
            if (response.ok) {
                await loadNewsletterData();
                toast.success('Abonné supprimé avec succès');
            } else {
                toast.error('Erreur lors de la suppression');
            }
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const deleteSelected = async () => {
        if (selectedSubscribers.length === 0) return;
        
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            // Supprimer chaque abonné sélectionné
            for (const id of selectedSubscribers) {
                await fetch(`${API_URL}/newsletter/subscriber/${id}`, { 
                    method: 'DELETE' 
                });
            }
            
            // Recharger les données
            await loadNewsletterData();
            setSelectedSubscribers([]);
            toast.success(`${selectedSubscribers.length} abonné(s) supprimé(s)`);
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const exportSubscribers = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Email,Date d'inscription\n"
            + localSubscribers.map(sub => `${sub.email},${moment(sub.subscribedAt || sub.createdAt).format('DD/MM/YYYY HH:mm')}`).join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `newsletter_subscribers_${moment().format('YYYY-MM-DD')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Export réalisé avec succès');
    };

    const toggleSelectAll = () => {
        if (selectedSubscribers.length === filteredSubscribers.length) {
            setSelectedSubscribers([]);
        } else {
            setSelectedSubscribers(filteredSubscribers.map(sub => sub._id));
        }
    };

    const StatCard = ({ title, value, icon, bgColor, iconBg, subtitle }) => (
        <div className={`${bgColor} rounded-2xl p-6 shadow-lg`}>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='text-sm font-medium text-gray-600 mb-1'>{title}</p>
                    <p className='text-3xl font-bold text-gray-800 mb-1'>{value}</p>
                    {subtitle && <p className='text-sm text-gray-500'>{subtitle}</p>}
                </div>
                <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 md:px-8 py-6'>
            {/* Header */}
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-gray-800 mb-2'>Gestion Newsletter</h1>
                <p className='text-gray-600'>Gérez vos abonnés et analysez les statistiques</p>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                <StatCard
                    title="Total Abonnés"
                    value={localStats.total}
                    icon={<MdPeople className='text-xl text-white' />}
                    bgColor='bg-gradient-to-br from-blue-50 to-blue-100'
                    iconBg='bg-gradient-to-br from-blue-500 to-blue-600'
                />
                <StatCard
                    title="Aujourd'hui"
                    value={localStats.today}
                    icon={<MdTrendingUp className='text-xl text-white' />}
                    bgColor='bg-gradient-to-br from-green-50 to-green-100'
                    iconBg='bg-gradient-to-br from-green-500 to-green-600'
                />
                <StatCard
                    title="Cette Semaine"
                    value={localStats.thisWeek}
                    icon={<FaCalendarAlt className='text-xl text-white' />}
                    bgColor='bg-gradient-to-br from-purple-50 to-purple-100'
                    iconBg='bg-gradient-to-br from-purple-500 to-purple-600'
                />
                <StatCard
                    title="Ce Mois"
                    value={localStats.thisMonth}
                    icon={<MdEmail className='text-xl text-white' />}
                    bgColor='bg-gradient-to-br from-orange-50 to-orange-100'
                    iconBg='bg-gradient-to-br from-orange-500 to-orange-600'
                />
            </div>

            {/* Actions Bar */}
            <div className='bg-white rounded-2xl shadow-lg p-6 mb-8'>
                <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
                    {/* Search */}
                    <div className='relative flex-1 max-w-md'>
                        <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                        <input
                            type="text"
                            placeholder="Rechercher par email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>

                    {/* Actions */}
                    <div className='flex gap-3'>
                        <button
                            onClick={exportSubscribers}
                            className='flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors'
                        >
                            <MdFileDownload />
                            Exporter CSV
                        </button>
                        {selectedSubscribers.length > 0 && (
                            <button
                                onClick={deleteSelected}
                                className='flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors'
                            >
                                <FaTrash />
                                Supprimer ({selectedSubscribers.length})
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Subscribers Table */}
            <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
                <div className='p-6 border-b border-gray-200'>
                    <h2 className='text-xl font-bold text-gray-800'>
                        Liste des Abonnés ({filteredSubscribers.length})
                    </h2>
                    <p className='text-sm text-gray-500 mt-1'>
                        Debug: {localSubscribers.length} total, {filteredSubscribers.length} filtrés
                    </p>
                </div>
                
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-4 text-left'>
                                    <input
                                        type="checkbox"
                                        checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                                        onChange={toggleSelectAll}
                                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                                    />
                                </th>
                                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Email
                                </th>
                                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Date d'inscription
                                </th>
                                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {filteredSubscribers.length > 0 ? filteredSubscribers.map((subscriber) => (
                                <tr key={subscriber.id} className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-4'>
                                        <input
                                            type="checkbox"
                                            checked={selectedSubscribers.includes(subscriber._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedSubscribers([...selectedSubscribers, subscriber._id]);
                                                } else {
                                                    setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriber._id));
                                                }
                                            }}
                                            className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                                        />
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center'>
                                            <MdEmail className='text-gray-400 mr-3' />
                                            <span className='text-sm font-medium text-gray-900'>{subscriber.email}</span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <span className='text-sm text-gray-500'>
                                            {moment(subscriber.subscribedAt).format('DD/MM/YYYY à HH:mm')}
                                        </span>
                                        <br />
                                        <span className='text-xs text-gray-400'>
                                            {moment(subscriber.subscribedAt).fromNow()}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <button
                                            onClick={() => deleteSubscriber(subscriber._id)}
                                            className='text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors'
                                            title="Supprimer"
                                            disabled={loader}
                                        >
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan='4' className='px-6 py-12 text-center text-gray-500'>
                                        <MdEmail className='mx-auto text-4xl mb-3 opacity-50' />
                                        <p>Aucun abonné trouvé</p>
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

export default Newsletter;