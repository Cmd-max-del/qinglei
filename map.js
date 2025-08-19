// 地图相关的 JavaScript 功能
let mapChart = null;
let trendChart = null;
let currentFarms = [];
let filteredFarms = [];

// 模拟养殖场数据
const farmData = [
    // 北京
    { id: 1, name: "北京绿源养殖场", province: "北京", lat: 39.9042, lng: 116.4074, status: "healthy", type: "蛋鸡", scale: 5000, lastTest: "2025-01-15", contact: "张经理" },
    { id: 2, name: "北京康达农业", province: "北京", lat: 40.0583, lng: 116.2436, status: "warning", type: "肉鸡", scale: 8000, lastTest: "2025-01-14", contact: "李经理" },
    
    // 河北
    { id: 3, name: "河北丰收养殖场", province: "河北", lat: 38.0437, lng: 114.5149, status: "healthy", type: "蛋鸡", scale: 12000, lastTest: "2025-01-15", contact: "王总" },
    { id: 4, name: "河北安全农业", province: "河北", lat: 38.8971, lng: 115.4458, status: "danger", type: "肉鸡", scale: 6000, lastTest: "2025-01-13", contact: "赵经理" },
    { id: 5, name: "河北现代养殖", province: "河北", lat: 39.5427, lng: 116.1204, status: "warning", type: "种鸡", scale: 3000, lastTest: "2025-01-14", contact: "陈总" },
    
    // 山东
    { id: 6, name: "山东昌盛养殖场", province: "山东", lat: 36.6512, lng: 117.1201, status: "healthy", type: "蛋鸡", scale: 15000, lastTest: "2025-01-15", contact: "孙经理" },
    { id: 7, name: "山东绿色农业", province: "山东", lat: 35.2103, lng: 118.1234, status: "danger", type: "肉鸡", scale: 10000, lastTest: "2025-01-12", contact: "周总" },
    { id: 8, name: "山东优质禽业", province: "山东", lat: 37.4638, lng: 118.8515, status: "healthy", type: "种鸡", scale: 4000, lastTest: "2025-01-15", contact: "吴经理" },
    
    // 江苏
    { id: 9, name: "江苏如意养殖", province: "江苏", lat: 32.0617, lng: 118.7778, status: "healthy", type: "蛋鸡", scale: 8000, lastTest: "2025-01-15", contact: "钱经理" },
    { id: 10, name: "江苏华东农业", province: "江苏", lat: 31.2304, lng: 121.4737, status: "warning", type: "肉鸡", scale: 12000, lastTest: "2025-01-14", contact: "沈总" },
    
    // 浙江
    { id: 11, name: "浙江良品养殖", province: "浙江", lat: 30.2741, lng: 120.1551, status: "healthy", type: "蛋鸡", scale: 6000, lastTest: "2025-01-15", contact: "冯经理" },
    { id: 12, name: "浙江生态农业", province: "浙江", lat: 28.2284, lng: 120.8526, status: "healthy", type: "种鸡", scale: 5000, lastTest: "2025-01-15", contact: "蒋总" },
    
    // 广东
    { id: 13, name: "广东南方养殖", province: "广东", lat: 23.1291, lng: 113.2644, status: "healthy", type: "肉鸡", scale: 20000, lastTest: "2025-01-15", contact: "韩经理" },
    { id: 14, name: "广东现代农业", province: "广东", lat: 22.3964, lng: 114.1095, status: "warning", type: "蛋鸡", scale: 9000, lastTest: "2025-01-14", contact: "魏总" },
    
    // 四川
    { id: 15, name: "四川天府养殖", province: "四川", lat: 30.5728, lng: 104.0668, status: "healthy", type: "种鸡", scale: 7000, lastTest: "2025-01-15", contact: "杨经理" },
    { id: 16, name: "四川绿色农业", province: "四川", lat: 31.1270, lng: 103.9402, status: "danger", type: "肉鸡", scale: 11000, lastTest: "2025-01-13", contact: "朱总" },
    
    // 湖南
    { id: 17, name: "湖南湘农养殖", province: "湖南", lat: 28.2278, lng: 112.9388, status: "healthy", type: "蛋鸡", scale: 8500, lastTest: "2025-01-15", contact: "徐经理" },
    { id: 18, name: "湖南优质禽业", province: "湖南", lat: 27.8236, lng: 113.0922, status: "warning", type: "肉鸡", scale: 6500, lastTest: "2025-01-14", contact: "许总" },
    
    // 湖北
    { id: 19, name: "湖北荆楚养殖", province: "湖北", lat: 30.5844, lng: 114.2998, status: "healthy", type: "蛋鸡", scale: 9500, lastTest: "2025-01-15", contact: "何经理" },
    { id: 20, name: "湖北生态农业", province: "湖北", lat: 30.9756, lng: 113.6640, status: "healthy", type: "种鸡", scale: 4500, lastTest: "2025-01-15", contact: "马总" },
    
    // 河南
    { id: 21, name: "河南中原养殖", province: "河南", lat: 34.7466, lng: 113.6254, status: "warning", type: "肉鸡", scale: 13000, lastTest: "2025-01-14", contact: "冯经理" },
    { id: 22, name: "河南丰收农业", province: "河南", lat: 35.2436, lng: 114.3587, status: "healthy", type: "蛋鸡", scale: 10500, lastTest: "2025-01-15", contact: "邓总" }
];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    initializeTrendChart();
    initializeFilters();
    updateStatistics();
    showAlert();
    
    // 设置当前数据
    currentFarms = farmData;
    filteredFarms = farmData;
});

// 初始化地图
function initializeMap() {
    mapChart = echarts.init(document.getElementById('chinaMap'));
    
    // 加载中国地图数据（使用在线地图数据）
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
        .then(response => response.json())
        .then(geoJson => {
            echarts.registerMap('china', geoJson);
            renderMap();
        })
        .catch(error => {
            console.log('地图数据加载失败，使用备用显示');
            renderMapFallback();
        });
}

// 渲染地图
function renderMap() {
    const mapData = farmData.map(farm => ({
        name: farm.province,
        value: [farm.lng, farm.lat, farm.status, farm.name, farm.id],
        status: farm.status,
        farmData: farm
    }));

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                if (params.data && params.data.farmData) {
                    const farm = params.data.farmData;
                    const statusText = {
                        'healthy': '健康',
                        'warning': '预警',
                        'danger': '风险'
                    };
                    const statusColor = {
                        'healthy': '#10b981',
                        'warning': '#f59e0b',
                        'danger': '#ef4444'
                    };
                    
                    return `
                        <div style="padding: 10px; min-width: 200px;">
                            <div style="font-weight: bold; margin-bottom: 8px; color: #1f2937;">
                                ${farm.name}
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span style="color: #6b7280;">状态:</span>
                                <span style="color: ${statusColor[farm.status]}; font-weight: bold;">
                                    ● ${statusText[farm.status]}
                                </span>
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span style="color: #6b7280;">类型:</span> ${farm.type}
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span style="color: #6b7280;">规模:</span> ${farm.scale.toLocaleString()}只
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span style="color: #6b7280;">最近检测:</span> ${farm.lastTest}
                            </div>
                            <div>
                                <span style="color: #6b7280;">联系人:</span> ${farm.contact}
                            </div>
                        </div>
                    `;
                }
                return params.name;
            }
        },
        geo: {
            map: 'china',
            aspectScale: 0.75,
            roam: true,
            itemStyle: {
                color: '#f0f9ff',
                borderColor: '#e2e8f0',
                borderWidth: 1
            },
            emphasis: {
                itemStyle: {
                    color: '#dbeafe'
                }
            },
            regions: []
        },
        series: [
            {
                type: 'scatter',
                coordinateSystem: 'geo',
                data: mapData,
                symbolSize: function(val) {
                    // 根据状态调整点的大小
                    const status = val[2];
                    return status === 'danger' ? 15 : status === 'warning' ? 12 : 10;
                },
                itemStyle: {
                    color: function(params) {
                        const status = params.data.value[2];
                        const colors = {
                            'healthy': '#10b981',
                            'warning': '#f59e0b',
                            'danger': '#ef4444'
                        };
                        return colors[status] || '#6b7280';
                    },
                    borderColor: '#ffffff',
                    borderWidth: 2
                },
                emphasis: {
                    scale: true,
                    itemStyle: {
                        borderWidth: 3
                    }
                }
            }
        ]
    };

    mapChart.setOption(option);
    
    // 点击事件
    mapChart.on('click', function(params) {
        if (params.data && params.data.farmData) {
            showFarmDetails(params.data.farmData);
        }
    });
}

// 备用地图渲染（当在线地图数据无法加载时）
function renderMapFallback() {
    const container = document.getElementById('chinaMap');
    container.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            color: #374151;
            text-align: center;
            padding: 2rem;
        ">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🗺️</div>
            <h3 style="margin-bottom: 1rem; color: #1f2937;">中国养殖场分布</h3>
            <p style="margin-bottom: 2rem; color: #6b7280;">地图数据加载中，请稍候...</p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; max-width: 400px;">
                <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="color: #10b981; font-size: 1.5rem; font-weight: bold;">1,234</div>
                    <div style="color: #6b7280; font-size: 0.8rem;">健康</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="color: #f59e0b; font-size: 1.5rem; font-weight: bold;">56</div>
                    <div style="color: #6b7280; font-size: 0.8rem;">预警</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="color: #ef4444; font-size: 1.5rem; font-weight: bold;">12</div>
                    <div style="color: #6b7280; font-size: 0.8rem;">风险</div>
                </div>
            </div>
        </div>
    `;
}

// 初始化趋势图表
function initializeTrendChart() {
    trendChart = echarts.init(document.getElementById('trendChart'));
    
    const dates = [];
    const healthyData = [];
    const warningData = [];
    const dangerData = [];
    
    // 生成过去30天的数据
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }));
        
        healthyData.push(Math.floor(Math.random() * 50) + 1200);
        warningData.push(Math.floor(Math.random() * 20) + 40);
        dangerData.push(Math.floor(Math.random() * 10) + 5);
    }
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['健康', '预警', '风险'],
            bottom: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: dates,
            axisLabel: {
                rotate: 45
            }
        },
        yAxis: {
            type: 'value',
            name: '养殖场数量'
        },
        series: [
            {
                name: '健康',
                type: 'line',
                data: healthyData,
                itemStyle: { color: '#10b981' },
                areaStyle: { color: 'rgba(16, 185, 129, 0.1)' },
                smooth: true
            },
            {
                name: '预警',
                type: 'line',
                data: warningData,
                itemStyle: { color: '#f59e0b' },
                areaStyle: { color: 'rgba(245, 158, 11, 0.1)' },
                smooth: true
            },
            {
                name: '风险',
                type: 'line',
                data: dangerData,
                itemStyle: { color: '#ef4444' },
                areaStyle: { color: 'rgba(239, 68, 68, 0.1)' },
                smooth: true
            }
        ]
    };
    
    trendChart.setOption(option);
}

// 初始化筛选器
function initializeFilters() {
    // 状态筛选
    document.getElementById('showHealthy').addEventListener('change', applyFilters);
    document.getElementById('showWarning').addEventListener('change', applyFilters);
    document.getElementById('showDanger').addEventListener('change', applyFilters);
    
    // 省份筛选
    document.getElementById('regionSelect').addEventListener('change', applyFilters);
    
    // 时间范围筛选
    document.getElementById('timeRange').addEventListener('change', applyFilters);
}

// 应用筛选器
function applyFilters() {
    const showHealthy = document.getElementById('showHealthy').checked;
    const showWarning = document.getElementById('showWarning').checked;
    const showDanger = document.getElementById('showDanger').checked;
    const selectedRegion = document.getElementById('regionSelect').value;
    
    filteredFarms = currentFarms.filter(farm => {
        // 状态筛选
        if (!showHealthy && farm.status === 'healthy') return false;
        if (!showWarning && farm.status === 'warning') return false;
        if (!showDanger && farm.status === 'danger') return false;
        
        // 省份筛选
        if (selectedRegion && farm.province !== selectedRegion) return false;
        
        return true;
    });
    
    updateMap();
    updateStatistics();
}

// 更新地图显示
function updateMap() {
    if (!mapChart) return;
    
    const mapData = filteredFarms.map(farm => ({
        name: farm.province,
        value: [farm.lng, farm.lat, farm.status, farm.name, farm.id],
        status: farm.status,
        farmData: farm
    }));
    
    mapChart.setOption({
        series: [{
            data: mapData
        }]
    });
}

// 更新统计数据
function updateStatistics() {
    const stats = filteredFarms.reduce((acc, farm) => {
        acc[farm.status]++;
        acc.total++;
        return acc;
    }, { healthy: 0, warning: 0, danger: 0, total: 0 });
    
    document.getElementById('healthyCount').textContent = stats.healthy.toLocaleString();
    document.getElementById('warningCount').textContent = stats.warning.toLocaleString();
    document.getElementById('dangerCount').textContent = stats.danger.toLocaleString();
    document.getElementById('totalCount').textContent = stats.total.toLocaleString();
}

// 显示养殖场详情
function showFarmDetails(farm) {
    const detailsContainer = document.getElementById('farmDetails');
    
    const statusText = {
        'healthy': '健康',
        'warning': '预警',
        'danger': '风险'
    };
    
    const statusClass = {
        'healthy': 'healthy',
        'warning': 'warning',
        'danger': 'danger'
    };
    
    detailsContainer.innerHTML = `
        <div class="farm-info">
            <div class="info-item">
                <span class="info-label">养殖场名称:</span>
                <span class="info-value">${farm.name}</span>
            </div>
            <div class="info-item">
                <span class="info-label">状态:</span>
                <span class="info-value">
                    <span class="status-indicator ${statusClass[farm.status]}"></span>
                    ${statusText[farm.status]}
                </span>
            </div>
            <div class="info-item">
                <span class="info-label">省份:</span>
                <span class="info-value">${farm.province}</span>
            </div>
            <div class="info-item">
                <span class="info-label">养殖类型:</span>
                <span class="info-value">${farm.type}</span>
            </div>
            <div class="info-item">
                <span class="info-label">养殖规模:</span>
                <span class="info-value">${farm.scale.toLocaleString()}只</span>
            </div>
            <div class="info-item">
                <span class="info-label">最近检测:</span>
                <span class="info-value">${farm.lastTest}</span>
            </div>
            <div class="info-item">
                <span class="info-label">联系人:</span>
                <span class="info-value">${farm.contact}</span>
            </div>
            <div class="info-item">
                <span class="info-label">养殖场ID:</span>
                <span class="info-value">#${farm.id.toString().padStart(4, '0')}</span>
            </div>
        </div>
    `;
}

// 地图工具栏功能
function zoomIn() {
    if (mapChart) {
        mapChart.dispatchAction({
            type: 'geoRoam',
            componentType: 'geo',
            zoom: 'zoomIn'
        });
    }
}

function zoomOut() {
    if (mapChart) {
        mapChart.dispatchAction({
            type: 'geoRoam',
            componentType: 'geo',
            zoom: 'zoomOut'
        });
    }
}

function resetZoom() {
    if (mapChart) {
        mapChart.dispatchAction({
            type: 'geoRoam',
            componentType: 'geo',
            zoom: 'reset'
        });
    }
}

function toggleFullscreen() {
    const mapContainer = document.querySelector('.map-display');
    if (!document.fullscreenElement) {
        mapContainer.requestFullscreen().then(() => {
            // 全屏后重新调整图表大小
            setTimeout(() => {
                if (mapChart) mapChart.resize();
            }, 100);
        });
    } else {
        document.exitFullscreen();
    }
}

// 刷新数据
function refreshData() {
    // 显示加载状态
    const refreshBtn = document.querySelector('.btn-primary');
    const originalText = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 刷新中...';
    refreshBtn.disabled = true;
    
    // 模拟数据刷新
    setTimeout(() => {
        // 随机更新一些养殖场的状态
        currentFarms.forEach(farm => {
            if (Math.random() < 0.1) { // 10%的概率状态改变
                const statuses = ['healthy', 'warning', 'danger'];
                farm.status = statuses[Math.floor(Math.random() * statuses.length)];
                farm.lastTest = new Date().toISOString().split('T')[0];
            }
        });
        
        applyFilters();
        updateMap();
        
        // 恢复按钮状态
        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;
        
        // 显示成功消息
        showToast('数据已刷新', 'success');
    }, 2000);
}

// 导出数据
function exportData() {
    const data = filteredFarms.map(farm => ({
        '养殖场名称': farm.name,
        '省份': farm.province,
        '状态': farm.status === 'healthy' ? '健康' : farm.status === 'warning' ? '预警' : '风险',
        '类型': farm.type,
        '规模': farm.scale + '只',
        '最近检测': farm.lastTest,
        '联系人': farm.contact
    }));
    
    const csv = convertToCSV(data);
    downloadCSV(csv, '养殖场监控报告.csv');
    
    showToast('报告已导出', 'success');
}

// 转换为CSV格式
function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(field => `"${row[field]}"`).join(','))
    ].join('\n');
    
    return csvContent;
}

// 下载CSV文件
function downloadCSV(csv, filename) {
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 显示警报面板
function showAlert() {
    setTimeout(() => {
        const alertPanel = document.getElementById('alertPanel');
        alertPanel.classList.add('show');
    }, 2000);
}

// 关闭警报面板
function closeAlert() {
    const alertPanel = document.getElementById('alertPanel');
    alertPanel.classList.remove('show');
}

// 显示提示消息
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// 窗口大小改变时重新调整图表
window.addEventListener('resize', function() {
    if (mapChart) {
        mapChart.resize();
    }
    if (trendChart) {
        trendChart.resize();
    }
});

// 导航菜单功能
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
});
