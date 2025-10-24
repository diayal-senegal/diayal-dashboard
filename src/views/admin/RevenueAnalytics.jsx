import React, { useState, useEffect } from 'react';
import { FaChartLine, FaCalendarAlt, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { MdOutlineCurrencyFranc } from 'react-icons/md';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import api from '../../api/api';
import toast from 'react-hot-toast';

const RevenueAnalytics = () => {
    const [revenueData, setRevenueData] = useState({
        totalRevenue: 0,
        monthlyRevenue: 0,
        weeklyRevenue: 0,
        dailyRevenue: 0,
        averageOrderValue: 0,
        revenueGrowth: 0,
        totalOrderCount: 0,
        monthlyData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRevenueData();
    }, []);

    const loadRevenueData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/revenue-analytics');
            setRevenueData(response.data);
        } catch (error) {
            console.error('Erreur chargement revenus:', error);
            toast.error('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    // Données pour le graphique mensuel
    const chartOptions = {
        series: [{
            name: 'Chiffre d\'Affaires',
            data: revenueData.monthlyData || []
        }],
        options: {
            chart: {
                type: 'area',
                height: 350,
                background: 'transparent',
                foreColor: '#e2e8f0',
                toolbar: { show: true }
            },
            colors: ['#3b82f6'],
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.3,
                    stops: [0, 90, 100]
                }
            },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 3 },
            xaxis: {
                categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
            },
            yaxis: {
                title: { text: 'Montant (FCFA)' },
                labels: {
                    formatter: function (val) {
                        return val.toLocaleString() + ' FCFA'
                    }
                }
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function (val) {
                        return val.toLocaleString() + ' FCFA'
                    }
                }
            },
            grid: {
                borderColor: '#374151',
                strokeDashArray: 3
            }
        }
    };

    const StatCard = ({ title, value, icon, bgColor, iconBg, trend, suffix = '' }) => (
        <div className={`relative overflow-hidden rounded-2xl ${bgColor} p-6 shadow-lg`}>
            <div className='flex items-center justify-between'>
                <div className='flex-1'>
                    <p className='text-sm font-medium text-gray-600 mb-1'>{title}</p>
                    <p className='text-3xl font-bold text-gray-800 mb-2'>
                        {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                    </p>
                    {trend !== undefined && (
                        <div className='flex items-center'>
                            {trend >= 0 ? (
                                <FaArrowUp className='text-green-500 mr-1' />
                            ) : (
                                <FaArrowDown className='text-red-500 mr-1' />
                            )}
                            <span className={`text-sm font-medium ${
                                trend >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {Math.abs(trend)}% ce mois
                            </span>
                        </div>
                    )}
                </div>
                <div className={`w-16 h-16 rounded-full ${iconBg} flex items-center justify-center shadow-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className='px-2 lg:px-7 pt-5 flex items-center justify-center min-h-screen'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
                    <p className='text-gray-600'>Chargement des données...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-gray-800 mb-2'>Chiffres d'Affaires</h1>
                <p className='text-gray-600'>Analyse détaillée des revenus de la plateforme</p>
            </div>

            {/* Statistiques principales */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                <StatCard
                    title="CA Total"
                    value={revenueData.totalRevenue}
                    icon={<MdOutlineCurrencyFranc className='text-2xl text-white' />}
                    bgColor='bg-gradient-to-br from-blue-50 to-blue-100'
                    iconBg='bg-gradient-to-br from-blue-500 to-blue-600'
                    trend={revenueData.revenueGrowth}
                    suffix=' FCFA'
                />
                <StatCard
                    title="CA Mensuel"
                    value={revenueData.monthlyRevenue}
                    icon={<FaCalendarAlt className='text-2xl text-white' />}
                    bgColor='bg-gradient-to-br from-green-50 to-green-100'
                    iconBg='bg-gradient-to-br from-green-500 to-green-600'
                    suffix=' FCFA'
                />
                <StatCard
                    title="CA Hebdomadaire"
                    value={revenueData.weeklyRevenue}
                    icon={<FaChartLine className='text-2xl text-white' />}
                    bgColor='bg-gradient-to-br from-purple-50 to-purple-100'
                    iconBg='bg-gradient-to-br from-purple-500 to-purple-600'
                    suffix=' FCFA'
                />
                <StatCard
                    title="Panier Moyen"
                    value={revenueData.averageOrderValue}
                    icon={<FaArrowUp className='text-2xl text-white' />}
                    bgColor='bg-gradient-to-br from-orange-50 to-orange-100'
                    iconBg='bg-gradient-to-br from-orange-500 to-orange-600'
                    suffix=' FCFA'
                />
            </div>

            {/* Graphique d'évolution */}
            <div className='bg-white rounded-2xl shadow-lg p-6 mb-8'>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-xl font-bold text-gray-800'>Évolution du Chiffre d'Affaires</h2>
                    <div className='flex items-center space-x-2 text-sm text-gray-500'>
                        <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                        <span>Données en temps réel</span>
                    </div>
                </div>
                <Chart options={chartOptions.options} series={chartOptions.series} type='area' height={350} />
            </div>

            {/* Métriques détaillées */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Répartition par période */}
                <div className='bg-white rounded-2xl shadow-lg p-6'>
                    <h3 className='text-lg font-bold text-gray-800 mb-4'>Répartition par Période</h3>
                    <div className='space-y-4'>
                        <div className='flex justify-between items-center p-3 bg-blue-50 rounded-lg'>
                            <span className='font-medium text-gray-700'>Aujourd'hui</span>
                            <span className='font-bold text-blue-600'>{revenueData.dailyRevenue.toLocaleString()} FCFA</span>
                        </div>
                        <div className='flex justify-between items-center p-3 bg-green-50 rounded-lg'>
                            <span className='font-medium text-gray-700'>Cette semaine</span>
                            <span className='font-bold text-green-600'>{revenueData.weeklyRevenue.toLocaleString()} FCFA</span>
                        </div>
                        <div className='flex justify-between items-center p-3 bg-purple-50 rounded-lg'>
                            <span className='font-medium text-gray-700'>Ce mois</span>
                            <span className='font-bold text-purple-600'>{revenueData.monthlyRevenue.toLocaleString()} FCFA</span>
                        </div>
                        <div className='flex justify-between items-center p-3 bg-orange-50 rounded-lg'>
                            <span className='font-medium text-gray-700'>Total</span>
                            <span className='font-bold text-orange-600'>{revenueData.totalRevenue.toLocaleString()} FCFA</span>
                        </div>
                    </div>
                </div>

                {/* Indicateurs de performance */}
                <div className='bg-white rounded-2xl shadow-lg p-6'>
                    <h3 className='text-lg font-bold text-gray-800 mb-4'>Indicateurs de Performance</h3>
                    <div className='space-y-4'>
                        <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                            <span className='font-medium text-gray-700'>Nombre de commandes</span>
                            <span className='font-bold text-gray-800'>{revenueData.totalOrderCount}</span>
                        </div>
                        <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                            <span className='font-medium text-gray-700'>Panier moyen</span>
                            <span className='font-bold text-gray-800'>{revenueData.averageOrderValue.toLocaleString()} FCFA</span>
                        </div>
                        <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                            <span className='font-medium text-gray-700'>Croissance</span>
                            <span className={`font-bold ${revenueData.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {revenueData.revenueGrowth >= 0 ? '+' : ''}{revenueData.revenueGrowth}%
                            </span>
                        </div>
                        <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                            <span className='font-medium text-gray-700'>Commission (10%)</span>
                            <span className='font-bold text-emerald-600'>{Math.floor(revenueData.totalRevenue * 0.1).toLocaleString()} FCFA</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueAnalytics;